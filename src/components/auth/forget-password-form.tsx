'use client';

import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = () => {
    const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
            Swal.fire({
          icon: 'success',
          title: `Password resent email send to ${email}, please follow the steps tp reset ypur password`,
        })
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: errorCode,
      })
      console.log(errorCode)
      console.log(errorMessage)
      // ..
    });
  }

  return (
    <>
      <div>
        <p className="mb-2.5 text-left text-sm font-medium text-[#6B7280] rtl:text-right dark:text-gray-300">
          Email Address
        </p>
        <Input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter your email"
          inputClassName="focus:!ring-0 placeholder:text-[#6B7280] !mt-0"
        />
      </div>
      <Button
       onClick={handleSubmit}
        className="mt-5 rounded-lg !text-sm uppercase tracking-[0.04em]"
      >
        Send Reset code
      </Button>
    </>
  );
}
