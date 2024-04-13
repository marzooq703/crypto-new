'use client';
import {  useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Suspense } from 'react'

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
              setPaymentResponse(response.data[0])
              if(response.data[0].payment_status == 'SUCCESS') {
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: 'Thank you for your payment!',
                });
              }
        }
    }, []);
    return (
        <Suspense>
            <div>Payment Status</div> - {paymentResponse.payment_status}
            <div>Bank Reference</div> - {paymentResponse.bank_reference}
            <div>CF Payment Id</div> - {paymentResponse.cf_payment_id}
            <div>Order Id</div> - {paymentResponse.order_id}
            <div>Amount</div> - {paymentResponse.payment_amount} {paymentResponse.payment_currency}
            <div>Order Id</div> - {paymentResponse.order_id}
            <div>Order Id</div> - {paymentResponse.order_id}
            <div>Order Id</div> - {paymentResponse.order_id}
            <div>Order Id</div> - {paymentResponse.order_id}
        </Suspense>
    )
}
export default PaymentConfirmation;