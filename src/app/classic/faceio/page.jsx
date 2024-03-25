'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button/button';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { getFirestore } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import faceIO from '@faceio/fiojs';

const faceio = new faceIO('fd07583c1f6f3034dcf990990138c461'); // Get the application Public ID at https://console.faceio.net.
const API_KEY = 'fd07583c1f6f3034dcf990990138c461';
function App() {
  return (
    <div className="App">
      <button onClick={enrollNewUser}>Enroll New User</button>
      <button onClick={authenticateUser}>Authenticate User</button>
    </div>
  );
}

async function authenticateUser() {
  try {
    const response = await axios.post(
      'https://api.faceio.net/authenticate',
      {
        locale: 'auto', // Default user locale
      },
      {
        headers: {
          'WWW-Authenticate': `Bearer ${API_KEY}`,
        },
      },
    );

    const userData = response.data;

    console.log('Success, user identified');
    // Handle user data as needed
  } catch (error) {
    console.log(error);
    handleError(error?.response?.data?.code);
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
    const response = await axios.post(
      'https://api.faceio.net/enroll',
      {
        locale: 'auto', // Default user locale
        payload: {
          /* The payload we want to associate with this particular user which is forwarded back to us upon future authentication of this user.*/
          whoami: 123456, // Dummy ID linked to this particular user
          email: 'ahamed703aqeel@gmail.com',
        },
      },
      {
        headers: {
          'WWW-Authenticate': `Bearer ${API_KEY}`,
        },
      },
    );

    const userInfo = response.data;

    alert(
      `User Successfully Enrolled! Details:
          Unique Facial ID: ${userInfo.facialId}
          Enrollment Date: ${userInfo.timestamp}
          Gender: ${userInfo.details.gender}
          Age Approximation: ${userInfo.details.age}`,
    );
  } catch (error) {
    handleError(error.response.data.code);
  }
}

export default App;
