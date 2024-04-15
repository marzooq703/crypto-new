'use client';

import { useConnect, useAccount, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';
import { polygon } from 'viem/chains';

export const PayButton = () => {
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [started, setStarted] = useState(false);
  const [errors, setErrors] = useState('');
  const [completed, setCompleted] = useState(false);
  const price = 0.1;

  const handlePayment = async () => {
    try {
      setErrors('');
      setStarted(true);

      if (!address) {
        await connectAsync({ chainId: polygon.id, connector: injected() });
      }

      const data = await writeContractAsync({
        chainId: polygon.id,
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        functionName: 'transfer',
        abi: [
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
        ],
        args: ['0x269b7Fb9F7Be8945E6d0fD5c132E86c79ab55D2B', price * 1000000],
      });

      setCompleted(true);
      console.log(data);
    } catch (err) {
      console.error(err);
      setStarted(false);
      setErrors('Payment failed. Please try again: ' + err.message);
      setCompleted(false); 
    }
  };

  return (
    <>
      {!completed && (
        <button
          disabled={started}
          className="mt-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handlePayment}
        >
          {started ? 'Confirming...' : 'Pay Now'}
        </button>
      )}
      {completed && (
        <p className="text-stone-800 mt-2 bg-green-200 rounded-md text-sm py-2 px-4">
          Thank you for your payment.
        </p>
      )}
      {errors && (
        <p className="text-stone-800 mt-2 bg-red-200 rounded-md text-sm py-2 px-4">
          {errors}
        </p>
      )}
    </>
  );
};

export default PayButton;
