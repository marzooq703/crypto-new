'use client';

import { useState } from 'react';
import { useEffect } from 'react';
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
// import TronWeb from 'tronweb';

// const tronWeb = new TronWeb({
//   fullHost: 'https://api.trongrid.io',
//   solidityNode: 'https://api.trongrid.io',
//   eventServer: 'https://api.trongrid.io',
// });
const startPayment = async ({
  setError,
  setTxs,
  amount,
  addr,
  network,
  inrTransefed,
  transefedAddress,
  email,
  usdtBalance,
  setStartTransaction,
}) => {
  try {
    if (!window.ethereum) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error!',
      //   text: 'No crypto wallet found',
      // });

      throw new Error('No crypto wallet found. Please install MetaMask.');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: getChainId(network) }],
    });
    // console.log(network, 'net');

    // const tronWeb = window.tronWeb;
    // const addr_tron = 'TNqSwySSVeVbSVxxhXku8BZCHPqdJ7dUaX';

    // const tron = false;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    addr = ethers.utils.getAddress(addr);

    console.log('Wallet Address:', addr);
    const web3 = new Web3(window.ethereum);
    const usdtMaticContractAddress =
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';

    const usdtContract = new web3.eth.Contract(
      usdtContractAbi,
      usdtMaticContractAddress,
    );

    const usdtBalanceWei = await usdtContract.methods.balanceOf(addr).call();

    const usdtBalances = parseFloat(
      web3.utils.fromWei(usdtBalanceWei, 'ether'),
    );

    const usdtBalance = `${usdtBalances}`.slice(0, -4);

    console.log(usdtBalance, 'usdtBalance');

    // if (tron) {
    //   const useUSDT = true;
    //   const useUSDC = false;
    //   if (useUSDT) {
    //     await sendUSDT_Trc20(tronWeb, addr_tron, amount);
    //   } else if (useUSDC) {
    //     await sendUSDC_Trc20(tronWeb, addr_tron, amount);
    //   }
    // }
    if (network) {
      // matic, eth ,bnb
      const useUSDT = true;
      const useUSDC = false;
      if (useUSDT) {
        console.log(inrTransefed, transefedAddress, 'it is me');
        await sendUSDT(
          signer,
          addr,
          amount,
          inrTransefed,
          transefedAddress,
          email,
          setStartTransaction,
        );
      } else if (useUSDC) {
        await sendUSDC(signer, addr, amount);
      }
      // else {
      //   await sendFDUSD(signer, addr, amount);
      // }
    } else {
      // Handle Ether transactions for other networks
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(amount),
      });

      setTxs([tx]);
    }
  } catch (err) {
    // if no wallet is found
    setError(err);
    console.log(err.message);
    throw err;
  }
};

// const sendUSDT_Trc20 = async (tronWeb, toAddress, amount) => {
//   try {
//     const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
//     const usdtContract = await tronWeb.contract().at(usdtContractAddress);
//     const amountSun = tronWeb.toSun(amount);

//     await usdtContract.transfer(toAddress, amountSun).send();
//     console.log(amount, 'USDT sent to:', toAddress);
//   } catch (error) {
//     console.error('Error sending USDT:', error.message);
//     throw error;
//   }
// };

// const sendUSDC_Trc20 = async (tronWeb, toAddress, amount) => {
//   try {
//     const usdcContractAddress = 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8';
//     const usdcContract = await tronWeb.contract().at(usdcContractAddress);
//     const amountSun = tronWeb.toSun(amount);

