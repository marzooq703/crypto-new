'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import CoinInput2 from '@/components/ui/coin-input2';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import Trade from '@/components/ui/trade';

const BuyCrypto = () => {
  let [toggleCoin, setToggleCoin] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('matic'); // Default to 'matic'

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };
  const router = useRouter();

  const clickBuy = () => {
    let coinInput2Value;
    if (typeof window !== undefined) {
      coinInput2Value = localStorage.getItem('datas');
    }

    // Check if the value is not 0, undefined, or null
    if (
      coinInput2Value !== null &&
      coinInput2Value !== undefined &&
      coinInput2Value !== '0'
    ) {
      // Proceed with the redirection logic
      router.push('/classic/payment');
    } else {
      // Show an error popup
      alert('Error: Invalid CoinInput2 value. Please provide a valid value.');
      // You might want to display a more user-friendly error message or use a modal popup
    }
  };

  const handleCoinValue = (data) => {
    // Check if data is not null, undefined, or 0
    if (data !== null && data !== undefined && data !== 0) {
      // Store data in localStorage
      localStorage.setItem('datas', JSON.stringify(data));
    } else {
      // Show error message
      console.error('Error: Please provide a valid value');
      // You might want to display a more user-friendly error message or use a modal popup
    }
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
            <CoinInput2
              label={'From'}
              exchangeRate={0.0}
              defaultCoinIndex={0}
              getCoinValue={handleCoinValue}
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
            <CoinInput
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
          onClick={clickBuy}
        >
          BUY
        </Button>
      </Trade>
    </div>
  );
};

export default BuyCrypto;
