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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore related functions
import { db } from '../../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore'; // Assuming you have a 'db' object for Firestore

const SellCrypto = () => {
  // const [selectedNetwork, setSelectedNetwork] = useState('erc20');
  // const [toggleCoin, setToggleCoin] = useState(false);
  const [sellingAmount, setSellingAmount] = useState({});
  const [cryptoAmount, setCryptoAmount] = useState({});
  const [inrValue, setInrValue] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [user, setUser] = useState(null); // State to hold the authenticated user
  const [isKYCVerified, setIsKYCVerified] = useState(false);
  console.log(user, 'user');

  const router = useRouter();

  console.log('Inrvalue', inrValue);
  const setInrValueInLocalStorage = (value) => {
    localStorage.setItem('inrValue', JSON.stringify(value));
  };
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        // Fetch conversion rates from CoinGecko using Axios
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
        const calculatedInrValue = sellingAmount.value * conversionRate;
        setInrValue(calculatedInrValue);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    if (sellingAmount.value) {
      fetchConversionRate();
    }
  }, [sellingAmount]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const docRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setIsKYCVerified(userData.isKYCVerified);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error getting document:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const fetchUsdtBalance = async () => {
  //     try {
  //       // Fetch the user's USDT balance from your data source
  //       // For example, you can make an API call or fetch from a database
  //       const userUsdtBalance = await getUserUsdtBalance(); // Replace with your actual function

  //       // Update the state with the fetched balance
  //       setUsdtBalance(userUsdtBalance);
  //                                                      // must check this

  //     } catch (error) {
  //       console.error('Error fetching USDT balance:', error);
  //     }
  //   };

  //   // Call the function to fetch the balance
  //   fetchUsdtBalance();
  // }, []);

  const handleSubmit = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (sellingAmount.value > usdtBalance) {
        //   throw new Error('Insufficient balance. Please enter a valid amount.');
        // } else {
        // If the user is authenticated and has sufficient balance, proceed with the transaction logic

        const transactionData = {
          email: user.email, // Use user's email as transaction ID
          amount: sellingAmount.value, // Amount to be sold
          timestamp: new Date(), // Current timestamp
          status: 'completed', // Transaction status (you can update this based on the actual status)
        };

        const docRef = await addDoc(
          collection(db, 'sellTransactions'),
          transactionData,
        );
        console.log(
          'Transaction written with ID: ',
          docRef.id,
          transactionData,
        );

        router.push('/classic/sellPayment');
      }
    } catch (error) {
      console.error('Error handling submit:', error);
      // router.push('/authentication')
    }
  };

  const handleVerifyKYC = () => {
    router.push('/classic/kyc');
  };

  // const handleNetworkChange = (e) => {
  //   setSelectedNetwork(e.target.value);
  // };

  const handleCoinInputChange = (data) => {
    setSellingAmount(data);
    localStorage.setItem('sellingAmount', JSON.stringify(data));
  };

  const handleCoinInput2Change = (data) => {
    setCryptoAmount(data);
    localStorage.setItem('cryptoAmount', JSON.stringify(data));
  };
  console.log(cryptoAmount.value, 'cryptoAmount');

  useEffect(() => {
    setInrValueInLocalStorage(inrValue);
  }, [inrValue]);

  // if (!isKYCVerified) {
  //   return (
  //     <div>
  //       <p>
  //         You are not authorized to access this page. Please Verify KYC before
  //         buying or selling crypto.
  //       </p>
  //       <Button onClick={handleVerifyKYC} className="mt-4">
  //         Verify KYC
  //       </Button>
  //     </div>
  //   );
  // }
  return (
    <div>
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          {/* <div className="flex items-center mb-4">
            <label className="mr-2 font-semibold text-gray-700">Chains:</label>
            <select
              value={selectedNetwork}
              onChange={handleNetworkChange}
              className="px-5 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="erc20">ERC-20</option>
              <option value="bep20">BEP-20</option>
              <option value="matic">Matic-20</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                className="h-4 w-4 fill-current text-gray-600 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L16 7z" />
              </svg>
            </div>
          </div> */}
          <div className={cn('relative')}>
            <div className="mb-3">
              <CoinInput
                label={'From'}
                exchangeRate={0.0}
                defaultCoinIndex={0}
                getCoinValue={handleCoinInputChange}
              />
            </div>
          </div>
          <div className={cn('relative')}>
            <div className="mb-3">
              <CoinInput2
                label={'To'}
                exchangeRate={0.0}
                defaultCoinIndex={1}
                value={inrValue}
                getCoinValue={handleCoinInput2Change}
                disabled={true}
              />
            </div>
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
          Sell
        </Button>
      </Trade>
    </div>
  );
};

export default SellCrypto;
