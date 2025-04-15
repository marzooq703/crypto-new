'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';

const KYC = () => {
  const router = useRouter();
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    aadhar: '',
    pan: '',
  });

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

  // Update validation errors when inputs change
  useEffect(() => {
    setValidationErrors({
      aadhar: validateAadhar(aadharNumber),
      pan: validatePAN(panNumber),
    });
  }, [aadharNumber, panNumber]);

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

      if (
        data.status === 'completed' &&
        data.result?.source_output?.status === 'Id_found'
      ) {
        return {
          success: true,
          data: data.result.source_output,
        };
      } else if (data.result?.source_output?.status === 'id_not_found') {
        throw new Error('Aadhaar number not found');
      } else if (data.result?.source_output?.status === 'source_down') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for validation errors
    const aadharError = validateAadhar(aadharNumber);
    const panError = validatePAN(panNumber);

    if (aadharError || panError) {
      setValidationErrors({
        aadhar: aadharError,
        pan: panError,
      });
      setLoading(false);
      return;
    }

    try {
      // Verify Aadhaar first
      const aadhaarResponse = await verifyAadhaar(aadharNumber);

      if (!aadhaarResponse.request_id) {
        throw new Error('Aadhaar verification failed');
      }

      // Check Aadhaar verification status
      const statusResponse = await checkAadhaarStatus(
        aadhaarResponse.request_id,
      );

      if (!statusResponse.success) {
        throw new Error('Aadhaar verification failed');
      }

      // If Aadhaar verification is successful, proceed with PAN verification
      const response = await fetch('/api/verify-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhar: aadharNumber,
          pan: panNumber,
          aadhaar_data: statusResponse.data,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/classic');
      } else {
        setError(data.message || 'KYC verification failed');
      }
    } catch (err) {
      setError(err.message || 'Error verifying KYC. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">KYC Verification</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
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
            <p className="text-red-500 text-sm mt-1">{validationErrors.pan}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={
              loading || validationErrors.aadhar || validationErrors.pan
            }
            className="flex-1"
          >
            {loading ? 'Verifying...' : 'Verify KYC'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default KYC;
