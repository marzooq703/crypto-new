import TransactionTable from '@/components/transaction/transaction-buy';
import Button from '@/components/ui/button';
const Transaction = () => {
  return (
    <div className="w-full">
      <Button shape="pill">Buy</Button>
      <Button shape="pill">Sell</Button>
      <TransactionTable />
    </div>
  );
};
export default Transaction;
