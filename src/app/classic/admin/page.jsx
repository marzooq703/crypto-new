'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Swal from 'sweetalert2';

const Admin = () => {
  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const buy = localStorage.getItem('buy');
      const sell = localStorage.getItem('sell');
      setBuy(Number(buy));
      setSell(Number(sell));
    }
  }, []);
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
        onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('buy', buy);
          }
          Swal.fire({
            icon: 'success',
            title: 'Buy price updated',
          });
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
        onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('sell', sell);
          }
          Swal.fire({
            icon: 'success',
            title: 'Sell price updated',
          });
        }}
      >
        Update
      </Button>
    </>
  );
};

export default Admin;
