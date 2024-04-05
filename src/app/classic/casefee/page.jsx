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
        'session_NX3Ox6pqFnSm2zK9ksjJICiPBxbDl_rPFg_w3KAhcoH692sCChKYGvor4m8yNnqYxRVWwnV53LYy9YjbR9_sRaUnRYAysEOqeFzybpC3Y9U4',
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
