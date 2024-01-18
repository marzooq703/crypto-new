'use client';

import { useState } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

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
  const [signUpStatus, setSignUpStatus] = useState<SignUpStatus>(null); // Track sign-in status

  const signUp = (e: React.FormEvent) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setSignUpStatus('success');
        router.push('/classic');
      })
      .catch((error) => {
        console.log(error);
        setSignUpStatus('failed');
      });
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(e);
  }

  return (
    <form noValidate onSubmit={signUp} className="grid grid-cols-1 gap-4">
      {/* Display success or failure message */}
      {signUpStatus === 'success' && (
        <div className="text-green-500">Sign-in successful!</div>
      )}
      {signUpStatus === 'failed' && (
        <div className="text-red-500">
          Sign-in failed. Please check your credentials.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
        <Input
          type="text"
          placeholder="First Name"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Last Name"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280]"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <Input
        type="email"
        placeholder="Email"
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
