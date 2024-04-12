'use client';
// @ts-ignore
import faceIO from '@faceio/fiojs';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const FaceVerification = () => {
  const router = useRouter();
  const [faceIo, setFaceIo] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    setFaceIo(new faceIO('fioab44a'));
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('crypto-user');
      setCurrentUser(JSON.parse(auth || {}));
    }
  }, []);
  useEffect(() => {
    if (!currentUser) {
      router.push('/authentication');
    }
  }, [currentUser]);
  function handleError(errCode) {
    // Handle error here
    // Log all possible error codes during user interaction..
    // Refer to: https://faceio.net/integration-guide#error-codes
    // for a detailed overview when these errors are triggered.
    const fioErrs = faceIo.fetchAllErrorCodes();
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
  async function authenticateUser() {
    try {
      const userData = await faceIo.authenticate({
        locale: 'auto', // Default user locale
      });

      router.push('/');
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
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Verify your face to Login</h1>
      <Button shape="rounded" onClick={authenticateUser}>
        Verify
      </Button>
    </div>
  );
};
export default FaceVerification;
