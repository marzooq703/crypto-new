'use client';

import { useEffect, useState } from 'react';
import { load } from '@cashfreepayments/cashfree-js';

const Checkout = () => {
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      const cashfreeInstance = await load({ mode: 'sandbox' });
      setCashfree(cashfreeInstance);
    };
    initializeSDK();
  }, []);

  const doPayment = async () => {
    if (!cashfree) return;
    const checkoutOptions = {
      paymentSessionId:
        'session_Bf-gvKWpi5gQU0h5uHfEimoSP4sQi2W9G6D0PxQ3e7ftPwWxwj6P8z-Z3RGh_UCF-dwQB-MdedCsCvIqkSMxWSg1ACOwwF7G4w8apAqrZDaX',
      redirectTarget: '_modal',
    };
    cashfree.checkout(checkoutOptions).then(() => {
      console.log('Payment is attempted, Check for status!!');
    });
  };

  return (
    <div className="row">
      <p>payment</p>
      <button
        type="button"
        className="btn btn-primary"
        id="renderBtn"
        onClick={doPayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
