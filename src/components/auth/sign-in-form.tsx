// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
// import icons
import { EyeIcon } from '@/components/icons/eye';
import { EyeSlashIcon } from '@/components/icons/eyeslash';
import { signInWithEmailAndPassword } from 'firebase/auth';
import routes from '@/config/routes';
import { auth } from '../../lib/firebase';
// import GeoFencing from '../geoFencing/page';
import faceIO from '@faceio/fiojs';

type SignInStatus = 'success' | 'failed' | null;

export default function SignInForm() {
  const router = useRouter();

  const [state, setState] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInStatus, setSignInStatus] = useState<SignInStatus>(null); // Track sign-in status
  const [faceIo, setFaceIo] = useState({});
  const [tempFace, setTempFace] = useState(0);

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

      router.push('/classic');
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
      console.log('post error');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  useEffect(() => {
    setFaceIo(new faceIO('fioab44a'));
  }, []);
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(userCredential);
      setSignInStatus('success');
      if (typeof window !== 'undefined') {
        const unsub = onSnapshot(doc(db, 'users', email), (doc) => {
          const data = doc.data();
          console.log('Current data: ', data);
          localStorage.setItem('crypto-user', JSON.stringify(data));
        });
      }
      authenticateUser();
      // router.push('/authentication/face-verification/verify');
    } catch (error) {
      console.error(error);
      setSignInStatus('failed');
    }
  };

  // function handleSubmit(e: any) {
  //   e.preventDefault();
  // }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email || ''); // Fill email field with user's email
      }
    });

    return () => {
      unsubscribe();
    };
  }, []); // Only run this effect once on component mount

  return (
    <form noValidate onSubmit={signIn} className="grid grid-cols-1 gap-4">
      {/* Display success or failure message */}
      {/* <GeoFencing/> */}
      {signInStatus === 'success' && (
        <div className="text-green-500">Sign-in successful!</div>
      )}
      {signInStatus === 'failed' && (
        <div className="text-red-500">
          Sign-in failed. Please check your credentials.
        </div>
      )}

      <Input
        type="email"
        placeholder="Enter your email"
        inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <Input
          type={state ? 'text' : 'password'}
          placeholder="Password"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="absolute bottom-3 right-4 cursor-pointer text-[#6B7280] rtl:left-4 rtl:right-auto sm:bottom-3.5"
          onClick={() => setState(!state)}
        >
          {state ? (
            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          iconClassName="bg-[#4B5563] rounded focus:!ring-0"
          label="Remember me"
          labelPlacement="end"
          labelClassName="ml-1.5 mt-1 text-[#4B5563] sm:text-sm dark:text-gray-300 tracking-[0.5px]"
          inputClassName="mt-0.5 focus:!ring-offset-[1px]"
          size="sm"
        />
        <AnchorLink
          href={routes.forgetPassword}
          className="inline-block text-sm font-medium tracking-[0.5px] text-[#4B5563] underline dark:text-gray-300"
        >
          Forgot Password
        </AnchorLink>
      </div>
      <Button
        type="submit"
        className="mt-5 rounded-lg !text-sm uppercase tracking-[0.04em]"
      >
        Log In
      </Button>
    </form>
  );
}
