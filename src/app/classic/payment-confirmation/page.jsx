"use client";
import {  useSearchParams } from 'next/navigation';
import axios from 'axios;';
import { useEffect } from 'react';

const PaymentConfirmation = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderid');
    // useEffect(async () => {
    //     const response = await axios.get(
    //         'https://api.coingecko.com/api/v3/simple/price',
    //         {
    //           params: {
    //             ids: 'tether',
    //             vs_currencies: toCurrency === 'inr' ? 'inr' : 'usd',
    //           },
    //         },
    //       );
    // }, [])
    return (
        <>
            <div>Payment Confirmation</div> - {orderId}
        </>
    )
}