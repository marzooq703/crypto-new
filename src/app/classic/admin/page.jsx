'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Swal from 'sweetalert2';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);

  const getServerData = async () => {
    const buyRef = doc(db, 'currentPricing', 'Buy');
    const buyDoc = await getDoc(buyRef);

    if (buyDoc.exists()) {
      const buy = buyDoc.data();
      console.log('Document data:', buy);
      setBuy(buy.current);
    } else {
      console.log('No such document!');
    }

    const sellRef = doc(db, 'currentPricing', 'Sell');
    const sellDoc = await getDoc(sellRef);

    if (sellDoc.exists()) {
      const sell = sellDoc.data();
      console.log('Document data:', sell);
      setSell(sell.current);
    } else {
      console.log('No such document!');
    }
    setLoading(false);
  };
  useEffect(() => {
    getServerData();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <h1>Update Buy </h1>
      <input
        className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
        type="number"
        value={buy}
        onChange={(e) => {
          setBuy(parseInt(e.target.value));
        }}
        min="0"
        max="100"
      />
      <Button
        shape="rounded"
        className="ml-3"
        onClick={async () => {
          // if (typeof window !== 'undefined') {
          //   localStorage.setItem('buy', buy);
          // }
          await updateDoc(doc(db, 'currentPricing', 'Buy'), {
            current: buy,
          })
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Buy price updated',
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error updating Buy price',
                text: err.message,
              });
            });
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Buy price updated',
          // });
        }}
      >
        Update
      </Button>
      <h1>Update Sell </h1>
      <input
        className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
        type="number"
        value={sell}
        onChange={(e) => setSell(parseInt(e.target.value))}
        min="0"
        max="100"
      />
      <Button
        shape="rounded"
        className="ml-3"
        onClick={async () => {
          // if (typeof window !== 'undefined') {
          //   localStorage.setItem('sell', sell);
          // }
          try {
            await updateDoc(doc(db, 'currentPricing', 'Sell'), {
              current: sell,
            });
            Swal.fire({
              icon: 'success',
              title: 'Sell price updated',
            });
          } catch (e) {
            Swal.fire({
              icon: 'error',
              title: 'Error updating Sell price',
              text: e.message,
            });
          }
        }}
      >
        Update
      </Button>
    </>
  );
};

export default Admin;
