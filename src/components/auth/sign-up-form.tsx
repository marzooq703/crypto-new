// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import faceIO from '@faceio/fiojs';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { db, auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import Swal from 'sweetalert2';
// import icons
import { EyeIcon } from '@/components/icons/eye';
import { EyeSlashIcon } from '@/components/icons/eyeslash';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import PinCode from '../ui/forms/pin-code';

type SignUpStatus = 'success' | 'failed' | null;

export default function SignUpForm() {
  const router = useRouter();

  const [faceIo, setFaceIo] = useState({});

  const [state, setState] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [isSignupOTPSend, setIsSignupOTPSend] = useState(false);
  const [otp, setOtp] = useState('');
  const [typingOtp, setTypingOtp] = useState('');
  const [signUpStatus, setSignUpStatus] = useState<SignUpStatus>(null); // Track sign-in status

  console.log(typingOtp)
  useEffect(() => {
    setFaceIo(new faceIO('fioab44a'));
  }, []);
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
  async function enrollNewUser() {
    try {
      const userInfo = await faceIo.enroll({
        locale: 'auto', // Default user locale
        payload: {
          /* The payload we want to associate with this particular user which is forwarded back to us upon future authentication of this user.*/
          uid: 123423, // Dummy ID linked to this particular user
          email: email,
        },
      });
      setTimeout(() => {
        router.push('/classic/kyc');
      }, 2000);
      // alert(
      //   `User Successfully Enrolled! Details:
      //       Unique Facial ID: ${userInfo.facialId}
      //       Enrollment Date: ${userInfo.timestamp}
      //       Gender: ${userInfo.details.gender}
      //       Age Approximation: ${userInfo.details.age}`,
      // );
    } catch (error) {
      handleError(error.code);
    }
  }

  const verifyEmail = () => {
    // Construct the email link credential from the current URL.
    const auth = getAuth();
    console.log(auth.currentUser.email);
    const otp = Math.floor(Math.random() * 90000) + 10000;
    setOtp(otp);
    console.log(otp);
    axios
      .post('http://localhost:3000/classic/send-email', {
        otp: otp,
        email: auth.currentUser.email,
      })
      .then((val) => {
        Swal.fire({
          icon: 'success',
          title: `OTP send to ${auth.currentUser.email}`,
        }).then(() => {
          setIsSignupOTPSend(true);
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Sending Email',
        });
        // setLoading(false);
        console.error(err);
      });

    // enrollNewUser();
  };
  const signUp = (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    if (!allFieldsFilled) {
      alert('Please fill in all the fields.');
      return;
    }

    if (!agreeChecked) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, 'users', email), {
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          contactNumber: contactNumber,
          uid: user.uid,
          isKycVerified: false,
        });
        return user;
        // return addDoc(collection(db, 'users'), {
        //   firstName: firstName,
        //   lastName: lastName,
        //   email: user.email,
        //   contactNumber: contactNumber,
        //   uid: user.uid,
        // });
      })
      .then(async (user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'crypto-user',
            JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: user.email,
              contactNumber: contactNumber,
              uid: user.uid,
              isKycVerified: false,
            }),
          );
        }
        console.log('User registered successflly:', user);
        const isKYCsuccessful = true;
        if (isKYCsuccessful) {
          await updateDoc(doc(db, 'users', email), {
            isKycVerified: true,
          });
        }
        setSignUpStatus('success');
        verifyEmail();
      })
      // .then((val) => {
      //   console.log('AUTH DA', val);
      //   setSignUpStatus('success');
      //   router.push('/classic');
      // })
      .catch((error) => {
        console.error('error registering:', error);
        if (error.message == 'Firebase: Error (auth/email-already-in-use).')
          setError('Email already in use!');
        else if (
          error.message ==
          'Firebase: Password should be at least 6 characters (auth/weak-password).'
        )
          setError('Password should be at least 6 characters');
        else {
          setError(error.message);
        }
        setSignUpStatus('failed');
      });
  };

  const handleInputChange = () => {
    if (firstName && lastName && email && password && contactNumber) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };
  // function handleSubmit(e: any) {
  //   e.preventDefault();
  //   console.log(e);
  // }

  if (isSignupOTPSend)
    return (
      <>
        <div>Enter OTP</div>
        <div>
          {/* <Input
            type="text"
            placeholder="12345"
            inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
            value={typingOtp}
            onChange={(e) => {
              setTypingOtp(e.target.value);
            }}
          /> */}
          <PinCode
        length={5}
        type="number"
        placeholder="-"
        inputClassName="reset-password-pin-code border-[#E3E8ED] focus:border-[#111827] focus:ring-gray-900 dark:focus:ring-gray-200 dark:focus:ring-1 !text-lg lg:!text-2xl 2xl:!text-[32px] w-12 h-14 lg:w-14 lg:h-16 2xl:w-16 2xl:h-[72px] !mr-0 focus:!ring-opacity-0 dark:focus:!ring-opacity-100"
        setValue={setTypingOtp}
        className=" gap-3 sm:gap-4 2xl:mb-12 2xl:gap-6"
      />
        </div>
        <Button
          onClick={() => {
            if (otp == typingOtp) {
              Swal.fire({
                icon: 'success',
                title: `OTP Verified successfully, please enroll your face`,
              });
              enrollNewUser();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Incorrect OTP',
              });
            }
          }}
          className="mt-5 rounded-lg !text-sm uppercase tracking-[0.04em]"
        >
          Verify OTP
        </Button>
      </>
    );
  return (
    <>
      <form noValidate onSubmit={signUp} className="grid grid-cols-1 gap-4">
        {/* Display success or failure message */}
        {signUpStatus === 'success' && (
          <div className="text-green-500">Sign Up successful!</div>
        )}
        {signUpStatus === 'failed' && (
          <div className="text-red-500">
            {error || 'Sign-up failed. Please check your credentials.'}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <Input
            type="text"
            placeholder="First Name"
            inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              handleInputChange();
            }}
          />
          <Input
            type="text"
            placeholder="Last Name"
            inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              handleInputChange();
            }}
          />
        </div>
        <Input
          type="text"
          placeholder="Contact Number"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
          value={contactNumber}
          onChange={(e) => {
            setContactNumber(e.target.value), handleInputChange();
          }}
        />
        <Input
          type="email"
          placeholder="Email"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleInputChange();
          }}
        />
        <div className="relative">
          <Input
            type={state ? 'text' : 'password'}
            placeholder="Password"
            inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value), handleInputChange();
            }}
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
        <Checkbox
          iconClassName="bg-[#4B5563] rounded mt-0.5"
          label={
            <>
              I’ve read and agree with
              <AnchorLink
                href={'#'}
                className="ml-2 font-medium tracking-[0.5px] underline dark:text-gray-300"
              >
                Terms of Service and our Privacy Policy
              </AnchorLink>
            </>
          }
          labelPlacement="end"
          labelClassName="ml-1.5 text-[#4B5563] !t   ext-xs dark:text-gray-300 tracking-[0.5px] !leading-7"
          containerClassName="!items-start"
          inputClassName="mt-1 focus:!ring-offset-[1px]"
          size="sm"
          checked={agreeChecked}
          onChange={(e) => setAgreeChecked(e.target.checked)}
          disabled={!allFieldsFilled}
        />
        <Button
          type="submit"
          className="mt-5 rounded-lg !text-sm uppercase tracking-[0.04em]"
        >
          sign up
        </Button>
      </form>
    </>
  );
}
