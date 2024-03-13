'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button/button';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { getFirestore } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
const KYC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const id = searchParams.get('id');

  useEffect(() => {
    if (success == 'false') {
      alert('KYC Failed');
    }
    if (success != 'false' && id) {
      alert('KYC was successfull');
    }
  }, []);
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
          console.log('ashiq');
        }}
      >
        Complete Aadhar KYC
      </Button>
    </>
  );
};
export default KYC;
