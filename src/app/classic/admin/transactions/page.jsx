'use client';
import {useState, useEffect} from 'react';
import TransactionTable from '@/components/transaction/transaction-buy';
import TransactionTableSell from '@/components/transaction/transaction-sell';
import Button from '@/components/ui/button';
import { db } from '../../../../lib/firebase';
// @ts-ignore
import {doc, onSnapshot} from 'firebase/firestore';

const Transaction = () => {
  const [status, setStatus] = useState("buy");
  const [buyData, setBuyData] = useState([]);
useEffect(() => {
  const unsub = onSnapshot(doc(db, 'allTransactions', 'Buy'), (doc) => {
    const data = doc.data();
    console.log('Buy data: ', data);
    setBuyData(Object.values(data))
  //   setUsdtInrPrice(Number(sell));
  });
}, []);
console.log(buyData)
if(buyData.length == 0) return (
  <div className="w-full">Loading...</div>
)
   return (
    <div className="w-full">
      <Button variant={status == 'buy' ? "ghost" : "transparent"} onClick={() => setStatus('buy')}>Buy</Button>
      <Button variant={status == 'sell' ? "ghost" : "transparent"} onClick={() => setStatus('sell')}> Sell</Button>
      {status == 'buy' ? <TransactionTable serverData={buyData} /> : <TransactionTableSell serverData={buyData} />}
    </div>
  );
};
export default Transaction;
