const SellPayment = () => {
  return (
    <>
      <div className="max-w-screen-xl mx-auto mt-8 space-y-8">
        {/* Confirm Information Box */}
        <div className="border rounded p-6 bg-white shadow-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Confirm Information
          </h2>

          <p className="text-sm text-center mb-6 text-gray-600">
            You are about to receive{' '}
            <strong className="text-green-500">100 </strong>rupees for{' '}
            <strong className="text-blue-500">1.5 Eth </strong> in wallet.
          </p>

          <div className="flex justify-between border rounded p-4 bg-gray-100">
            <div style={{ textAlign: 'center' }}>
              <p className="text-sm mb-2 text-gray-600">To sell</p>
              <strong className="text-red-500">1.5 </strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-sm mb-2 text-gray-600">You get</p>
              <strong className="text-green-500">100</strong>
            </div>
          </div>
        </div>

        {/* Payment Details Box */}
        <div className="border rounded p-6 bg-white shadow-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Crediting Account Details
          </h2>

          <div className="space-y-4">
            {/* Account Holder Name */}
            <div>
              <label
                htmlFor="accountHolderName"
                className="block text-md font-medium text-gray-600"
              >
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountHolderName"
                className="form-input w-full border rounded-md"
                placeholder="Enter account holder name"
              />
            </div>

            {/* Account Number */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-md font-medium text-gray-600"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                className="form-input w-full border rounded-md"
                placeholder="Enter account number"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label
                htmlFor="ifscCode"
                className="block text-md font-medium text-gray-600"
              >
                IFSC Code
              </label>
              <input
                type="text"
                id="ifscCode"
                className="form-input w-full border rounded-md"
                placeholder="Enter IFSC code"
              />
            </div>

            {/* Account Type */}
            <div>
              <label
                htmlFor="accountType"
                className="block text-md font-medium text-gray-600"
              >
                Account Type (Savings or Current)
              </label>
              <input
                type="text"
                id="accountType"
                className="form-input w-full border rounded-md"
                placeholder="Enter account type"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-md font-medium text-gray-600"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                className="form-input w-full border rounded-md"
                placeholder="Enter bank name"
              />
            </div>

            {/* Branch Name */}
            <div>
              <label
                htmlFor="branchName"
                className="block text-md font-medium text-gray-600"
              >
                Account Opening Branch
              </label>
              <input
                type="text"
                id="branchName"
                className="form-input w-full border rounded-md"
                placeholder="Enter branch name"
              />
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-8 w-full"
            //   onClick={handlePayButtonClick}
          >
            Sell
          </button>
        </div>
      </div>
    </>
  );
};

export default SellPayment;
