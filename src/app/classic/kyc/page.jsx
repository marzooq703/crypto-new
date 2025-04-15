'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
const KYC = () => {
  const router = useRouter();
  return (
    <>
      <b>KYC</b>
      <div>
        Please send your orginal Aadhar card and Pan card details to
        care@zuthod.com and verify your account
      </div>
      <Button
        onClick={() => {
          router.push('/classic');
        }}
      >
        Back to Home
      </Button>
    </>
  );
};
export default KYC;
