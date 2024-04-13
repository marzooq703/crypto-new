"use client";
import {  useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useEffect } from 'react';

const PaymentConfirmation = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderid');
    useEffect(async () => {
        if(orderId) {
            const response = await axios.get(
                `https://cr-backend-three.vercel.app/api/cashfree/payments/${orderId}`
              );
              console.log(response)
        }
    }, []);
    return (
        <>
            <div>Payment Confirmation</div> - {orderId}
        </>
    )
}
export default PaymentConfirmation;