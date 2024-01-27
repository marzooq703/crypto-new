'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Button from '@/components/ui/button';
import CoinInput2 from '@/components/ui/coin-input2';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';
import { ethers } from 'ethers';
import Web3 from 'web3';

const startPayment = async ({ setError, setTxs, amount, addr, network }) => {
  try {
    if (!window.ethereum) {
      throw new Error('No crypto wallet found. Please install MetaMask.');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: getChainId(network) }],
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    addr = ethers.utils.getAddress(addr);

    if (network === 'matic') {
      await sendUSDT(signer, addr, amount);
    } else {
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(amount),
      });

      setTxs([tx]);
    }
  } catch (err) {
    setError(err);
    console.log(err.message);
    throw err;
  }
};
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
const sendUSDT = async (signer, toAddress, amount) => {
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

    const amountWei = web3.utils.toWei(amount, 'ether'); //bnb
    const amountWei1 = web3.utils.toWei(amount, 'mwei'); // matic eth
    const gasPriceWei = await web3.eth.getGasPrice(); // Dynamically fetch current gas price
    const gasPriceHex = web3.utils.toHex(gasPriceWei);
    const gasLimit = 50000;

    await usdtContract.methods.transfer(toAddress, amountWei1).send({
      from: await signer.getAddress(),
      gasPrice: gasPriceHex,
      gasLimit,
    });
    console.log(amount, toAddress);
  } catch (error) {
    console.error('Error', error.message);
    throw error;
  }
};

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
const SellCrypto = () => {
  let [toggleCoin, setToggleCoin] = useState(false);

  const [sellingAmount, setSellingAmount] = useState({});
  const [usdtBalance, setUsdtBalance] = useState({});

  const [cryptoAmount, setCryptoAmount] = useState({});
  const [, setError] = useState();
  const [, setTxs] = useState([]);

  const cryptowalletAmount = JSON.stringify(cryptoAmount.amount);
  console.log(cryptowalletAmount, 'hjh');

  useEffect(() => {
    const fetchUsdtBalance = async () => {
      const web3 = new Web3(window.ethereum);

      try {
        if (!window.ethereum) {
          throw new Error('No crypto wallet found. Please install MetaMask.');
        }
        const usdtMaticContractAddress =
          '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
        const usdtEthContractAddress =
          '0xdac17f958d2ee523a2206206994597c13d831ec7';

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log('Wallet Address:', address);

        const usdtContract = new web3.eth.Contract(
          usdtContractAbi,
          usdtMaticContractAddress,
        );

        const usdtBalanceWei = await usdtContract.methods
          .balanceOf(address)
          .call();

        const usdtBalance = parseFloat(
          web3.utils.fromWei(usdtBalanceWei, 'ether'),
        );
        const Balance = `${usdtBalance}`.slice(0, -4);

        setUsdtBalance(Balance);

        console.log('Initial USDT Balance:', Balance);
      } catch (error) {
        console.error('Error fetching USDT balance', error.message);
      }
    };

    fetchUsdtBalance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const sellingAmountValue = parseFloat(sellingAmount.value);
    console.log(sellingAmountValue, 'sellingAmountValue');
    console.log(usdtBalance, 'usdtBalance');
    try {
      if (sellingAmountValue > usdtBalance) {
        console.error('Insufficient balance. Please enter a valid amount.');
      } else {
        await startPayment({
          setError,
          setTxs,
          amount: `${sellingAmount.value}`,
          addr: '0xb141A92Eabd9F05D21bB388a8AFfcA6d6Eea752B',
          network: 'matic', //  "eth", "matic", "bnb",
        });
      }

      // navigate("/sell-crypto-details");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      // navigate("/sell-crypto-failed");
    }
  };

  const clickSell = () => {
    router.push('/classic/sellPayment');
  };
  console.log(sellingAmount.value, 'asdas');
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
              getCoinValue={(data) => console.log('To coin value:', data)}
            />
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
