'use client';

import React, { useState, useEffect } from 'react';
import {
  useConnect,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { polygon } from 'viem/chains';
import { useBalance } from 'wagmi';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import cn from 'classnames';
import Button from '@/components/ui/button';
import CoinInput2 from '@/components/ui/coin-input2';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';
import { ethers } from 'ethers';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { db } from '../../../lib/firebase';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore';
import dayjs from 'dayjs';

const Crypto = () => {
  const [toggleCoin, setToggleCoin] = useState(false);
  const [sellingAmount, setSellingAmount] = useState(0);
  const [inrAmount, setInrAmount] = useState(0);
  const [usdtInrPrice, setUsdtInrPrice] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [value, setValue] = useState('');
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [hashs, setHashs] = useState('');
  const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({
    hash: hashs,
  });
  const reciverWalletAdd = '0x269b7Fb9F7Be8945E6d0fD5c132E86c79ab55D2B';
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  console.log(isLoading, 'isLoading');
  console.log(isSuccess, 'isSuccess');
  const price = 0.1;
  console.log(sellingAmount, 'aqeel');
  async function transferSuccess() {
    try {
      if (typeof window !== 'undefined') {
        const localStorageData = localStorage.getItem('crypto-user');
        const parsedData = JSON.parse(localStorageData);
        const userEmail = parsedData.email;

        const docRef = doc(db, 'userTransactions', userEmail);
        const orderId = Math.random().toString(16).slice(2);

        const docSnap = await getDoc(docRef);
        const dbValue = {
          usdtValue: sellingAmount.value,
          inrPending: value,
          fromAddress: address,
          toAddress: reciverWalletAdd,
          status: 'success',
          tranhash: `https://polygonscan.com/tx/${hashs}`,
          isMoneyTransferred: false,
          email: userEmail,
          time: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          orderId,
        };

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            sell: arrayUnion(dbValue),
          });
        } else {
          await setDoc(docRef, {
            sell: arrayUnion(dbValue),
          });
        }

        const docRef2 = doc(db, 'allTransactions', 'Sell');
        const docSnap1 = await getDoc(docRef2);

        if (docSnap1.exists()) {
          await updateDoc(docRef2, {
            [orderId]: dbValue,
          });
        } else {
          await setDoc(docRef2, {
            [orderId]: dbValue,
          });
        }
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Transaction was successful.',
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  if (isSuccess) {
    transferSuccess();
    setHashs('');
  }
  const handlePayment = async () => {
    try {
      setStarted(true);
      if (!address) {
        await connectAsync({ chainId: polygon.id, connector: injected() });
      }
      console.log(address, 'address');
      const data = await writeContractAsync({
        chainId: polygon.id,
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        functionName: 'transfer',
        abi: [
          {
            constant: true,
            inputs: [],
            name: 'name',
            outputs: [
              {
                name: '',
                type: 'string',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                name: '_spender',
                type: 'address',
              },
              {
                name: '_value',
                type: 'uint256',
              },
            ],
            name: 'approve',
            outputs: [
              {
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [
              {
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                name: '_from',
                type: 'address',
              },
              {
                name: '_to',
                type: 'address',
              },
              {
                name: '_value',
                type: 'uint256',
              },
            ],
            name: 'transferFrom',
            outputs: [
              {
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
              {
                name: '',
                type: 'uint8',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: true,
            inputs: [
              {
                name: '_owner',
                type: 'address',
              },
            ],
            name: 'balanceOf',
            outputs: [
              {
                name: 'balance',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: true,
            inputs: [],
            name: 'symbol',
            outputs: [
              {
                name: '',
                type: 'string',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              {
                name: '_to',
                type: 'address',
              },
              {
                name: '_value',
                type: 'uint256',
              },
            ],
            name: 'transfer',
            outputs: [
              {
                name: '',
                type: 'bool',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            constant: true,
            inputs: [
              {
                name: '_owner',
                type: 'address',
              },
              {
                name: '_spender',
                type: 'address',
              },
            ],
            name: 'allowance',
            outputs: [
              {
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
          {
            payable: true,
            stateMutability: 'payable',
            type: 'fallback',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                name: 'owner',
                type: 'address',
              },
              {
                indexed: true,
                name: 'spender',
                type: 'address',
              },
              {
                indexed: false,
                name: 'value',
                type: 'uint256',
              },
            ],
            name: 'Approval',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                name: 'from',
                type: 'address',
              },
              {
                indexed: true,
                name: 'to',
                type: 'address',
              },
              {
                indexed: false,
                name: 'value',
                type: 'uint256',
              },
            ],
            name: 'Transfer',
            type: 'event',
          },
        ],
        args: [reciverWalletAdd, sellingAmount.value * 1000000],
      });
      setCompleted(true);
      setHashs(data);
      console.log(isLoading, 'isLoading');
      console.log(isSuccess, 'isSuccess');

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error,
        });
      }
      console.log(`https://polygonscan.com/tx/${data}`);
      console.log(hashs);
      console.log(data);
    } catch (err) {
      console.error(err.message);
      if (err.message.includes('User rejected the request.')) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'User denied the transaction signature.',
        });
      }
      if (err.message.includes('ERC20: transfer amount exceeds balance')) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'User does not have enough balance to perform the transaction',
        });
      }
      setStarted(false);
      setCompleted(false);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'currentPricing', 'Sell'), (doc) => {
      const data = doc.data();
      console.log('Current data: ', data);
      const sell = data.current;
      setUsdtInrPrice(Number(sell));
    });
    if (typeof window !== 'undefined') {
      const localStorageData = localStorage.getItem('crypto-user');
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        setUserEmail(parsedData.email);
        const sell = localStorage.getItem('sell');
        setUsdtInrPrice(Number(sell));
      }
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'currentPricing', 'Sell'), (doc) => {
      const data = doc.data();
      console.log('Current data: ', data);
      const sell = data.current;
      setUsdtInrPrice(Number(sell));
    });
    if (typeof window !== 'undefined') {
      const localStorageData = localStorage.getItem('crypto-user');
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        setUserEmail(parsedData.email);

        const sell = localStorage.getItem('sell');
        setUsdtInrPrice(Number(sell));
      }
    }
    console.log(userEmail, 'userEmail');
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(
    //       'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr',
    //     );
    //     const usdtInrPrice = response.data.tether.inr;
    //     setUsdtInrPrice(usdtInrPrice);
    //     console.log(usdtInrPrice);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
    // fetchData();
  }, []);
  useEffect(() => {
    const calculatedValue =
      parseFloat(sellingAmount.value) * parseFloat(usdtInrPrice);
    const sanitizedValue = isNaN(calculatedValue) ? 0 : calculatedValue;

    setValue(sanitizedValue.toFixed(2)); // Round to 2 decimal places
  }, [sellingAmount, usdtInrPrice]);
  console.log(value);
  const [showMinutesMessage, setShowMinutesMessage] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowMinutesMessage(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div
            className={cn(
              'relative flex gap-3',
              toggleCoin ? 'flex-col-reverse' : 'flex-col',
            )}
          >
            <CoinInput
              label={'From'}
              exchangeRate={0.0}
              defaultCoinIndex={0}
              getCoinValue={(data) => setSellingAmount(data)}
            />
            <div className="absolute left-1/2 top-1/2 z-[1] -ml-4 -mt-4 rounded-full bg-white shadow-large dark:bg-gray-600">
              {/* <Button
                size="mini"
                color="gray"
                shape="circle"
                variant="transparent"
                onClick={() => setToggleCoin(!toggleCoin)}
              >
                <SwapIcon className="h-auto w-3" />
              </Button> */}
            </div>
            <CoinInput2
              label={'To'}
              exchangeRate={0.0}
              defaultCoinIndex={1}
              value={value}
              getCoinValue={(data) => setInrAmount(data)}
            />
          </div>
        </div>
        {/*
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} />
          <TransactionInfo label={'Price Slippage'} value={'1%'} />
          <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} />
        </div>
        */}
        {/*
        {startTransaction ? (
          <>
            <Stack sx={{ width: '100%', color: '#2A52BE' }} spacing={2}>
              <LinearProgress color="inherit" />
            </Stack>
            <div>Transaction in progress...</div>
            <div>Please do not close the tab/browser</div>
            <div>Complete the transaction by approving it in your Wallet</div>
            {showMinutesMessage && <div>It may take Few Minutes</div>}
          </>
        ) : (
          */}
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={handlePayment}
        >
          Sell
        </Button>
        {/*)}
         */}
      </Trade>
    </div>
  );
};

export default Crypto;
