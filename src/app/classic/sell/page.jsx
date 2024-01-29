'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import CoinInput2 from '@/components/ui/coin-input2';
import TransactionInfo from '@/components/ui/transaction-info';
import Trade from '@/components/ui/trade';

const SellCrypto = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('matic'); // Default to 'matic'
  const [sellingAmount, setSellingAmount] = useState({});
  const [cryptoAmount, setCryptoAmount] = useState({});
  const [inrValue, setInrValue] = useState(0);

  const router = useRouter();

  useEffect(() => {
    // Fetch conversion rate from an API when sellingAmount changes
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(
          'https://api.example.com/conversionRate?from=usdt&to=inr', // Need to update the API
        );
        if (!response.ok) {
          throw new Error('Failed to fetch conversion rate');
        }
        const data = await response.json();
        const conversionRate = data.rate;
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

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };

  const handleSubmit = () => {
    router.push('/classic/sellPayment');
  };

  let handleCoinInputChange;
  if (typeof window !== 'undefined') {
    handleCoinInputChange = (data) => {
      setSellingAmount(data);
      localStorage.setItem('sellingAmount', JSON.stringify(data));
    };
  }

  let handleCoinInput2Change;
  if (typeof window !== 'undefined') {
    handleCoinInput2Change = (data) => {
      setCryptoAmount(data);
      localStorage.setItem('cryptoAmount', JSON.stringify(data));
    };
  }

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
              <svg
                className="h-4 w-4 fill-current text-gray-600 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L16 7z" />
              </svg>
            </div>
          </div>
          <div className={cn('relative flex gap-3')}>
            <CoinInput
              label={'From'}
              exchangeRate={0.0}
              defaultCoinIndex={0}
              getCoinValue={handleCoinInputChange}
            />
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
