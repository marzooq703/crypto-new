'use client';
import axios from 'axios';
import { useEffect } from 'react';

const KYC = () => {
  useEffect(() => {
    axios
      .get('/classic/kyc/api')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <div>KYC</div>
    </>
  );
};
export default KYC;
