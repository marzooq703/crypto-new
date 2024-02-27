'use client';
import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { onSnapshot, collection } from 'firebase/firestore';

const AdminPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [sellTransactions, setSellTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyClicked, setBuyClicked] = useState(false);
  const [sellClicked, setSellClicked] = useState(false);

  const handleBuyClick = () => {
    setBuyClicked(true);
    setSellClicked(false);
  };

  const handleSellClick = () => {
    setSellClicked(true);
    setBuyClicked(false);
  };

  useEffect(() => {
    const unsubscribeTransactions = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        const updatedTransactions = snapshot.docs.map((doc) => doc.data());
        setTransactions(updatedTransactions);
      },
      (error) => {
        console.error('Error fetching transactions:', error);
        setError(error);
      },
    );

    const unsubscribeSellTransactions = onSnapshot(
      collection(db, 'sellTransactions'),
      (snapshot) => {
        const updatedSellTransactions = snapshot.docs.map((doc) => doc.data());
        setSellTransactions(updatedSellTransactions);
      },
      (error) => {
        console.error('Error fetching sell transactions:', error);
        setError(error);
      },
    );

    setLoading(false);

    return () => {
      unsubscribeTransactions();
      unsubscribeSellTransactions();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-4">Admin Page</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            buyClicked ? 'bg-blue-700' : ''
          }`}
          onClick={handleBuyClick}
        >
          Buy
        </button>
        <button
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
            sellClicked ? 'bg-green-700' : ''
          }`}
          onClick={handleSellClick}
        >
          Sell
        </button>
      </div>
      <div className="flex items-center justify-center">
        {buyClicked && (
          <div className="mt-4 p-4 bg-blue-100 rounded-lg w-full">
            <h2 className="text-xl font-semibold mb-2">Buy Content</h2>
            <p className="text-gray-800">List of BuyCrypto</p>
          </div>
        )}
        {sellClicked && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg w-full">
            <h2 className="text-xl font-semibold mb-2">Sell Content</h2>
            <p className="text-gray-800">List of Sell Crypto</p>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-semibold mt-8 mb-4">Transaction Data</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Currency</th>
              <th className="border border-gray-400 px-4 py-2">Amount (INR)</th>
              <th className="border border-gray-400 px-4 py-2">
                Equivalent USDT
              </th>
            </tr>
          </thead>
          <tbody>
            {buyClicked &&
              transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="border border-gray-400 px-4 py-2">
                    {transaction.currency}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {transaction.amount}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {transaction.equivalentUSDT}
                  </td>
                </tr>
              ))}
            {sellClicked &&
              sellTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="border border-gray-400 px-4 py-2">
                    {transaction.currency}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {transaction.amount}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {transaction.equivalentUSDT}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
