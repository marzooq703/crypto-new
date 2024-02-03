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

const BuyCrypto = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('matic');
  const [inrValue, setInrValue] = useState('');
  const [usdtValue, setUsdtValue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
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
        const calculatedUsdtValue =
          parseFloat(inrValue) / parseFloat(conversionRate);
        setUsdtValue(calculatedUsdtValue.toFixed(2)); // Rounded to 2 decimal places
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    if (inrValue !== '') {
      fetchConversionRate();
    }
  }, [inrValue]);

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };

  const handleSubmit = () => {
    router.push('/classic/payment');
  };

  const handleInrInputChange = (e) => {
    setInrValue(e.target.value);
  };

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
          <div className={cn('relative')}>
            <div className="mb-3">
              <CoinInput2
                label={'From'}
                value={inrValue}
                onChange={handleInrInputChange}
                placeholder="Enter INR value"
              />
            </div>
            <div className="mb-3">
              <CoinInput
                label={'To'}
                value={usdtValue}
                placeholder="USDT value"
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
          BUY
        </Button>
      </Trade>
    </div>
  );
};

export default BuyCrypto;
