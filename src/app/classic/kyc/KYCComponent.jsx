'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';

const KYCComponent = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(4);
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panFullName, setPanFullName] = useState('');
  const [panDob, setPanDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    aadhar: '',
    pan: '',
    bankAccount: '',
    bankIfsc: '',
  });
  const [aadhaarData, setAadhaarData] = useState(null);
  const [panData, setPanData] = useState(null);
  const [showAadhaarDetails, setShowAadhaarDetails] = useState(false);
  const [showPanDetails, setShowPanDetails] = useState(false);
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfscCode, setBankIfscCode] = useState('');
  const [bankData, setBankData] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [bankStatement, setBankStatement] = useState(null);
  const [bankStatementError, setBankStatementError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletVideo, setWalletVideo] = useState(null);
  const [walletVideoError, setWalletVideoError] = useState('');
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [isDeclarationAccepted, setIsDeclarationAccepted] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [isKYCComplete, setIsKYCComplete] = useState(false);

  // Aadhar validation: 12 digits
  const validateAadhar = (value) => {
    if (!value) return 'Aadhar number is required';
    if (!/^\d{12}$/.test(value)) return 'Aadhar number must be 12 digits';
    return '';
  };

  // PAN validation: 5 letters, 4 numbers, 1 letter
  const validatePAN = (value) => {
    if (!value) return 'PAN number is required';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
      return 'PAN number must be in format: AAAAA9999A';
    return '';
  };

  // Add bank validation
  const validateBankAccount = (accountNumber) => {
    if (!accountNumber) return 'Bank account number is required';
    if (!/^\d{9,18}$/.test(accountNumber)) return 'Invalid bank account number';
    return '';
  };

  const validateIfscCode = (ifsc) => {
    if (!ifsc) return 'IFSC code is required';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return 'Invalid IFSC code';
    return '';
  };

  // Update validation errors when inputs change
  useEffect(() => {
    setValidationErrors({
      aadhar: validateAadhar(aadharNumber),
      pan: validatePAN(panNumber),
      bankAccount: validateBankAccount(bankAccountNumber),
      bankIfsc: validateIfscCode(bankIfscCode),
    });
  }, [aadharNumber, panNumber, bankAccountNumber, bankIfscCode]);

  const verifyAadhaar = async (aadhaarNumber) => {
    try {
      const response = await fetch('/api/verify-aadhaar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhaarNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Aadhaar verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      throw error;
    }
  };

  const checkAadhaarStatus = async (requestId) => {
    try {
      const response = await fetch(
        `/api/check-aadhaar-status?request_id=${requestId}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check Aadhaar status');
      }

      const data = await response.json();
      const result = data[0]; // Get the first item from the array

      if (
        result.status === 'completed' &&
        result.result?.source_output?.status === 'id_found'
      ) {
        return {
          success: true,
          data: {
            ageBand: result.result.source_output.age_band,
            gender: result.result.source_output.gender,
            mobileNumber: result.result.source_output.mobile_number,
            state: result.result.source_output.state,
            status: result.result.source_output.status,
          },
        };
      } else if (result.result?.source_output?.status === 'id_not_found') {
        throw new Error('Aadhaar number not found');
      } else if (result.result?.source_output?.status === 'source_down') {
        throw new Error(
          'Aadhaar verification service is currently unavailable',
        );
      } else {
        throw new Error('Aadhaar verification is still in progress');
      }
    } catch (error) {
      console.error('Aadhaar status check error:', error);
      throw error;
    }
  };

  const verifyPAN = async (panNumber, fullName, dob) => {
    try {
      const response = await fetch('/api/verify-pan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          panNumber,
          fullName,
          dob,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'PAN verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('PAN verification error:', error);
      throw error;
    }
  };

  const checkPANStatus = async (requestId) => {
    try {
      const response = await fetch(
        `/api/check-pan-status?request_id=${requestId}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check PAN status');
      }

      const data = await response.json();
      const result = data[0]; // Get the first item from the array

      if (
        result.status === 'completed' &&
        result.result?.source_output?.pan_status === 'valid'
      ) {
        return {
          success: true,
          data: {
            aadhaarSeedingStatus:
              result.result.source_output.aadhaar_seeeding_status,
            panStatus: result.result.source_output.pan_status,
            nameMatch: result.result.source_output.name_match,
            dobMatch: result.result.source_output.dob_match,
            inputDetails: result.result.input_details,
          },
        };
      } else if (result.result?.source_output?.pan_status === 'invalid') {
        throw new Error('PAN number is invalid');
      } else {
        throw new Error('PAN verification is still in progress');
      }
    } catch (error) {
      console.error('PAN status check error:', error);
      throw error;
    }
  };

  const verifyBankAccount = async (accountNumber, ifscCode) => {
    try {
      const response = await fetch('/api/verify-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankAccountNumber: accountNumber,
          bankIfscCode: ifscCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bank verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Bank verification error:', error);
      throw error;
    }
  };

  const checkBankStatus = async (requestId) => {
    try {
      const response = await fetch(
        `/api/check-bank-status?request_id=${requestId}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check bank status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Bank status check error:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const aadharError = validateAadhar(aadharNumber);
      if (aadharError) {
        setValidationErrors((prev) => ({ ...prev, aadhar: aadharError }));
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Verify Aadhaar first
        const aadhaarResponse = await verifyAadhaar(aadharNumber);

        if (!aadhaarResponse.request_id) {
          throw new Error('Aadhaar verification failed');
        }

        // Wait for 10 seconds before checking status
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Check Aadhaar verification status
        const statusResponse = await checkAadhaarStatus(
          aadhaarResponse.request_id,
        );

        if (!statusResponse.success) {
          throw new Error('Aadhaar verification failed');
        }

        // Store Aadhaar data for final submission
        setAadhaarData(statusResponse.data);
        setShowAadhaarDetails(true);
      } catch (err) {
        setError(err.message || 'Error verifying Aadhaar. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProceedToPAN = () => {
    setShowAadhaarDetails(false);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const panError = validatePAN(panNumber);
    if (panError) {
      setValidationErrors((prev) => ({ ...prev, pan: panError }));
      setLoading(false);
      return;
    }

    if (!panFullName) {
      setError('Full name is required for PAN verification');
      setLoading(false);
      return;
    }

    if (!panDob) {
      setError('Date of birth is required for PAN verification');
      setLoading(false);
      return;
    }

    try {
      // Verify PAN first
      const panResponse = await verifyPAN(panNumber, panFullName, panDob);

      // Add 5 second delay before showing results
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Store PAN data and proceed to next step
      setPanData({
        aadhaarSeedingStatus:
          panResponse?.result?.source_output?.aadhaar_seeeding_status ||
          'Not Available',
        panStatus:
          panResponse?.result?.source_output?.pan_status || 'Not Available',
        nameMatch:
          panResponse?.result?.source_output?.name_match || 'Not Available',
        dobMatch:
          panResponse?.result?.source_output?.dob_match || 'Not Available',
        inputDetails: panResponse?.result?.input_details || {},
      });
      setShowPanDetails(true);

      // Add delay before moving to next step
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep(3); // Move to bank verification step
      setShowPanDetails(false); // Hide PAN details when moving to next step
    } catch (err) {
      // Add 5 second delay even for error case
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Proceed to next step even if there's an error
      setPanData({
        aadhaarSeedingStatus: 'Not Available',
        panStatus: 'Not Available',
        nameMatch: 'Not Available',
        dobMatch: 'Not Available',
        inputDetails: {},
      });
      setShowPanDetails(true);

      // Add delay before moving to next step
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep(3); // Move to bank verification step
      setShowPanDetails(false); // Hide PAN details when moving to next step
    } finally {
      setLoading(false);
    }
  };

  const handleBankStatementChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.includes('pdf')) {
        setBankStatementError('Please upload a PDF file');
        setBankStatement(null);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setBankStatementError('File size should be less than 5MB');
        setBankStatement(null);
        return;
      }

      setBankStatementError('');
      setBankStatement(file);
    }
  };

  const handleBankVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const accountError = validateBankAccount(bankAccountNumber);
    const ifscError = validateIfscCode(bankIfscCode);

    if (accountError || ifscError) {
      setValidationErrors((prev) => ({
        ...prev,
        bankAccount: accountError,
        bankIfsc: ifscError,
      }));
      setLoading(false);
      return;
    }

    if (!bankStatement) {
      setBankStatementError('Please upload your bank statement');
      setLoading(false);
      return;
    }

    try {
      // Verify bank account first
      const bankResponse = await verifyBankAccount(
        bankAccountNumber,
        bankIfscCode,
      );

      // Add 5 second delay before showing results
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Store bank data and show details
      setBankData({
        accountNumber: bankAccountNumber,
        ifscCode: bankIfscCode,
        nameAtBank: 'Verified',
        accountExists: 'YES',
        amountDeposited: '1',
        status: 'id_found',
      });
      setShowBankDetails(true);

      // Add delay before moving to next step
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep(4); // Move to wallet verification step
      setShowBankDetails(false); // Hide bank details when moving to next step
    } catch (err) {
      // Proceed to next step even if there's an error
      setBankData({
        accountNumber: bankAccountNumber,
        ifscCode: bankIfscCode,
        nameAtBank: 'Verified',
        accountExists: 'YES',
        amountDeposited: '1',
        status: 'id_found',
      });
      setShowBankDetails(true);

      // Add delay before moving to next step
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep(4); // Move to wallet verification step
      setShowBankDetails(false); // Hide bank details when moving to next step
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteKYC = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhar: aadharNumber,
          pan: panNumber,
          aadhaar_data: aadhaarData,
          pan_data: panData,
          bank_data: bankData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/classic');
      } else {
        setError(data.message || 'KYC verification failed');
      }
    } catch (err) {
      setError(err.message || 'Error completing KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.includes('video')) {
        setWalletVideoError('Please upload a video file');
        setWalletVideo(null);
        return;
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setWalletVideoError('File size should be less than 50MB');
        setWalletVideo(null);
        return;
      }

      setWalletVideoError('');
      setWalletVideo(file);
    }
  };

  const handleWalletVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!walletAddress) {
      setError('Wallet address is required');
      setLoading(false);
      return;
    }

    if (!walletVideo) {
      setWalletVideoError('Please upload a video proof');
      setLoading(false);
      return;
    }

    try {
      // Add 5 second delay for verification
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Store wallet data and show details
      setShowWalletDetails(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error verifying wallet. Please try again.');
      setLoading(false);
    }
  };

  const handleProceedToDeclaration = () => {
    setShowWalletDetails(false);
    setShowDeclaration(true);
    setCurrentStep(5);
  };

  const handleDeclarationSubmit = (e) => {
    e.preventDefault();
    if (isDeclarationAccepted) {
      setIsKYCComplete(true);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/authentication');
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">KYC Verification</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            1
          </div>
          <div
            className={`ml-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Aadhaar
          </div>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div
            className={`h-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
          ></div>
        </div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            2
          </div>
          <div
            className={`ml-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            PAN
          </div>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div
            className={`h-full ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
          ></div>
        </div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            3
          </div>
          <div
            className={`ml-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Bank
          </div>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div
            className={`h-full ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}
          ></div>
        </div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 4
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            4
          </div>
          <div
            className={`ml-2 ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Wallet
          </div>
        </div>
        <div className="flex-1 h-1 mx-4 bg-gray-200">
          <div
            className={`h-full ${currentStep >= 5 ? 'bg-blue-600' : 'bg-gray-200'}`}
          ></div>
        </div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 5
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            5
          </div>
          <div
            className={`ml-2 ${currentStep >= 5 ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Declaration
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {showAadhaarDetails && aadhaarData ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Aadhaar Verification Details
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{aadhaarData.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile Number:</span>
              <span className="font-medium">{aadhaarData.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium">{aadhaarData.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Verified</span>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleProceedToPAN} className="w-full">
              Proceed to PAN Verification
            </Button>
          </div>
        </div>
      ) : showPanDetails && panData ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            PAN Verification Details
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">PAN Status:</span>
              <span className="font-medium text-green-600">Valid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Aadhaar Seeding Status:</span>
              <span className="font-medium">
                {panData.aadhaarSeedingStatus ? 'Linked' : 'Not Linked'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name Match:</span>
              <span className="font-medium">
                {panData.nameMatch ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DOB Match:</span>
              <span className="font-medium">
                {panData.dobMatch ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={() => setCurrentStep(3)} className="w-full">
              Proceed to Bank Verification
            </Button>
          </div>
        </div>
      ) : showBankDetails && bankData ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Bank Account Verification Details
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">{bankData.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IFSC Code:</span>
              <span className="font-medium">{bankData.ifscCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name at Bank:</span>
              <span className="font-medium">{bankData.nameAtBank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Exists:</span>
              <span className="font-medium">{bankData.accountExists}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Deposited:</span>
              <span className="font-medium">
                ₹{Number(bankData.amountDeposited) + 1}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Verified</span>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleCompleteKYC} className="w-full">
              Complete KYC
            </Button>
          </div>
        </div>
      ) : currentStep === 3 && !showBankDetails ? (
        <form onSubmit={handleBankVerification}>
          <div className="mb-6">
            <label className="block mb-2">Bank Account Number</label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 18);
                setBankAccountNumber(value);
              }}
              placeholder="Enter bank account number"
              className={`w-full p-2 border rounded ${
                validationErrors.bankAccount
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              maxLength={18}
              required
            />
            {validationErrors.bankAccount && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.bankAccount}
              </p>
            )}

            <div className="mt-4">
              <label className="block mb-2">IFSC Code</label>
              <input
                type="text"
                value={bankIfscCode}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .slice(0, 11);
                  setBankIfscCode(value);
                }}
                placeholder="Enter IFSC code"
                className={`w-full p-2 border rounded ${
                  validationErrors.bankIfsc
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                maxLength={11}
                required
              />
              {validationErrors.bankIfsc && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.bankIfsc}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block mb-2">
                6 Months Bank Statement (PDF)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleBankStatementChange}
                  className="hidden"
                  id="bankStatement"
                  required
                />
                <label
                  htmlFor="bankStatement"
                  className="flex-1 p-2 border rounded border-gray-300 cursor-pointer hover:bg-gray-50 text-center"
                >
                  {bankStatement ? bankStatement.name : 'Choose file'}
                </label>
                {bankStatement && (
                  <button
                    type="button"
                    onClick={() => setBankStatement(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              {bankStatementError && (
                <p className="text-red-500 text-sm mt-1">
                  {bankStatementError}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Upload your last 6 months bank statement (PDF, max 5MB)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1"
              variant="outline"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={
                !!validationErrors.bankAccount ||
                !!validationErrors.bankIfsc ||
                !bankStatement
              }
              className="flex-1"
            >
              Verify Bank Account
            </Button>
          </div>
        </form>
      ) : currentStep === 4 && !showWalletDetails ? (
        <form onSubmit={handleWalletVerification}>
          <div className="mb-6">
            <label className="block mb-2">Crypto Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your crypto wallet address"
              className="w-full p-2 border rounded border-gray-300"
              required
            />

            <div className="mt-4">
              <label className="block mb-2">
                Video Proof of Wallet Address
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleWalletVideoChange}
                  className="hidden"
                  id="walletVideo"
                  required
                />
                <label
                  htmlFor="walletVideo"
                  className="flex-1 p-2 border rounded border-gray-300 cursor-pointer hover:bg-gray-50 text-center"
                >
                  {walletVideo ? walletVideo.name : 'Choose video file'}
                </label>
                {walletVideo && (
                  <button
                    type="button"
                    onClick={() => setWalletVideo(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              {walletVideoError && (
                <p className="text-red-500 text-sm mt-1">{walletVideoError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Upload a video showing your wallet address (max 50MB)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex-1"
              variant="outline"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!walletAddress || !walletVideo}
              className="flex-1"
            >
              Verify Wallet
            </Button>
          </div>
        </form>
      ) : showWalletDetails ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Wallet Verification Details
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Wallet Address:</span>
              <span className="font-medium">{walletAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Verified</span>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleProceedToDeclaration} className="w-full">
              Proceed to Declaration
            </Button>
          </div>
        </div>
      ) : isKYCComplete ? (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              KYC Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              We will review your application and send you an email within 2
              business days with the verification results.
            </p>
            <Button onClick={handleLoginRedirect} className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      ) : showDeclaration ? (
        <form onSubmit={handleDeclarationSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Self Declaration</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <p className="text-gray-700">I hereby declare that:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  All the information provided in this KYC form is true and
                  correct to the best of my knowledge.
                </li>
                <li>
                  The Aadhaar, PAN, Bank Account, and Crypto Wallet details
                  belong to me.
                </li>
                <li>
                  I am the rightful owner of all the accounts and documents
                  submitted.
                </li>
                <li>
                  I understand that providing false information may lead to
                  legal consequences.
                </li>
              </ul>
              <div className="flex items-start mt-4">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isDeclarationAccepted}
                  onChange={(e) => setIsDeclarationAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600"
                  required
                />
                <label htmlFor="declaration" className="ml-2 text-gray-700">
                  I accept the above declaration
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => {
                setShowDeclaration(false);
                setShowWalletDetails(true);
                setCurrentStep(4);
              }}
              className="flex-1"
              variant="outline"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isDeclarationAccepted}
              className="flex-1"
            >
              Complete KYC
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            <div className="mb-4">
              <label className="block mb-2">Aadhar Number</label>
              <input
                type="text"
                value={aadharNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                  setAadharNumber(value);
                }}
                placeholder="Enter 12-digit Aadhar number"
                className={`w-full p-2 border rounded ${
                  validationErrors.aadhar ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={12}
                required
              />
              {validationErrors.aadhar && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.aadhar}
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block mb-2">PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .slice(0, 10);
                  setPanNumber(value);
                }}
                placeholder="Enter 10-digit PAN number"
                className={`w-full p-2 border rounded ${
                  validationErrors.pan ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={10}
                required
              />
              {validationErrors.pan && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.pan}
                </p>
              )}

              <div className="mt-4">
                <label className="block mb-2">Full Name (as per PAN)</label>
                <input
                  type="text"
                  value={panFullName}
                  onChange={(e) => setPanFullName(e.target.value)}
                  placeholder="Enter full name as per PAN"
                  className="w-full p-2 border rounded border-gray-300"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={panDob}
                  onChange={(e) => setPanDob(e.target.value)}
                  className="w-full p-2 border rounded border-gray-300"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {currentStep === 2 && (
              <Button
                type="button"
                onClick={handleBack}
                className="flex-1"
                variant="outline"
              >
                Back
              </Button>
            )}
            {currentStep === 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!!validationErrors.aadhar}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!!validationErrors.pan}
                className="flex-1"
              >
                Verify PAN
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default KYCComponent;
