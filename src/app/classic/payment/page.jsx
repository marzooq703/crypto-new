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
  const [total, setTotal] = useState(0);
  const [inrValue, setInrValue] = useState(0);
  const [usdtValue, setUsdtValue] = useState(0);
  const [tds, setTds] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    uid: "",
    isKycVerified: false
  });
  console.log(walletAddress)

  const router = useRouter()
  // const validateAddress = (address) => {

  // };
  // validateAddress();
  useEffect(() => {
    const storedInrValue = localStorage.getItem('inrValue');
    const storedUsdtValue = localStorage.getItem('usdtValue');
    const tds = localStorage.getItem('tds-value');
    const totalValue = localStorage.getItem('total-value');

    const user = localStorage.getItem('crypto-user');

    if (storedInrValue) {
      setInrValue(JSON.parse(storedInrValue));
    }
    if (storedUsdtValue) {
      setUsdtValue(JSON.parse(storedUsdtValue));
    }
    if (tds) {
      setTds(JSON.parse(tds));
    }
    if (totalValue) {
      setTotal(JSON.parse(totalValue));
    }
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const payWithCashFree = () => {
    setLoading(true);
    // TODO: Hassan - Refactor this
    if (!inrValue || inrValue == 0 || inrValue < 0 || !usdtValue || usdtValue == 0 || usdtValue < 0 || !tds || tds == 0 || tds < 0 || !total || total == 0 || total < 0) {
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
    if(!user?.email) {
      Swal.fire({
        icon: 'error',
        title: 'Please login again',
        text: 'It is for your security reasons, thanks for understanding!',
      });
      return;
    }
    axios
      .post('https://www.stablecrypto.in/classic/kyc/api', {
        amount: total,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        phone: user?.contactNumber
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
          Payment Confirmation
        </h2>

        {/* Line: You are about to receive __ Eth for __ rupees in wallet */}
        <p className="text-sm text-center mb-6 text-gray-600">
          You are about to receive{' '}
          <strong className="text-green-500">{usdtValue || 0} USDT</strong> for{' '}
          ₹{inrValue || 0} + ₹{tds || 0} (TDS - 1%) = <strong className="text-red-500"> ₹{total || 0} INR</strong> in
          your wallet.
        </p>

        {/* Medium size box showing two things */}
        <div className="flex justify-between border rounded p-4 bg-gray-100">
          {/* Left side: To pay __ */}
          <div className="text-center">
            <p className="text-sm mb-2 text-gray-600">To pay</p>
            <strong className="text-red-500">{total || 0} INR</strong>
          </div>
          <div className="text-center">
            <p className="text-sm mb-2 text-gray-600">Tax</p>
            <strong className="text-red-500">{tds || 0} INR</strong>
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
