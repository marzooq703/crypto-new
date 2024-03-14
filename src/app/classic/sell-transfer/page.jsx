'use client';

import { useState } from 'react';
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

const SellPayment = () => {
  const [sellingAmount, setSellingAmount] = useState({});
  const [cryptoAmount, setCryptoAmount] = useState({});
  const [error, setError] = useState(null);
  const [, setTxs] = useState([]);

  const cryptowalletAmount = JSON.stringify(cryptoAmount.amount);
  console.log(cryptowalletAmount, 'hjh');

  const handlePayButtonClick = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await startPayment({
        setError,
        setTxs,
        amount: `${sellingAmount.value}`,
        addr: '0xb141A92Eabd9F05D21bB388a8AFfcA6d6Eea752B',
        network: 'matic',
      });
    } catch (err) {
      setError(err.message);

      alert(`Error: ${err.message}`);
    }
  };

  console.log(sellingAmount.value, 'asdas');

  return (
    <>
      <div className="max-w-screen-xl mx-auto mt-8 space-y-8">
        <div className="border rounded p-6 bg-white shadow-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Confirm Information
          </h2>

          <p className="text-sm text-center mb-6 text-gray-600">
            You are about to receive{' '}
            <strong className="text-green-500">100 </strong>rupees for{' '}
            <strong className="text-blue-500">1.5 Eth </strong> in wallet.
          </p>

          <div className="flex justify-between border rounded p-4 bg-gray-100">
            <div style={{ textAlign: 'center' }}>
              <p className="text-sm mb-2 text-gray-600">To sell</p>
              <strong className="text-red-500">1.5 </strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-sm mb-2 text-gray-600">You get</p>
              <strong className="text-green-500">100</strong>
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
            onClick={handlePayButtonClick}
          >
            Sell
          </button>
        </div>
      </div>
    </>
  );
};

export default SellPayment;
