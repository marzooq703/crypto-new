'use client';

import { useState, useEffect } from 'react';
import AnchorLink from '@/components/ui/links/anchor-link';
import Checkbox from '@/components/ui/forms/checkbox';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import { useRouter } from 'next/navigation';

// import icons
import { EyeIcon } from '@/components/icons/eye';
import { EyeSlashIcon } from '@/components/icons/eyeslash';
import { signInWithEmailAndPassword } from 'firebase/auth';
import routes from '@/config/routes';
import { auth } from '../../lib/firebase';
// import GeoFencing from '../geoFencing/page';

type SignInStatus = 'success' | 'failed' | null;

export default function SignInForm() {
  const router = useRouter();

  const [state, setState] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInStatus, setSignInStatus] = useState<SignInStatus>(null); // Track sign-in status

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
      router.push('/classic/kyc');
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
