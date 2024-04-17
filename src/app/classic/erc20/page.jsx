'use client';

import {
  useConnect,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';
import { polygon } from 'viem/chains';
import { useBalance } from 'wagmi';

export const PayButton = () => {
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [hashs, setHashs] = useState('');

  const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({
    hash: hashs,
  });
  console.log(isLoading, 'isLoading');
  console.log(isSuccess, 'isSuccess');
  console.log(error, 'error');
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const price = 0.1;

  const handlePayment = async () => {
    try {
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
      setHashs(data);
      console.log(`https://polygonscan.com/tx/${data}`);
      console.log(hashs);
      console.log(data);
    } catch (err) {
      console.error(err);
      setStarted(false);
      setCompleted(false);
    }
  };

  if (isLoading) {
    return <p>Waiting for confirmation...</p>;
  }

  if (isSuccess) {
    return <p>Transaction confirmed.</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <button onClick={handlePayment} disabled={started || completed}>
        {started ? 'Confirming...' : 'Pay Now'}
      </button>
      {/* <h1>
        <a
          href={`https://polygonscan.com/address/${hashs}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Transaction on PolygonScan
        </a>
      </h1> */}
    </>
  );
};

export default PayButton;
