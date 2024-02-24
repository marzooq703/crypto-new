'use client';
import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase'; // Import your Firebase configuration

// Define your AdminPage component
const AdminPage = () => {
  // Define state variables to store transaction data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [buyClicked, setBuyClicked] = useState(false);
  const [sellClicked, setSellClicked] = useState(false);

  const handleBuyClick = () => {
    setBuyClicked(true);
    setSellClicked(false);
  };

  // Function to handle the sell button click
  const handleSellClick = () => {
    setSellClicked(true);
    setBuyClicked(false);
  };
  //   useEffect(() => {
  //     const fetchTransactions = async () => {
  //       try {
  //         const transactionData = [];
  //         const querySnapshot = await db.collection('transactions').get();
  //         querySnapshot.forEach((doc) => {
  //           transactionData.push({ id: doc.id, ...doc.data() });
  //         });
  //         setTransactions(transactionData);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error('Error fetching transactions:', error);
  //         setError(error);
  //         setLoading(false);
  //       }
  //     };

  //     // Invoke fetchTransactions function
  //     fetchTransactions();
  //   }, []);

  //   // Render loading state if data is loading
  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (error) {
  //     return <div>Error: {error.message}</div>;
  //   }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-4">Admin Page</h1>
      <div className="space-x-4">
        {/* Apply Tailwind CSS classes to the buttons */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBuyClick}
        >
          Buy
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSellClick}
        >
          Sell
        </button>
      </div>
      {/* Render content based on button clicks */}
      {buyClicked && <div className="mt-4">Buy content goes here</div>}
      {sellClicked && <div className="mt-4">Sell content goes here</div>}
      {/* <h1>Transaction Data</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Currency</th>
            <th>Amount (INR)</th>
            <th>Equivalent USDT</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.currency}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.equivalentUSDT}</td>
              <td>{transaction.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default AdminPage;
