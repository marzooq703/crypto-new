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
  // Local storage keys
  const sellingAmountKey = 'sellingAmount';
  const selectedNetworkKey = 'selectedNetwork';
  const toCoinValueKey = 'toCoinValue';
  const [usdtAmount, setUsdtAmount] = useState('');
  const [inrAmount, setInrAmount] = useState(0);

  useEffect(() => {
    // Fetch conversion rate from an API (You need to replace the placeholder URL with your API endpoint)
    fetch('https://api.coincap.io')
      .then((response) => response.json())
      .then((data) => {
        const conversionRate = data.rate;
        const calculatedInrAmount = usdtAmount * conversionRate;
        setInrAmount(calculatedInrAmount);
      })
      .catch((error) =>
        console.error('Error fetching conversion rate:', error),
      );
  }, [usdtAmount]);

  const handleUsdtAmountChange = (amount) => {
    setUsdtAmount(amount);
  };

  // Retrieve data from local storage or default values
  const initialSellingAmount = localStorage.getItem(sellingAmountKey) || '';
  const initialSelectedNetwork =
    localStorage.getItem(selectedNetworkKey) || 'matic';
  const initialToCoinValue = localStorage.getItem(toCoinValueKey) || '{}';

  // State variables
  const [selectedNetwork, setSelectedNetwork] = useState(
    initialSelectedNetwork,
  );

  // Next.js router instance
  const router = useRouter();

  // Handle network change
  const handleNetworkChange = (e) => {
    const network = e.target.value;
    setSelectedNetwork(network);
    localStorage.setItem(selectedNetworkKey, network); // Store selected network in local storage
  };

  // Handle form submission
  const handleSubmit = () => {
    // Redirect to the sellPayment page and pass the selling amount as a query parameter
    router.push({
      pathname: '/classic/sellPayment',
      query: { amount: localStorage.getItem(sellingAmountKey) }, // Retrieve selling amount from local storage
    });
  };

  // Handle input change for 'From' coin input
  const handleCoinInputChange = (data) => {
    // Stringify the data before storing it in local storage
    localStorage.setItem(sellingAmountKey, JSON.stringify(data));
    console.log('From coin value:', data); // Log the value in the console
  };

  // Handle input change for 'To' coin input (CoinInput2)
  const handleCoinInput2Change = (data) => {
    // Stringify the data before storing it in local storage
    localStorage.setItem(toCoinValueKey, JSON.stringify(data));
    console.log('To coin2 value:', data); // Log the value in the console
  };

  return (
    <div>
      {/* Trade container */}
      <Trade>
        {/* Trade form */}
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className="flex items-center mb-4">
            <label className="mr-2 font-semibold text-gray-700">Chains:</label>
            {/* Dropdown for selecting network */}
            <select
              value={selectedNetwork}
              onChange={handleNetworkChange}
              className="px-5 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="erc20">ERC-20</option>
              <option value="bep20">BEP-20</option>
              <option value="matic">Matic-20</option>
            </select>
            {/* Dropdown icon */}
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
          {/* Coin input fields */}
          <div className={cn('relative flex gap-3')}>
            {/* 'From' coin input */}
            <CoinInput
              label={'From'}
              exchangeRate={0.0}
              defaultCoinIndex={0}
              getCoinValue={(handleCoinInputChange, handleUsdtAmountChange)}
            />
            {/* 'To' coin input (CoinInput2) */}
            <CoinInput2
              label={'To'}
              exchangeRate={0.0}
              defaultCoinIndex={1}
              value={inrAmount}
              getCoinValue={handleCoinInput2Change}
              disabled={true}
            />
          </div>
        </div>
        {/* Transaction information */}
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} />
          <TransactionInfo label={'Price Slippage'} value={'1%'} />
          <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} />
        </div>
        {/* Sell button */}
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
