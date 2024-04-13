'use client';
import {useState} from 'react';
import TransactionTable from '@/components/transaction/transaction-buy';
import TransactionTableSell from '@/components/transaction/transaction-sell';
import Button from '@/components/ui/button';
const Transaction = () => {
  const [status, setStatus] = useState("buy");
   return (
    <div className="w-full">
      <Button variant={status == 'buy' ? "ghost" : "transparent"} onClick={() => setStatus('buy')}>Buy</Button>
      <Button variant={status == 'sell' ? "ghost" : "transparent"} onClick={() => setStatus('sell')}> Sell</Button>
      {status == 'buy' ? <TransactionTable /> : <TransactionTableSell />}
    </div>
  );
};
export default Transaction;
