'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import CoinInput2 from '@/components/ui/coin-input2';
import TransactionInfo from '@/components/ui/transaction-info';
import Trade from '@/components/ui/trade';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BuyCrypto = () => {
  const [inrValue, setInrValue] = useState('');
  const [usdtValue, setUsdtValue] = useState(0);

  console.log(usdtValue, 'usdtValue');
  const router = useRouter();

  const fetchConversionRate = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'tether',
            vs_currencies: 'inr',
          },
        },
      );
      if (
        !response.data ||
        !response.data.tether ||
        !response.data.tether.inr
      ) {
        throw new Error('Invalid response or missing data');
      }
      const conversionRate = response.data.tether.inr;
      const calculatedUsdtValue =
        parseFloat(inrValue) / parseFloat(conversionRate);
      setUsdtValue(calculatedUsdtValue.toFixed(2)); // Rounded to 2 decimal places

      // Log the conversion rate and the calculated USDT value
      console.log('Conversion Rate:', conversionRate);
      console.log('Calculated USDT Value:', calculatedUsdtValue.toFixed(2));
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
    }
  };

  const handleInrInputChange = async (e) => {
    const { value } = e.target;
    setInrValue(value);

    // Log the INR value when it changes
    console.log('INR Value:', value);
  };

  const handleUSDTChange = async (e) => {
    const { value } = e.target;
    setUsdtValue(value);

    console.log('USdt value', value);
  };

  const handleSubmit = async () => {
    localStorage.setItem('inrValue', JSON.stringify(inrValue));
    localStorage.setItem('usdtValue', JSON.stringify(usdtValue));

    const transactionData = {
      inrValue,
      usdtValue,
      timestamp: new Date(),
    };
    try {
      await db.collection('transactions').add(transactionData);
      router.push('/classic/payment');
    } catch (error) {
      console.error('error saving transaction:', error);
    }
  };

  useEffect(() => {
    if (inrValue !== '') {
      fetchConversionRate();
    }
  }, [inrValue]);

  return (
    <div>
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className={cn('relative')}>
            <div className="mb-3">
              <CoinInput2
                label={'From'}
                value={inrValue}
                onChange={handleInrInputChange}
                placeholder="Enter INR value"
                defaultCoinIndex={1}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={usdtValue}
                onChange={handleUSDTChange}
                placeholder="Enter USDT value"
                className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
              />
            </div>
            {/* <div className="mb-3">
              <CoinInput
                label={'To'}
                defaultCoinIndex={0}
                onChange={handleUSDTChange}
                exchangeRate={0.0}
                value={usdtValue}
                placeholder="USDT value"
                disabled={true}              />
            </div> */}
          </div>
        </div>
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} />
          <TransactionInfo label={'Price Slippage'} value={'1%'} />
          <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} />
        </div>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={handleSubmit}
        >
          BUY
        </Button>
      </Trade>
    </div>
  );
};

export default BuyCrypto;

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import cn from 'classnames';
// import Button from '@/components/ui/button';
// import CoinInput from '@/components/ui/coin-input';
// import CoinInput2 from '@/components/ui/coin-input2';
// import TransactionInfo from '@/components/ui/transaction-info';
// import Trade from '@/components/ui/trade';
// import axios from 'axios';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../lib/firebase';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// const BuyCrypto = () => {
//   const [selectedNetwork, setSelectedNetwork] = useState('matic');
//   const [inrValue, setInrValue] = useState('');
//   const [usdtValue, setUsdtValue] = useState(0);
//   const [isKYCVerified, setIsKYCVerified] = useState(false); // State to hold KYC verification status
//   const [userId, setUserId] = useState(null);

//   const router = useRouter();

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         console.log('User:', user);
//       } else {
//         setUserId(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   console.log('User ID:', userId);

//   useEffect(() => {
//     const fetchConversionRate = async () => {
//       try {
//         const response = await axios.get(
//           'https://api.coingecko.com/api/v3/simple/price',
//           {
//             params: {
//               ids: 'tether',
//               vs_currencies: 'inr',
//             },
//           },
//         );
//         if (
//           !response.data ||
//           !response.data.tether ||
//           !response.data.tether.inr
//         ) {
//           throw new Error('Invalid response or missing data');
//         }
//         const conversionRate = response.data.tether.inr;
//         const calculatedUsdtValue =
//           parseFloat(inrValue) / parseFloat(conversionRate);
//         setUsdtValue(calculatedUsdtValue.toFixed(2)); // Rounded to 2 decimal places
//       } catch (error) {
//         console.error('Error fetching conversion rate:', error);
//       }
//     };

//     if (inrValue !== '') {
//       fetchConversionRate();
//     }
//   }, [inrValue]);

//   useEffect(() => {
//     const checkKYCStatus = async () => {
//       try {
//         const docRef = doc(db, 'users', 'user_id');
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           setIsKYCVerified(userData.isKYCVerified);
//         } else {
//           console.log('No such document!, check KYC verification.');
//         }
//       } catch (error) {
//         console.error('Error getting document:', error);
//       }
//     };

//     checkKYCStatus();
//   }, []);

//   const handleNetworkChange = (e) => {
//     setSelectedNetwork(e.target.value);
//   };

//   const handleSubmit = () => {
//     router.push('/classic/payment');
//   };

//   const handleInrInputChange = (e) => {
//     setInrValue(e.target.value);
//   };

//   const handleVerifyKYC = () => {
//     router.push('/classic/kyc');
//   };

//   // if (!isKYCVerified) {
//   //   return (
//   //     <div>
//   //       <p>
//   //         You are not authorized to access this page. Please Verify KYC before
//   //         buying or selling crypto.
//   //       </p>
//   //       <Button onClick={handleVerifyKYC} className="mt-4">
//   //         Verify KYC
//   //       </Button>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div>
//       <Trade>
//         <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
//           <div className={cn('relative')}>
//             <div className="mb-3">
//               <CoinInput2
//                 label={'From'}
//                 value={inrValue}
//                 onChange={handleInrInputChange}
//                 placeholder="Enter INR value"
//               />
//             </div>
//             <div className="mb-3">
//               <CoinInput
//                 label={'To'}
//                 value={usdtValue}
//                 placeholder="USDT value"
//                 si
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col gap-4 xs:gap-[18px]">
//           <TransactionInfo label={'Min. Received'} />
//           <TransactionInfo label={'Rate'} />
//           <TransactionInfo label={'Offered by'} />
//           <TransactionInfo label={'Price Slippage'} value={'1%'} />
//           <TransactionInfo label={'Network Fee'} />
//           <TransactionInfo label={'Criptic Fee'} />
//         </div>
//         <Button
//           size="large"
//           shape="rounded"
//           fullWidth={true}
//           className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
//           onClick={handleSubmit}
//         >
//           BUY
//         </Button>
//       </Trade>
//     </div>
//   );
// };

// export default BuyCrypto;
