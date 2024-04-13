'use client';
import {  useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';

const PaymentConfirmation = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderid');
    const [paymentResponse, setPaymentResponse] = useState({});
    useEffect(async () => {
        if(orderId) {
            const response = await axios.get(
                `https://cr-backend-three.vercel.app/api/cashfree/payments/${orderId}`
              );
              console.log(response);
              setPaymentResponse(response[0])
              if(response[0].payment_status == 'SUCCESS') {

              }
        }
    }, []);
    return (
        <>
            <div>Payment Confirmation</div> - {orderId}
        </>
    )
}
export default PaymentConfirmation;