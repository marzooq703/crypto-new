import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Button from '@/components/ui/button';
import axios from 'axios';

type TransactionType = 'buy' | 'sell';

interface TransactCoinProps {
  className?: string;
  transactionType: TransactionType;
}

const TransactCoin = ({ className, transactionType }: TransactCoinProps) => {
  const router = useRouter();
  const [amount, setAmount] = useState<any>(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [fromCurrency, setFromCurrency] = useState<'usdt' | 'inr'>('usdt');
  const [toCurrency, setToCurrency] = useState<'usdt' | 'inr'>('inr');
  const decimalPattern = /^[0-9]*[.,]?[0-9]*$/;
  const inrToUsdtRate = 0.014;

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: 'tether',
              vs_currencies: toCurrency === 'inr' ? 'inr' : 'usd',
            },
          },
        );

        if (
          response.data &&
          response.data.tether &&
          response.data.tether[toCurrency === 'inr' ? 'inr' : 'usd']
        ) {
          const conversionRate =
            response.data.tether[toCurrency === 'inr' ? 'inr' : 'usd'];
          setConversionRate(conversionRate);
        } else {
          throw new Error('Invalid response or missing data');
        }
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, [transactionType, toCurrency]); // Update conversion rate when transaction type or currency changes

  // Update the handleOnChangeFirstCoin function to ensure it only accepts valid numerical values
  const handleOnChangeFirstCoin = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;
    if (inputValue === '' || inputValue.match(decimalPattern)) {
      const numericValue = parseFloat(inputValue);
      setAmount(numericValue);
    }
  };

  const handleCurrencySwap = () => {
    // Swap currencies
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleClick = () => {
    if (transactionType === 'buy') {
      router.push('/classic/buy');
    } else if (transactionType === 'sell') {
      // Handle sell functionality
      const inrValue = amount / conversionRate;
      console.log('INR Value: ', inrValue);
    }
  };

  const handleTransactionTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedTransactionType = event.target.value as TransactionType;
    // Update transaction type directly
    transactionType = selectedTransactionType;

    // Update amount and conversion rate based on transaction type
    if (selectedTransactionType === 'buy') {
      setAmount(0); // Reset amount for buy
      setConversionRate(inrToUsdtRate);
    } else if (selectedTransactionType === 'sell') {
      setAmount(0); // Reset amount for sell
      setConversionRate(1 / inrToUsdtRate); // Inverse conversion rate for sell
    }
  };

  return (
    <div className={cn(className)}>
      {/* Select Option */}
      <select
        value={transactionType}
        onChange={handleTransactionTypeChange}
        className="block w-full px-4 py-2 mt-2 mb-12 text-base border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 dark:bg-dark-200 dark:text-white dark:border-gray-600"
      >
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>

      {/* Currency Input Field */}
      <div className="group relative flex rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
        <div className="flex items-center pl-2">
          {fromCurrency.toUpperCase()}
        </div>
        <input
          type="text"
          value={amount}
          placeholder="0.0000"
          inputMode="decimal"
          onChange={handleOnChangeFirstCoin}
          className="md w-full rounded-lg border-0 text-base outline-none focus:ring-0 ltr:text-right rtl:text-left dark:bg-light-dark py-2 px-4"
        />
      </div>

      {/* Conversion Rate Display */}
      <div className="relative mt-4 flex h-11 w-full items-center justify-between rounded-lg border border-gray-100 bg-body px-4 pl-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-13 sm:pl-4">
        <span className="relative flex items-center gap-3 font-medium">
          {toCurrency.toUpperCase()}
        </span>
        <span className="absolute top-0 h-full w-[1px] bg-gray-100 ltr:left-24 rtl:right-24 dark:bg-gray-700" />
        <span className="text-sm sm:text-base">
          {(amount * conversionRate).toFixed(4)}
        </span>
      </div>

      {/* Button */}
      <Button
        size="large"
        shape="rounded"
        fullWidth={true}
        className="mt-6 uppercase xs:mt-8 xs:tracking-widest xl:px-2 2xl:px-9"
        onClick={handleClick}
      >
        {transactionType === 'buy' ? 'Buy' : 'Sell'}
      </Button>
    </div>
  );
};

export default TransactCoin;
