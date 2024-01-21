'use client';

import { useState } from 'react';
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

const sendUSDT = async (signer, toAddress, amount) => {
  try {
    const web3 = new Web3(window.ethereum);

    const usdtContractAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

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
    const usdtContract = new web3.eth.Contract(
      usdtContractAbi,
      usdtContractAddress,
    );

    const amountWei = web3.utils.toWei(amount, 'ether');
    const amountWei1 = web3.utils.toWei(amount, 'mwei');

    const gasPriceWei = await web3.eth.getGasPrice();
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
  const [selectedNetwork, setSelectedNetwork] = useState('matic'); // Default to 'matic'

  const router = useRouter();

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };

  const [sellingAmount, setSellingAmount] = useState({});
  const [cryptoAmount, setCryptoAmount] = useState({});
  const [, setError] = useState();
  const [, setTxs] = useState([]);

  const cryptowalletAmount = JSON.stringify(cryptoAmount.amount);
  console.log(cryptowalletAmount, 'hjh');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await startPayment({
        setError,
        setTxs,
        amount: `${sellingAmount.value}`,
        addr: '0xb141A92Eabd9F05D21bB388a8AFfcA6d6Eea752B',
        network: 'matic', //  "eth", "matic", "bnb",
      });
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
          <div className="flex items-center mb-4">
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
              {/* You can place your dropdown icon here */}
              <svg
                className="h-4 w-4 fill-current text-gray-600 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L16 7z" />
              </svg>
            </div>
          </div>
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
