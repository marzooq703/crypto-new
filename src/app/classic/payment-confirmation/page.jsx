import {  useSearchParams } from 'next/navigation';
const PaymentConfirmation = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderid');
    return (
        <>
        <div>Payment Confirmation</div> - {orderId}
        </>
    )
}