//     await usdcContract.transfer(toAddress, amountSun).send();
//     console.log(amount, 'USDC sent to:', toAddress);
//   } catch (error) {
//     console.error('Error sending USDC:', error.message);
//     throw error;
//   }
// };
const usdtContractAbi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const sendUSDT = async (
  signer,
  toAddress,
  amount,
  inrTransefed,
  fromAddress,
  email,
  setStartTransaction,
) => {
  try {
    const web3 = new Web3(window.ethereum);
    const usdtMaticContractAddress =
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
    const usdtEthContractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
    const usdtBnbContractAddress = '0x55d398326f99059ff775485246999027b3197955';

    // const usdtContractAddress =
    //   network === 'matic'
    //     ? usdtMaticContractAddress
    //     : network === 'eth'
    //     ? usdtEthContractAddress
    //     : network === 'bnb'
    //     ? usdtBnbContractAddress
    //     : '';
    const usdtContract = new web3.eth.Contract(
      usdtContractAbi,
      usdtMaticContractAddress,
    );
    console.log(email);

    const amountWei = web3.utils.toWei(amount, 'ether'); //bnb
    const amountWei1 = web3.utils.toWei(amount, 'mwei'); // matic eth
    const gasPriceWei = await web3.eth.getGasPrice(); // Dynamically fetch current gas price
    const gasPriceHex = web3.utils.toHex(gasPriceWei);
    const gasLimit = 100000;

    await usdtContract.methods.transfer(toAddress, amountWei1).send({
      from: await signer.getAddress(),
      gasPrice: gasPriceHex,
      gasLimit,
    });

    if (typeof window !== 'undefined') {
      const localStorageData = localStorage.getItem('crypto-user');
      const parsedData = JSON.parse(localStorageData);
      const userEmail = parsedData.email;
      // setUserEmail(parsedData.email);
      console.log(gasPriceHex, 'gasPriceHex');

      const docRef = doc(db, 'userTransactions', userEmail);

      const orderId = Math.random().toString(16).slice(2);

      const docSnap = await getDoc(docRef);
      const dbValue = {
        usdtValue: amount,
        inrPending: inrTransefed,
        fromAddress: toAddress,
        toAddress: fromAddress,
        status: 'success',
        isMoneyTransferred: false,
        email: email,
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
    console.log(amount, toAddress, inrTransefed, fromAddress);
    setStartTransaction(false);
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'transaction was successful.',
    });
  } catch (error) {
    console.error('Error', error.message);
    setStartTransaction(false);
    if (
      error.message ===
      'Returned error: MetaMask Tx Signature: User denied transaction signature.'
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'You denied the transaction signature.',
      });
      return;
    } else if (
      error.message === "Cannot read properties of null (reading 'indexOf')"
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Database Error',
        text: 'Please check with our support team',
      });
      return;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
      });
    }
    throw error;
  }
};
const usdcContractAbi = [
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
        name: 'success',
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
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
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
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const sendUSDC = async (signer, toAddress, amount) => {
  try {
    const web3 = new Web3(window.ethereum);
    const usdcMaticContractAddress =
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
    const usdcBnbContractAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';

    const usdcContract = new web3.eth.Contract(
      usdcContractAbi,
      usdcBnbContractAddress,
    );

    const amountWei = web3.utils.toWei(amount, 'ether'); //bnb
    const amountWei1 = web3.utils.toWei(amount, 'mwei'); // matic eth
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPriceHex = web3.utils.toHex(gasPriceWei);
    const gasLimit = 90000;

    await usdcContract.methods.transfer(toAddress, amountWei).send({
      from: await signer.getAddress(),
      gasPrice: gasPriceHex,
      gasLimit,
    });

    console.log(amount, toAddress);
  } catch (error) {
    console.error('Error sending USDC', error.message);
    throw error;
  }
};

// const fdusdContractAbi = [
//   {
//     constant: true,
//     inputs: [],
//     name: 'name',
//     outputs: [{ name: '', type: 'string' }],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: 'symbol',
//     outputs: [{ name: '', type: 'string' }],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: 'decimals',
//     outputs: [{ name: '', type: 'uint8' }],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: '_spender', type: 'address' },
//       { name: '_value', type: 'uint256' },
//     ],
//     name: 'approve',
//     outputs: [{ name: 'success', type: 'bool' }],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     constant: true,
//     inputs: [{ name: '_owner', type: 'address' }],
//     name: 'balanceOf',
//     outputs: [{ name: 'balance', type: 'uint256' }],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: '_to', type: 'address' },
//       { name: '_value', type: 'uint256' },
//     ],
//     name: 'transfer',
//     outputs: [{ name: 'success', type: 'bool' }],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: '_from', type: 'address' },
//       { name: '_to', type: 'address' },
//       { name: '_value', type: 'uint256' },
//     ],
//     name: 'transferFrom',
//     outputs: [{ name: 'success', type: 'bool' }],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ];

// const sendFDUSD = async (signer, toAddress, amount) => {
//   try {
//     const web3 = new Web3(window.ethereum);
//     const fdusdMaticContractAddress = 'Your FDUSD Matic Contract Address';

//     const fdusdContract = new web3.eth.Contract(
//       fdusdContractAbi,
//       fdusdMaticContractAddress,
//     );

//     const amountWei = web3.utils.toWei(amount, 'ether');
//     const gasPriceWei = await web3.eth.getGasPrice();
//     const gasPriceHex = web3.utils.toHex(gasPriceWei);
//     const gasLimit = 50000;

//     await fdusdContract.methods.transfer(toAddress, amountWei).send({
//       from: await signer.getAddress(),
//       gasPrice: gasPriceHex,
//       gasLimit,
//     });

//     console.log(amount, toAddress);
//   } catch (error) {
//     console.error('Error sending FDUSD', error.message);
//     throw error;
//   }
// };

const getChainId = (network) => {
  switch (network) {
    case 'eth':
      return '0x1';
    case 'matic':
      return '0x89';
    case 'bnb':
      return '0x38';
    default:
      throw new Error('Unsupported network');
  }
};
const Crypto = () => {
  let [toggleCoin, setToggleCoin] = useState(false);
  const [sellingAmount, setSellingAmount] = useState({} || 0);
  const [usdtBalance, setUsdtBalance] = useState({});
  const [usdcBalance, setUsdcBalance] = useState({});
  const [inrAmount, setInrAmount] = useState({});
  const [usdtInrPrice, setUsdtInrPrice] = useState(null);
  const [cryptoAmount, setCryptoAmount] = useState({});
  const [, setError] = useState();
  const [, setTxs] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [value, setValue] = useState('');
  const [startTransaction, setStartTransaction] = useState(false);
  const [hashId, setHashId] = useState('');

  const [isTransferById, setIsTransferById] = useState(false);

  const cryptowalletAmount = JSON.stringify(cryptoAmount.amount);

  // console.log(userEmail);
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
    const fetchBalances = async () => {
      try {
        if (!window.ethereum) {
          throw new Error('No crypto wallet found. Please install MetaMask.');
        }

        const web3 = new Web3(window.ethereum);
        const usdtMaticContractAddress =
          '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
        const usdcMaticContractAddress =
          '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log('Wallet Address:', address);

        const usdtContract = new web3.eth.Contract(
          usdtContractAbi,
          usdtMaticContractAddress,
        );
        const usdcContract = new web3.eth.Contract(
          usdcContractAbi,
          usdcMaticContractAddress,
        );

        const usdtBalanceWei = await usdtContract.methods
          .balanceOf(address)
          .call();

        const usdcBalanceWei = await usdcContract.methods
          .balanceOf(address)
          .call();

        const usdtBalances = parseFloat(
          web3.utils.fromWei(usdtBalanceWei, 'ether'),
        );
        const usdcBalances = parseFloat(
          web3.utils.fromWei(usdcBalanceWei, 'ether'),
        );

        const usdtBalance = `${usdtBalances}`.slice(0, -4);
        const usdcBalance = `${usdcBalances}`.slice(0, -4);

        setUsdtBalance(usdtBalance);
        setUsdcBalance(usdcBalance);

        console.log('Initial USDT Balance:', usdtBalance);
        console.log('Initial USDC Balance:', usdcBalance);
      } catch (error) {
        console.error('Error fetching balances:', error.message);
      }
    };

    fetchBalances();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStartTransaction(true);
    const sellingAmountValue = parseFloat(sellingAmount.value);
    console.log(sellingAmountValue, 'sellingAmountValue');
    console.log(usdtBalance, 'usdtBalance');
    // Swal.fire({
    //   icon: 'error',
    //   title: 'Wallet not found',
    //   text: 'Please connect a wallet to continue',
    // });
    try {
      if (sellingAmountValue > usdtBalance) {
        console.error('Insufficient balance. Please enter a valid amount.');
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Insufficient balance. Please enter a valid amount',
        });
      } else {
        const reciverAddress = '0x269b7Fb9F7Be8945E6d0fD5c132E86c79ab55D2B';
        await startPayment({
          setError,
          setTxs,
          amount: `${sellingAmount.value}`,
          addr: reciverAddress,
          network: 'matic', //  "eth", "matic", "bnb",
          inrTransefed: value,
          transefedAddress: reciverAddress,
          email: userEmail,
          setStartTransaction,
        });
      }

      // navigate("/sell-crypto-details");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      // navigate("/sell-crypto-failed");
    }
  };

  useEffect(() => {
    const calculatedValue =
      parseFloat(sellingAmount.value) * parseFloat(usdtInrPrice);
    const sanitizedValue = isNaN(calculatedValue) ? 0 : calculatedValue;

    setValue(sanitizedValue.toFixed(2)); // Round to 2 decimal places
  }, [sellingAmount, usdtInrPrice]);
  console.log(value,"aqeel");

  const clickSell = () => {
    router.push('/classic/sellPayment');
  };
  const [showMinutesMessage, setShowMinutesMessage] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowMinutesMessage(true), 20000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <Trade>
        <>
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
              <div className="absolute left-1/2 top-1/2 z-[1] -ml-4 -mt-4 rounded-full bg-white shadow-large dark:bg-gray-600"></div>
              <CoinInput2
                label={'To'}
                exchangeRate={0.0}
                defaultCoinIndex={1}
                value={value}
                getCoinValue={(data) => setInrAmount(data)}
              />
            </div>
          </div>
        </>
        {/* <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} />
          <TransactionInfo label={'Price Slippage'} value={'1%'} />
          <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} />
        </div> */}
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
        ) : isTransferById ? (
          <>
            <div>
              Transfer {sellingAmount?.value} USDT to
              <div
                className="cursor-pointer"
                onClick={() => {
                  typeof window != 'undefined' &&
                    navigator.clipboard.writeText(
                      '0xd47B761874B2941e9976B2469F04a3A3D8F830D1',
                    );
                }}
              >
                0xd47B761874B2941e9976B2469F04a3A3D8F830D1
              </div>
              <input
                type="text"
                placeholder="Transaction Hash"
                value={hashId}
                onChange={(e) => setHashId(e.target.value)}
                className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Button
                size="large"
                shape="rounded"
                fullWidth={true}
                className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
                onClick={async () => {
                  const docRef = doc(db, 'userTransactions', userEmail);
                  const orderId = Math.random().toString(16).slice(2);

                  const docSnap = await getDoc(docRef);
                  const dbValue = {
                    usdtValue: sellingAmount?.value,
                    inrPending: value,
                    fromAddress: '0xd47B761874B2941e9976B2469F04a3A3D8F830D1',
                    toAddress: '0xd47B761874B2941e9976B2469F04a3A3D8F830D1',
                    status: 'pending',
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

                  Swal.fire({
                    icon: 'question',
                    title: 'Transaction under verification',
                    text: 'You will receive a email notification when the payment is verified by our team!',
                  });
                  if (hashId) setIsTransferById(false);
                }}
              >
                Verify transaction
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
              onClick={() => {
                setIsTransferById(true);
              }}
            >
              Transfer to Wallet (for Trust Wallet)
            </Button>
            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
              onClick={handleSubmit}
            >
              Connect Wallet (for Meta Mask)
            </Button>
          </>
        )}
      </Trade>
    </div>
  );
};

export default Crypto;
