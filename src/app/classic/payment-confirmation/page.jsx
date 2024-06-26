'use client';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Suspense } from 'react';
import dayjs from 'dayjs';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PaymentConfirmation = () => {
  const GetOrder = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderid');
    const [paymentResponse, setPaymentResponse] = useState({});
    const [loading, setLoading] = useState(true);

    const [total, setTotal] = useState(0);
    const [inrValue, setInrValue] = useState(0);
    const [usdtValue, setUsdtValue] = useState(0);
    const [tds, setTds] = useState(0);
    const [walletAddress, setWalletAddress] = useState('');
    const [user, setUser] = useState({
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      uid: '',
      isKycVerified: false,
    });

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedInrValue = localStorage.getItem('inrValue');
        const storedUsdtValue = localStorage.getItem('usdtValue');
        const tds = localStorage.getItem('tds-value');
        const totalValue = localStorage.getItem('total-value');
        const wallet = localStorage.getItem('buy-wallet-address');

        const user = localStorage.getItem('crypto-user');

        if (wallet) {
          setWalletAddress(wallet);
        }
        if (storedInrValue) {
          setInrValue(JSON.parse(storedInrValue));
        }
        if (storedUsdtValue) {
          setUsdtValue(JSON.parse(storedUsdtValue));
        }
        if (tds) {
          setTds(JSON.parse(tds));
        }
        if (totalValue) {
          setTotal(JSON.parse(totalValue));
        }
        if (user) {
          setUser(JSON.parse(user));
        }
      }
    }, []);
    const getPaymentStatus = async () => {
      if (orderId) {
        const response = await axios.get(
          `https://cr-backend-three.vercel.app/api/cashfree/payments/${orderId}`,
        );
        setLoading(false);
        console.log(response);
        console.log('response.data', response.data);
        if (response.data.length == 0)
          setPaymentResponse('paymentNotProcessed');
        else if (response.data[0].payment_status != 'SUCCESS')
          setPaymentResponse('paymentNotProcessed');
        else if (response.data[0].payment_status == 'SUCCESS') {
          setPaymentResponse(response.data[0]);
          setLoading(false);
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: 'Thank you for your payment!',
          });
        }
      }
    };
    useEffect(() => {
      getPaymentStatus();
    }, []);
    const setInDoc = async () => {
      if (
        walletAddress &&
        total &&
        user.email &&
        paymentResponse.payment_completion_time
      ) {
        const docRef1 = doc(db, 'userTransactions', user.email);
        const docSnap = await getDoc(docRef1);
        if (docSnap.exists()) {
          await updateDoc(docRef1, {
            buy: arrayUnion({
              walletAddress: walletAddress,
              totalAmount: total,
              email: user.email,
              status: 'success',
              cryptoTrasnfer: 'pending',
              time: paymentResponse.payment_completion_time,
              usdtValue: usdtValue,
              orderId: orderId,
            }),
          });
        } else {
          await setDoc(docRef1, {
            buy: arrayUnion({
              walletAddress: walletAddress,
              totalAmount: total,
              email: user.email,
              status: 'success',
              cryptoTrasnfer: 'pending',
              time: paymentResponse.payment_completion_time,
              usdtValue: usdtValue,
              orderId: orderId,
            }),
          });
        }

        const docRef2 = doc(db, 'allTransactions', 'Buy');
        const docSnap1 = await getDoc(docRef2);
        if (docSnap1.exists()) {
          await updateDoc(docRef2, {
            [orderId]: {
              walletAddress: walletAddress,
              totalAmount: total,
              email: user.email,
              status: 'success',
              cryptoTrasnfer: 'pending',
              time: paymentResponse.payment_completion_time,
              usdtValue: usdtValue,
              orderId: orderId,
            },
          });
        } else {
          await setDoc(docRef2, {
            [orderId]: {
              walletAddress: walletAddress,
              totalAmount: total,
              email: user.email,
              status: 'success',
              cryptoTrasnfer: 'pending',
              time: paymentResponse.payment_completion_time,
              usdtValue: usdtValue,
              orderId: orderId,
            },
          });
        }
      }
    };
    const goBackHome = () => {
      router.push('/classic');
    };
    useEffect(() => {
      if (paymentResponse !== 'paymentNotProcessed') setInDoc();
    }, [walletAddress, total, user.email, paymentResponse]);

    if (loading) return <>Verifying payment status...</>;
    if (paymentResponse == 'paymentNotProcessed')
      return (
        <>
          <b>Payment not yet processed</b>
          <br />
          <br />
          <Button onClick={goBackHome}>Back to Home</Button>
        </>
      );
    return (
      <>
        <div>
          Payment Status - <b> {paymentResponse.payment_status}</b>
        </div>
        <div>
          Bank Reference - <b> {paymentResponse.bank_reference}</b>
        </div>
        <div>
          CF Payment Id - <b> {paymentResponse.cf_payment_id}</b>
        </div>
        <div>
          Order Id - <b> {paymentResponse.order_id}</b>
        </div>
        <div>
          Amount -{' '}
          <b>
            {paymentResponse.payment_amount} {paymentResponse.payment_currency}
          </b>
        </div>
        {/* <div>Payment Completion Time- <b> {new Date(paymentResponse.payment_completion_time)}</b></div> */}
        <div>
          Payment Completion Time-{' '}
          <b>
            {' '}
            {dayjs('2024-04-13T16:13:00+05:30').format(
              'MMM D, YYYY - hh:mm:ss',
            )}
          </b>
        </div>
        <div>
          Payment Method - <b> {paymentResponse.payment_group}</b>
        </div>

        <br />
        <div>
          {usdtValue} USDT will be transfered to {walletAddress}
        </div>

        <br />
        <br />
        <Button onClick={goBackHome}>Back to Home</Button>
      </>
    );
  };
  return (
    <Suspense>
      <GetOrder />
    </Suspense>
  );
};
export default PaymentConfirmation;
