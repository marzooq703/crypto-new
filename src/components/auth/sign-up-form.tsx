'use client';

import { useState } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { db, auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { setDoc, doc, updateDoc } from 'firebase/firestore';

// import icons
import { EyeIcon } from '@/components/icons/eye';
import { EyeSlashIcon } from '@/components/icons/eyeslash';
import { createUserWithEmailAndPassword } from 'firebase/auth';

type SignUpStatus = 'success' | 'failed' | null;

export default function SignUpForm() {
  const router = useRouter();

  const [state, setState] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState<SignUpStatus>(null); // Track sign-in status

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
        console.log('User registered successflly:', user);
        const isKYCsuccessful = true;
        if (isKYCsuccessful) {
          await updateDoc(doc(db, 'users', email), {
            isKycVerified: true,
          });
        }
        setSignUpStatus('success');
        router.push('/classic/kyc');
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

  return (
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
        type="email"
        placeholder="Email"
        inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleInputChange();
        }}
      />
      <Input
        type="text"
        placeholder="Contact Number"
        inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
        value={contactNumber}
        onChange={(e) => {
          setContactNumber(e.target.value), handleInputChange();
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
  );
}
