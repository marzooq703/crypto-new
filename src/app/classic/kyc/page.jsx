import Button from '@/components/ui/button';
const KYC = () => {
  return (
    <>
      <b>KYC</b>
      <div>
        Please send your orginal Aadhar card and Pan card details to
        onboard@stablecrypto.in and verify your account
      </div>{' '}
      <Button
        onClick={() => {
          router.push('/classic');
        }}
      >
        Back to Home
      </Button>
    </>
  );
};
export default KYC;
