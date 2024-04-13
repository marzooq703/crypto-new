import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '@/components/icons/chevron-down';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';

interface CoinInputTypes extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  exchangeRate?: number;
  className?: string;
  getCoinValue: (param: { coin: string; value: string }) => void;
}

const decimalPattern = /^[0-9]*[.,]?[0-9]*$/;

const CoinInput2: React.FC<CoinInputTypes> = ({
  label,
  getCoinValue,
  exchangeRate,
  className,
  ...rest
}) => {
  const [value, setValue] = useState('');
  const [visibleCoinList, setVisibleCoinList] = useState(false);
  const modalContainerRef = React.useRef<HTMLDivElement>(null);

  useClickAway(modalContainerRef, () => {
    setVisibleCoinList(false);
  });

  useLockBodyScroll(visibleCoinList);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(decimalPattern)) {
      setValue(event.target.value);
      const param = { coin: 'INR', value: event.target.value };
      getCoinValue && getCoinValue(param);
    }
  };

  return (
    <>
      {/* <div
        className={`group flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600 ${className}`}
      >
        <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
          <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <button
            onClick={() => setVisibleCoinList(true)}
            className="flex items-center font-medium outline-none dark:text-gray-100"
          >
            <span>INR (₹)</span>
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
            {...rest}
          />
          <span className="font-xs px-3 text-gray-400">
            = $
            {exchangeRate
              ? (parseFloat(value) * exchangeRate).toFixed(2)
              : '0.00'}
          </span>
        </div>
      </div> */}

      <div
        className={`flex min-h-[70px] rounded-lg border border-gray-200 ${className}`}
      >
        <div className="min-w-[80px] border-r border-gray-200 p-3">
          <span className="mb-1.5 block text-xs uppercase text-gray-600">
            {label}
          </span>
          <span className="flex items-center font-medium outline-none text-gray-800 dark:text-gray-100">
            INR (₹)
          </span>
        </div>
        <div className="flex flex-1 flex-col text-right">
          <input
            type="text"
            value={value}
            placeholder="0.0"
            inputMode="decimal"
            onChange={handleOnChange}
            className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
            {...rest}
          />
          <span className="font-xs px-3 text-gray-400">
            = $
            {exchangeRate
              ? (parseFloat(rest.value || 0) / exchangeRate).toFixed(2)
              : '0.00'}
          </span>
        </div>
      </div>
      {/* <AnimatePresence>
        {visibleCoinList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
          >
\            <span
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
\              <div
                onClick={() =>
                  handleOnChange({
                    target: { value: 'INR' },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              >
                INR
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
};

CoinInput2.propTypes = {
  label: PropTypes.string.isRequired,
  getCoinValue: PropTypes.func.isRequired,
  exchangeRate: PropTypes.number,
  className: PropTypes.string,
};

CoinInput2.displayName = 'CoinInput';

export default CoinInput2;
