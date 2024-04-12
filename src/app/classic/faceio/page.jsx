'use client';
import faceIO from '@faceio/fiojs';
import { useEffect } from 'react';

// import dynamic from 'next/dynamic';
// const faceIO = dynamic(() => import('@faceio/fiojs'), { ssr: false });

// const faceio = new faceIO('fioab44a'); // Get the application Public ID at https://console.faceio.net.
const API_KEY = 'fioab44a';
function App() {
  let faceio;
  useEffect(() => {
    faceio = new faceIO('fioab44a');
  }, []);
  // const faceio = new faceIO('fioab44a');
  async function authenticateUser() {
    try {
      const userData = await faceio.authenticate({
        locale: 'auto', // Default user locale
      });

      console.log('Success, user identified');
      // Grab the facial ID linked to this particular user which will be same
      // for each of his successful future authentication. FACEIO recommend
      // that your rely on this Facial ID if you plan to uniquely identify
      // all enrolled users on your backend for example.
      console.log('Linked facial Id: ' + userData.facialId);
      // Grab the arbitrary data you have already linked (if any) to this particular user
      // during his enrollment via the payload parameter of the enroll() method.
      console.log('Payload: ' + JSON.stringify(userData.payload)); // {"whoami": 123456, "email": "john.doe@example.com"} from the enroll() example above
    } catch (error) {
      handleError(error.code);
    }
  }
  function handleError(errCode) {
    // Handle error here
    // Log all possible error codes during user interaction..
    // Refer to: https://faceio.net/integration-guide#error-codes
    // for a detailed overview when these errors are triggered.
    const fioErrs = faceio.fetchAllErrorCodes();
    switch (errCode) {
      case fioErrs.PERMISSION_REFUSED:
        console.log('Access to the Camera stream was denied by the end user');
        break;
      case fioErrs.NO_FACES_DETECTED:
        console.log(
          'No faces were detected during the enroll or authentication process',
        );
        break;
      case fioErrs.UNRECOGNIZED_FACE:
        console.log("Unrecognized face on this application's Facial Index");
        break;
      case fioErrs.MANY_FACES:
        console.log('Two or more faces were detected during the scan process');
        break;
      case fioErrs.FACE_DUPLICATION:
        console.log(
          'User enrolled previously (facial features already recorded). Cannot enroll again!',
        );
        break;
      case fioErrs.MINORS_NOT_ALLOWED:
        console.log('Minors are not allowed to enroll on this application!');
        break;
      case fioErrs.PAD_ATTACK:
        console.log(
          'Presentation (Spoof) Attack (PAD) detected during the scan process',
        );
        break;
      case fioErrs.FACE_MISMATCH:
        console.log(
          'Calculated Facial Vectors of the user being enrolled do not match',
        );
        break;
      case fioErrs.WRONG_PIN_CODE:
        console.log('Wrong PIN code supplied by the user being authenticated');
        break;
      // ...
      // Refer to the boilerplate at: https://gist.github.com/symisc/34203d2811a39f2a871373abc6dd1ce9
      // for the list of all possible error codes.
    }
  }

  async function enrollNewUser() {
    try {
      const userInfo = await faceio.enroll({
        locale: 'auto', // Default user locale
        payload: {
          /* The payload we want to associate with this particular user which is forwarded back to us upon future authentication of this user.*/
          whoami: 123423, // Dummy ID linked to this particular user
          email: 'ahamedaqeel703@gmail.com',
        },
      });

      alert(
        `User Successfully Enrolled! Details:
            Unique Facial ID: ${userInfo.facialId}
            Enrollment Date: ${userInfo.timestamp}
            Gender: ${userInfo.details.gender}
            Age Approximation: ${userInfo.details.age}`,
      );
    } catch (error) {
      handleError(error.code);
    }
  }
  return (
    <div className="App">
      <button onClick={enrollNewUser}>Enroll New User</button>
      <button onClick={authenticateUser}>Authenticate User</button>
    </div>
  );
}
App.getInitialProps = async (ctx) => {
  return { host: ctx.req.headers.host };
};

export default App;
