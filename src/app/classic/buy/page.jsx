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
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
// import {sendMessageToGroup} from "../../../lib/telegram"
import faceIO from '@faceio/fiojs';

const BuyCrypto = () => {
  const [inrValue, setInrValue] = useState('');
  const [usdtValue, setUsdtValue] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [faceIo, setFaceIo] = useState({});
  const [authenticating, setAuthenticating] = useState(false);

  function handleError(errCode) {
    // Handle error here
    // Log all possible error codes during user interaction..
    // Refer to: https://faceio.net/integration-guide#error-codes
    // for a detailed overview when these errors are triggered.
    const fioErrs = faceIo.fetchAllErrorCodes();
    switch (errCode) {
      case fioErrs.PERMISSION_REFUSED:
        console.log('Access to the Camera stream was denied by the end user');
        break;
      case fioErrs.NO_FACES_DETECTED:
        console.log(
          'No faces were detected during the enroll or authentication process',
        );
        break;
      case fioErrs.UNRECOGNIZED_FACE:
        console.log("Unrecognized face on this application's Facial Index");
        break;
      case fioErrs.MANY_FACES:
        console.log('Two or more faces were detected during the scan process');
        break;
      case fioErrs.FACE_DUPLICATION:
        console.log(
          'User enrolled previously (facial features already recorded). Cannot enroll again!',
        );
        break;
      case fioErrs.MINORS_NOT_ALLOWED:
        console.log('Minors are not allowed to enroll on this application!');
        break;
      case fioErrs.PAD_ATTACK:
        console.log(
          'Presentation (Spoof) Attack (PAD) detected during the scan process',
        );
        break;
      case fioErrs.FACE_MISMATCH:
        console.log(
          'Calculated Facial Vectors of the user being enrolled do not match',
        );
        break;
      case fioErrs.WRONG_PIN_CODE:
        console.log('Wrong PIN code supplied by the user being authenticated');
        break;
      // ...
      // Refer to the boilerplate at: https://gist.github.com/symisc/34203d2811a39f2a871373abc6dd1ce9
      // for the list of all possible error codes.
    }
  }
  async function authenticateUser() {
    try {
      const userData = await faceIo.authenticate({
        locale: 'auto', // Default user locale
      });
      router.push('/classic/payment');
    } catch (error) {
      handleError(error.code);
    }
  }

  useEffect(() => {
    setFaceIo(new faceIO('fioab44a'));
  }, []);

  console.log(userEmail, 'email');
  console.log(usdtValue, 'usdtValue');
  const router = useRouter();

  useEffect(() => {
    // Fetch user email if not already fetched
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('crypto-user');
      if (!user) {
        router.push('/authentication');
      } else {
        setUserEmail(JSON.parse(user).email);
      }
    }
  }, []);

  const fetchConversionRate = async () => {
    try {
      console.log('Current data:');
      const unsub = onSnapshot(doc(db, 'currentPricing', 'Buy'), (doc) => {
        const data = doc.data();
        console.log('Current data: ', data);
        const buy = data.current;
        const conversionRate = buy;
        const calculatedUsdtValue =
          parseFloat(inrValue || 0) / parseFloat(conversionRate);
        setUsdtValue(calculatedUsdtValue.toFixed(2)); // Rounded to 2 decimal places
      });
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
    }
  };

  const handleInrInputChange = async (e) => {
    const { value } = e.target;
    setInrValue(value);

    // Log the INR value when it changes
    console.log('INR Value:', value);
  };

  const handleUSDTChange = async (e) => {
    const { value } = e.target;
    setUsdtValue(value);

    console.log('USdt value', value);
  };

  const handleSubmit = async () => {
    try {
      // Store values in local storage
      const numberInrVal = Number(inrValue);
      const numberUSDTVal = Number(usdtValue);
      if (
        numberInrVal == NaN ||
        numberInrVal == 0 ||
        numberUSDTVal == NaN ||
        numberUSDTVal == 0
      ) {
        setInrValue(0);
        setUsdtValue(0);
        Swal.fire({
          icon: 'error',
          title: 'Incorrect Price!',
        });
        return;
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('inrValue', inrValue);
          localStorage.setItem('usdtValue', usdtValue);

          localStorage.setItem('tds-value', inrValue / 100);
          localStorage.setItem(
            'total-value',
            Number(inrValue) + Number(inrValue / 100),
          );
        }
        setAuthenticating(true);
        // Autenticate User
        // authenticateUser();
        router.push('/classic/payment');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, [inrValue]);
  // if (authenticating) return 'Authenticate your face to continue';
  return (
    <div>
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className={cn('relative')}>
            <div className="mb-3">
              <CoinInput2
                label={'From'}
                value={inrValue}
                onChange={handleInrInputChange}
                placeholder="Enter INR value"
                defaultCoinIndex={1}
                exchangeRate={83.61}
              />
            </div>
            {/* <div className="mb-3">
              <input
                type="text"
                value={usdtValue}
                onChange={handleUSDTChange}
                placeholder="Enter USDT value"
                className="w-full rounded-br-lg rounded-tr-lg border-0 pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
              />
            </div> */}
            <div className="mb-3">
              <CoinInput
                label={'To'}
                defaultCoinIndex={0}
                onChange={handleUSDTChange}
                exchangeRate={0.0}
                value={usdtValue}
                placeholder="USDT value"
                disabled={true}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          {/* <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} /> */}
          <TransactionInfo label={'TDS - 1%'} value={`₹ ${inrValue / 100}`} />
          <TransactionInfo
            label={'Total'}
            value={`₹ ${Number(inrValue) + Number(inrValue / 100)}`}
          />
          {/* <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} /> */}
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
        {/* <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={() => {
            axios
              .post('http://localhost:3000/classic/kyc/api', {
                amount: '1',
                name: 'Hassan Marzooq',
                email: 'marzooq703@gmail.com',
                phone: "8903528906"
              })
              .then((val) => {
                console.log(val);
              })
              .catch((err) => console.error(err));
          }}
        >
          Test
        </Button> */}
      </Trade>
    </div>
  );
};

export default BuyCrypto;
