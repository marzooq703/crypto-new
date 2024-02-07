'use client';

import { useEffect, useState } from 'react';
import Logo from '@/components/ui/logo';
import Image from 'next/image';
import SignInForm from '@/components/auth/sign-in-form';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/Loading/page';

// import images and icons
import BitcoinImg from '@/assets/images/bit-coin.png';
import GoogleIcon from '@/assets/images/google-icon.svg';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      console.log(user);

      // Redirect to the home page after successful sign-in
      router.push('/'); // Replace '/' with your desired home page route
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Simulate loading delay for demonstration purposes
    const timeout = setTimeout(() => {
      setLoading(false); // Hide loading screen after 2 seconds
    }, 2000);

    return () => clearTimeout(timeout); // Clear timeout on component unmount
  }, []);

  if (loading) {
    return <LoadingScreen />; // Display loading screen while waiting
  }

  return (
    <div className="grid flex-grow grid-cols-1 gap-0 lg:grid-cols-[1fr_40%] 3xl:grid-cols-2">
      <div className="flex flex-col items-center justify-center py-14">
        <div className="grid w-full max-w-[408px] grid-cols-1 gap-4 px-4">
          <div className="mx-auto mb-2 w-20 lg:ml-0 xl:w-24">
            <Logo className="!w-full" />
          </div>
          <div className="mb-5 text-center lg:text-left">
            <h2 className="mb-2 text-xl font-medium uppercase dark:text-white lg:text-2xl">
              Welcome Back!
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-gray-300">
              Please login account with your info
            </p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-2.5 rounded-md border-2 border-[#F3F4F6] bg-[#F3F4F6] py-2 text-sm font-medium text-black transition-all hover:bg-transparent dark:border-brand dark:bg-brand dark:text-gray-300 dark:hover:bg-transparent sm:rounded-lg sm:tracking-[0.04em]"
          >
            <div className="relative h-5 w-5 sm:h-7 sm:w-7">
              <Image
                src={GoogleIcon}
                alt="google-icon"
                width={24}
                height={24}
              />
            </div>
            Log in with Google
          </button>
          <p className="flex items-center justify-center gap-3 text-sm text-[#4B5563] before:h-[1px] before:w-full before:border-t before:border-dashed after:h-[1px] after:w-full after:border-t after:border-dashed dark:text-gray-300 dark:before:border-gray-500 dark:after:border-gray-500 ">
            or
          </p>
          <SignInForm />
          <p className="text-sm tracking-[0.5px] text-[#4B5563] dark:text-gray-300">
            Not member yet?{' '}
            <AnchorLink
              href={routes.signUp}
              className="font-medium underline hover:text-black/80 dark:text-gray-300"
            >
              Create an account
            </AnchorLink>
          </p>
        </div>
      </div>
      <div className="relative hidden bg-[#F3F4F6] lg:block">
        <Image src={BitcoinImg} alt="sign-up" fill className="object-cover" />
      </div>
    </div>
  );
}
