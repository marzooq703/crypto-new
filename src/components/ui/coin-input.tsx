import type { CoinTypes } from '@/types';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import { ChevronDown } from '@/components/icons/chevron-down';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import { coinList } from '@/data/static/coin-list';
// dynamic import
const CoinSelectView = dynamic(
  () => import('@/components/ui/coin-select-view'),
);

interface CoinInputTypes extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  exchangeRate?: number;
  defaultCoinIndex?: number;
  className?: string;
  getCoinValue: (param: { coin: string; value: string }) => void;
}

const decimalPattern = /^[0-9]*[.,]?[0-9]*$/;

export default function CoinInput({
  label,
  getCoinValue,
  defaultCoinIndex = 0,
  exchangeRate,
  className,
}: CoinInputTypes) {
  const [chainSelected, setChainSelected] = useState(false);
  const [selectedChain, setSelectedChain] = useState('');
  const [value, setValue] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(coinList[defaultCoinIndex]);
  const [visibleCoinList, setVisibleCoinList] = useState(false);
  const [visibleChainMessage, setVisibleChainMessage] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectedChain = (selectedChain: string) => {
    setSelectedChain(selectedChain);
  };

  useClickAway(modalContainerRef, () => {
    setVisibleCoinList(false);
  });
  useLockBodyScroll(visibleCoinList);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(decimalPattern)) {
      setValue(event.target.value);
      const param = { coin: selectedCoin.code, value: event.target.value };
      getCoinValue && getCoinValue(param);
    }
  };

  useEffect(() => {
    if (chainSelected && selectedCoin) {
      setVisibleCoinList(false); // Close modal when both coin and chain are selected
    }
  }, [chainSelected, selectedCoin]);

  const handleChainSelection = (selectedValue: string) => {
    setChainSelected(true);
    setSelectedChain(selectedValue);
    setVisibleCoinList(false);
  };

  function handleSelectedCoin(coin: CoinTypes) {
    setSelectedCoin(coin);

    // Check if the coin is selected
    if (coin) {
      // Show the chains dropdown after selecting the coin
      setVisibleChainMessage(true);
    }
  }

  const chains = [
    { code: 'btc', name: 'Bitcoin' },
    { code: 'eth', name: 'Ethereum' },
    { code: 'ltc', name: 'Litecoin' },
  ];

  return (
    <div className="w-full">
      <>
        <div
          className={cn(
            'group flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600',
            className,
          )}
        >
          <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
            <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
              {label}
            </span>
            <button
              onClick={() => setVisibleCoinList(true)}
              className="flex items-center font-medium outline-none dark:text-gray-100"
            >
              {selectedCoin?.icon}{' '}
              <span className="ltr:ml-2 rtl:mr-2">{selectedCoin?.code} </span>
              <ChevronDown className="ltr:ml-1.5 rtl:mr-1.5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col text-right">
            <input
              type="text"
              value={value}
              placeholder="0.0"
              inputMode="decimal"
              onChange={handleOnChange}
              className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
            />
            <span className="font-xs px-3 text-gray-400">
              = ${exchangeRate ? exchangeRate : '0.00'}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {visibleCoinList && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
            >
              <span
                className="inline-block h-full align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                exit={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                ref={modalContainerRef}
                className="inline-block text-left align-middle"
              >
                <CoinSelectView
                  onSelect={(selectedCoin) => {
                    handleSelectedCoin(selectedCoin);
                    handleChainSelection(selectedChain); // Call handleSelectedChain when a chain is selected
                  }}
                />

                {/* {visibleChainMessage && (
          <div className="mt-4">
            <label
              htmlFor="chainSelect"
              className="block mb-1 text-sm font-bold text-gray-700 dark:text-gray-300"
            >
              Select Chain
            </label>
            <select
  id="chainSelect"
  value={selectedChain}
  onChange={(e) => handleChainSelection(e.target.value)} // Corrected
  className="w-full py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
>
              <option value="">Select a chain</option>
              {chains.map((chain) => (
                <option key={chain.code} value={chain.code}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
        )} */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </div>
  );
}

CoinInput.displayName = 'CoinInput';
