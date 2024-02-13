'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { useRouter } from 'next/navigation';

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
    if (network === 'bnb') {
      // matic, eth ,bnb
      const useUSDT = true;
      const useUSDC = false;

      if (useUSDT) {
        await sendUSDT(signer, addr, amount);
      } else if (useUSDC) {
        await sendUSDC(signer, addr, amount);
      }
      // else {
      //   await sendFDUSD(signer, addr, amount);
      // }
    } else if (network === 'matic') {
      //   what condition should we write ???
    } else if (network === 'eth') {
      // what conditions should we write ??
    } else {
      // Handle Ether transactions for other networks
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

const sendUSDT = async (signer, toAddress, amount, network) => {
  try {
    const web3 = new Web3(window.ethereum);
    let usdtContractAddress;

    switch (network) {
      case 'matic':
        usdtContractAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
        break; //
      case 'eth': // what to do next?
        usdtContractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'; //
        break;
      case 'bnb':
        usdtContractAddress = '0x55d398326f99059ff775485246999027b3197955';
        break;
      default:
        throw new Error('Invalid network specified');
    }

    const usdtContract = new web3.eth.Contract(
      usdtContractAbi,
      usdtBnbContractAddress,
    );

    const amountWei = web3.utils.toWei(amount, 'ether'); //bnb
    const amountWei1 = web3.utils.toWei(amount, 'mwei'); // matic eth
    const gasPriceWei = await web3.eth.getGasPrice(); // Dynamically fetch current gas price
    const gasPriceHex = web3.utils.toHex(gasPriceWei);
    const gasLimit = 70000;

    await usdtContract.methods.transfer(toAddress, amountWei).send({
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
const sendUSDC = async (signer, toAddress, amount, network) => {
  try {
    const web3 = new Web3(window.ethereum);
    let usdcContractAddress;

    switch (network) {
      case 'matic':
        usdcContractAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
        break;
      case 'bnb':
        usdcContractAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
        break;
      default:
        throw new Error('Invalid network specified');
    }
    const usdcContract = new web3.eth.Contract(
      usdcContractAbi,
      usdcContractAddress,
    );

    const amountWei = web3.utils.toWei(amount, 'ether'); //bnb
    const amountWei1 = web3.utils.toWei(amount, 'mwei'); // matic eth
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPriceHex = web3.utils.toHex(gasPriceWei);
    const gasLimit = 50000;

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
const SellPayment = () => {
  const [sellingAmount, setSellingAmount] = useState({});
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [usdtBalance, setUsdtBalance] = useState({});
  const [usdcBalance, setUsdcBalance] = useState({});
  const [cryptoAmount, setCryptoAmount] = useState({});
  const [error, setError] = useState(null);
  const [, setTxs] = useState([]);
  const [inrValue, setInrValue] = useState(0);
  const [network, setNetwork] = useState('bnb');

  const router = useRouter();

  // useEffect=(()=>{
  //   const storedInrValue = localStorage.getItem('inrValue')
  //   if(storedInrValue){                                      /* UseEffect Error */
  //     setInrValue(parseFloat(storedInrValue))
  //   }
  // },[])
  useEffect(() => {
    const fetchUsdtBalance = async () => {
      const web3 = new Web3(window.ethereum);

      try {
        if (!window.ethereum) {
          throw new Error('No crypto wallet found. Please install MetaMask.');
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log('Wallet Address:', address);

        let usdtContractAddress, usdcContractAddress;

        // Set contract addresses based on the network
        switch (network) {
          case 'matic':
            usdtContractAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
            usdcContractAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
            break;
          case 'eth':
            usdtContractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'; // check whether if it is right.
            usdcContractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
            break;
          case 'bnb':
            usdtContractAddress = '0x55d398326f99059ff775485246999027b3197955';
            usdcContractAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
            break;
          default:
            throw new Error('Invalid network specified');
        }

        const usdtContract = new web3.eth.Contract(
          usdtContractAbi,
          usdtContractAddress,
        );
        const usdcContract = new web3.eth.Contract(
          usdcContractAbi,
          usdcContractAddress,
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
        ).toFixed(4);

        const usdtBalance = `${usdtBalances}`.slice(0, -4);
        const usdcBalance = `${usdcBalances}`.slice(0, -4);

        setUsdtBalance(usdtBalance);
        setUsdcBalance(usdcBalance);

        console.log('Initial USDT Balance:', usdtBalances);
        console.log('Initial USDC Balance:', usdcBalances);
      } catch (error) {
        console.error('Error fetching balances:', error.message);
      }
    };

    fetchUsdtBalance();
  }, [network]);

  const cryptowalletAmount = JSON.stringify(cryptoAmount.amount);
  console.log(cryptowalletAmount, 'hjh');

  useEffect(() => {
    // Fetch the 'From' value from localStorage when component mounts
    const sellingAmountValue = localStorage.getItem('sellingAmount');
    if (sellingAmountValue) {
      setFromValue(JSON.parse(sellingAmountValue));
    }

    // Fetch the 'To' value from localStorage or any other source
    let toValueFromStorage;
    if (typeof window !== undefined) {
      toValueFromStorage = localStorage.getItem('toCoinValue');
    }
    if (toValueFromStorage) {
      setToValue(JSON.parse(toValueFromStorage));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const sellingAmountValue = parseFloat(sellingAmount.value);
    console.log(sellingAmountValue, 'sellingAmountValue');
    console.log(usdtBalance, 'usdtBalance');
    console.log(network, 'selected Network');
    try {
      if (sellingAmountValue > usdtBalance) {
        throw new Error('Insufficient balance. Please enter a valid amount.');
      } else {
        await startPayment({
          setError,
          setTxs,
          amount: `${sellingAmount.value}`,
          addr: '0x269b7Fb9F7Be8945E6d0fD5c132E86c79ab55D2B',
          network: network, //  "eth", "matic", "bnb",
        });
      }
      console.log(sellingAmount.value, 'selling amount');
      // navigate("/sell-crypto-details");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      // navigate("/sell-crypto-failed");
    }
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto mt-8 space-y-8">
        <div className="border rounded p-6 bg-white shadow-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Confirm Information
          </h2>

          <p className="text-sm text-center mb-6 text-gray-600">
            You are about to receive{' '}
            <strong className="text-green-500">{inrValue}</strong>
            rupees for{' '}
            <strong className="text-blue-500">{fromValue.value}</strong> in
            wallet.
          </p>

          <div className="flex justify-between border rounded p-4 bg-gray-100">
            <div style={{ textAlign: 'center' }}>
              <p className="text-sm mb-2 text-gray-600">To sell</p>
              <strong className="text-red-500">{fromValue.value} </strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-sm mb-2 text-gray-600">You get</p>
              <strong className="text-green-500">{toValue.value}</strong>
            </div>
          </div>
        </div>

        {/* Payment Details Box */}
        <div className="border rounded p-6 bg-white shadow-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Crediting Account Details
          </h2>

          <div className="space-y-4">
            {/* Account Holder Name */}
            <div>
              <label
                htmlFor="accountHolderName"
                className="block text-md font-medium text-gray-600"
              >
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountHolderName"
                className="form-input w-full border rounded-md"
                placeholder="Enter account holder name"
              />
            </div>

            {/* Account Number */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-md font-medium text-gray-600"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                className="form-input w-full border rounded-md"
                placeholder="Enter account number"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label
                htmlFor="ifscCode"
                className="block text-md font-medium text-gray-600"
              >
                IFSC Code
              </label>
              <input
                type="text"
                id="ifscCode"
                className="form-input w-full border rounded-md"
                placeholder="Enter IFSC code"
              />
            </div>

            {/* Account Type */}
            <div>
              <label
                htmlFor="accountType"
                className="block text-md font-medium text-gray-600"
              >
                Account Type (Savings or Current)
              </label>
              <input
                type="text"
                id="accountType"
                className="form-input w-full border rounded-md"
                placeholder="Enter account type"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-md font-medium text-gray-600"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                className="form-input w-full border rounded-md"
                placeholder="Enter bank name"
              />
            </div>

            {/* Branch Name */}
            <div>
              <label
                htmlFor="branchName"
                className="block text-md font-medium text-gray-600"
              >
                Account Opening Branch
              </label>
              <input
                type="text"
                id="branchName"
                className="form-input w-full border rounded-md"
                placeholder="Enter branch name"
              />
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-8 w-full"
            onClick={handleSubmit}
          >
            Sell
          </button>
        </div>
      </div>
    </>
  );
};

export default SellPayment;
