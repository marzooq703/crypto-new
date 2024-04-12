'use client';

import { useEffect, useState } from 'react';
import { load } from '@cashfreepayments/cashfree-js';

const Checkout = () => {
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      const cashfreeInstance = await load({ mode: 'production' });
      setCashfree(cashfreeInstance);
    };
    initializeSDK();
  }, []);

  const doPayment = async () => {
    if (!cashfree) return;
    const checkoutOptions = {
      paymentSessionId:
        'session_YCXyD5oa9tjwaK-7FI-sjTCgMttIwD-4GY2Yrg-D0ifFTcI4iz7xe6Y5E3qMjsrAVmTPDoMRJLU0-F5PpXVIfuKLzle7G3ZhtIZ-0zft3-ND',
      redirectTarget: '_self',
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
