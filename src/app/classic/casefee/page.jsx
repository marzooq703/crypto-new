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
        'session_g45uK7SSj_toM61SBjntPycEHUJgoQ-OQEePh3yzaPXFjyoDq5ZjQfVEv99ZMIQyOX10NeA4r2iJVS8Il9BZJd64qVwsNZLgBGvJ0zBab8Cp',
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
