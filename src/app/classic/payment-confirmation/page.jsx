'use client';
import {  useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Suspense } from 'react'

const PaymentConfirmation = () => {
    const GetOrder = () =>{
        const searchParams = useSearchParams();
        const orderId = searchParams.get('orderid');
        const [paymentResponse, setPaymentResponse] = useState({});
        const [loading, setLoading] = useState(true);
        useEffect(async () => {
            if(orderId) {
                const response = await axios.get(
                    `https://cr-backend-three.vercel.app/api/cashfree/payments/${orderId}`
                  );
                  console.log(response);
                  setPaymentResponse(response.data[0])
                  if(response.data[0].payment_status == 'SUCCESS') {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful',
                        text: 'Thank you for your payment!',
                    });
                  }
            }
        }, []);
        if(loading) return (<>Verifying payment status...</>)
        return (
            <>
             <div>Payment Status - <b> {paymentResponse.payment_status}</b></div>
            <div>Bank Reference - <b> {paymentResponse.bank_reference}</b></div>
            <div>CF Payment Id - <b> {paymentResponse.cf_payment_id}</b></div>
            <div>Order Id - <b> {paymentResponse.order_id}</b></div>
            <div>Amount - <b>{paymentResponse.payment_amount}  {paymentResponse.payment_currency}</b></div>
            <div>Payment Completion Time- <b> {paymentResponse.payment_completion_time}</b></div>
            <div>Payment Method - <b> {paymentResponse.payment_group}</b></div>
            </>
        )
    } 
    return (
        <Suspense>
            <GetOrder />           
        </Suspense>
    )
}
export default PaymentConfirmation;