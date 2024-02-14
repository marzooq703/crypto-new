'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button/button';
import { useRouter } from 'next/navigation';

const KYC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Button
        shape="rounded"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          axios
            .get('/classic/kyc/api')
            .then((response) => {
              console.log(response);
              const url = response.data.res.url;
              if (url) {
                alert(url);
                router.push(url);
              } else {
                alert('Problem proceeding with KYC');
              }
              setIsLoading(false);
            })
            .catch((error) => {
              console.error(error);
              setIsLoading(false);
            });
        }}
      >
        Complete Aadhar KYC
      </Button>
    </>
  );
};
export default KYC;
