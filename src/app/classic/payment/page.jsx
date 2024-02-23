'use client';

import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

const BuyPayment = () => {
  const [coinValue, setCoinValue] = useState({});
  const [inrValue, setInrValue] = useState('');
  const [usdtValue, setUsdtValue] = useState('');
  const [transactions, setTransaction] = useState(null);

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

  useEffect(() => {
    let storedValue;
    if (typeof window !== 'undefined') {
      storedValue = JSON.parse(localStorage.getItem('datas')) || { value: '' };
    }
    setCoinValue(storedValue);
  }, []); // Note the correct placement of the dependency array here

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // Retrieve the latest transaction from Firestore
        const transactionSnapshot = await db
          .collection('transactions')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        if (!transactionSnapshot.empty) {
          // Extract transaction data
          const transactionData = transactionSnapshot.docs[0].data();
          setTransaction(transactionData);
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    };

    fetchTransaction();
  }, []);
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
          <strong className="text-blue-500">{usdtValue || 0}</strong> for{' '}
          <strong className="text-green-500">{inrValue || 0} rupees</strong> in
          wallet.
        </p>

        {/* Medium size box showing two things */}
        <div className="flex justify-between border rounded p-4 bg-gray-100">
          {/* Left side: To pay __ */}
          <div className="text-center">
            <p className="text-sm mb-2 text-gray-600">To pay</p>
            <strong className="text-red-500">{inrValue || 0}</strong>
          </div>

          {/* Right side: You get __ */}
          <div className="text-center">
            <p className="text-sm mb-2 text-gray-600">You get</p>
            <strong className="text-green-500">{usdtValue || 0}</strong>
          </div>
        </div>
      </div>

      {/* Payment Details Box */}
      <div className="border rounded p-6 bg-white shadow-md w-full">
        {/* <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Payment Details
        </h2> */}

        {/* List of Questions and Text Fields */}
        <div className="space-y-4">
          {/* Account Holder Name */}
          {/* <div>
            <label className="block text-md font-medium text-gray-600">
              Account Holder Name
            </label>
            <input
              type="text"
              className="form-input w-full border rounded-md"
            />
          </div> */}

          {/* Account Number */}
          {/* <div>
            <label className="block text-md font-medium text-gray-600">
              Account Number
            </label>
            <input
              type="text"
              className="form-input w-full border rounded-md"
            />
          </div> */}

          {/* IFSC Code */}
          {/* <div>
            <label className="block text-md font-medium text-gray-600">
              IFSC Code
            </label>
            <input
              type="text"
              className="form-input w-full border rounded-md"
            />
          </div> */}

          {/* Account Type */}
          {/* <div>
            <label className="block text-md font-medium text-gray-600">
              Account Type (Savings or Current)
            </label>
            <input
              type="text"
              className="form-input w-full border rounded-md"
            />
          </div> */}

          {/* Bank Name */}
          {/* <div>
            <label className="block text-md font-medium text-gray-600">
              Bank Name
            </label>
            <input
              type="text"
              className="form-input w-full border rounded-md"
            />
          </div> */}

          {/* Branch Name */}
          {/* <div>
            <label className="block text-md font-medium text-gray-600">
              Account Opening Branch
            </label>
            <input
              type="text"
              className="form-input w-full border rounded-md"
            />
          </div> */}
        </div>
        {/* <div className="block text-md font-medium text-black text-center mt-6">
          <p>or</p>
        </div> */}

        {/* QR Code */}
        <div className="text-center mt-6">
          <label className="block text-md font-medium text-gray-600 mb-2">
            Scan QR Code to Pay
          </label>
          {/* <img src="https://files.slack.com/files-pri/T05DPQAATK3-F06EVK88XSN/qr_test_5ka16sbzt3d42lm288.png" /> */}
          <QRCode value="Sample QR Code Content" />
        </div>
        <div className="block text-md font-medium text-black text-center mt-6">
          <p>or</p>
        </div>
        <div className="block text-md font-medium text-black text-center mt-6">
          <a
            target="_blank"
            href="https://buy.stripe.com/test_5kA16SbZT3d42Lm288"
            rel="noopener noreferrer"
          >
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md  "
              //   onClick={handlePayButtonClick}
            >
              Pay With Card
            </button>
          </a>
        </div>

        {/* Pay Button */}
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-8 w-full"
          //   onClick={handlePayButtonClick}
        >
          Pay
        </button> */}
      </div>
    </div>
  );
};

export default BuyPayment;
