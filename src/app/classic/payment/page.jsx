'use client';

import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation'
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

const BuyPayment = () => {
  const [coinValue, setCoinValue] = useState({});
  const [inrValue, setInrValue] = useState(0);
  const [usdtValue, setUsdtValue] = useState(0);
  const [transactions, setTransaction] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(walletAddress)

  const router = useRouter()
  // const validateAddress = (address) => {

  // };
  // validateAddress();
  useEffect(() => {
    const storedInrValue = localStorage.getItem('inrValue');
    const storedUsdtValue = localStorage.getItem('usdtValue');

    if (storedInrValue) {
      setInrValue(JSON.parse(storedInrValue));
    }
    if (storedUsdtValue) {
      setUsdtValue(JSON.parse(storedUsdtValue));
    }
    console.log(storedInrValue, 'inrvalue');
    console.log(storedUsdtValue, 'USDT value');
  }, []);

  const payWithCashFree = () => {
    setLoading(true);
    if(!inrValue || inrValue == 0 || inrValue < 0|| !usdtValue|| usdtValue == 0 || usdtValue < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Incorrect Price!',
      }).then(() => {
        router.push(`/classic/buy`);
      })
      setLoading(false);
      return;
    }
    if (!walletAddress) {
      Swal.fire({
        icon: 'error',
        title: 'Please enter a valid wallet address',
      });
      setLoading(false);
      return;
    }    
    axios
      .post('http://localhost:3000/classic/kyc/api', {
        amount: '1',
        name: 'Hassan Marzooq',
        email: 'marzooq703@gmail.com',
        phone: "8903528906"
      })
      .then((val) => {
        const sessionId = val.data.response.payment_session_id
        console.log(sessionId);
        router.push(`https://dev.kazzefinserve.com/payment/?id=${sessionId}`);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error processing your payment',
        });
        setLoading(false);
        console.error(err);
      });


  }
  //-----------------------------------------------

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     if (typeof window !== 'undefined') {
  //       // Remove 'datas' from local storage when the URL changes
  //       localStorage.removeItem('datas');
  //     }
  //   };

  //   if (typeof window !== 'undefined') {
  //     // Subscribe to the event when the component mounts
  //     window.addEventListener('beforeunload', handleRouteChange);
  //   }

  //   // Unsubscribe from the event when the component unmounts
  //   return () => {
  //     if (typeof window !== 'undefined') {
  //       window.removeEventListener('beforeunload', handleRouteChange);
  //     }
  //   };
  // }, []);

  // Additional check to prevent 0, null, or undefined
  // if (
  //   coinValue.value === 0 ||
  //   coinValue.value === null ||
  //   coinValue.value === undefined
  // ) {
  //   return (
  //     <div className="max-w-screen-xl mx-auto mt-8 text-red-600">
  //       Error: Invalid CoinValue. Please provide a valid value.
  //     </div>
  //   );
  // }

  //   const handlePayButtonClick = () => {
  // Simulating a payment success or failure
  //     const paymentSuccess = true; // Set to false to simulate a failure
  //     // Show corresponding Swal message
  //     if (paymentSuccess) {
  //       MySwal.fire({
  //         icon: 'success',
  //         title: 'Payment Successful',
  //         text: 'Thank you for your payment!',
  //       });
  //     } else {
  //       MySwal.fire({
  //         icon: 'error',
  //         title: 'Payment Failed',
  //         text: 'Oops! Something went wrong with the payment.',
  //       });
  //     }
  //   };

  return (
    <div className="max-w-screen-xl mx-auto mt-8 space-y-8">
      {/* Confirm Information Box */}
      <div className="border rounded p-6 bg-white shadow-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Confirm Information
        </h2>

        {/* Line: You are about to receive __ Eth for __ rupees in wallet */}
        <p className="text-sm text-center mb-6 text-gray-600">
          You are about to receive{' '}
          <strong className="text-blue-500">{usdtValue || 0} USDT</strong> for{' '}
          <strong className="text-green-500">{inrValue || 0} INR</strong> in
          your wallet.
        </p>

        {/* Medium size box showing two things */}
        <div className="flex justify-between border rounded p-4 bg-gray-100">
          {/* Left side: To pay __ */}
          <div className="text-center">
            <p className="text-sm mb-2 text-gray-600">To pay</p>
            <strong className="text-red-500">{inrValue || 0} INR</strong>
          </div>

          {/* Right side: You get __ */}
          <div className="text-center">
            <p className="text-sm mb-2 text-gray-600">You get</p>
            <strong className="text-green-500">{usdtValue || 0} USDT</strong>
          </div>
        </div>
        <div>
          <label className="block text-md font-medium text-gray-600 mt-3">
            Type or paste a valid wallet address
          </label>
          <input type="text" className="form-input w-full border rounded-md" onChange={(e) => { 
            console.log(e);
            setWalletAddress(e.target.value) 
            }} />
        </div>
        <div className="block w-full text-md font-medium text-black text-center mt-6">
          <button
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md  w-full"
            onClick={payWithCashFree}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyPayment;
