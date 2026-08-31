import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { email: locationEmail, userType: locationUserType } = location.state || {};

  useEffect(() => {
    if (!locationEmail) {
      setStatus('error');
      setErrorMessage('Session expired. Please start registration again.');
    }
  }, [locationEmail]);


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setStatus('error');
      setErrorMessage('Please enter a valid 6-digit OTP code');
      return;
    }
  
    setStatus('verifying');
    
    try {
      const response = await axios.post(
        '/auth/verify-otp',
        {
          otp,
          email: locationEmail,
          userType: locationUserType || 'student'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          validateStatus: (status) => status < 500
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.error || 'Verification failed');
      }
  
      setStatus('success');
      setTimeout(() => {
        navigate(response.data.redirectTo || (
          locationUserType === 'staff' ? '/staff-dashboard' : '/welcome'
        ));
      }, 2000);
  
    } catch (error) {
      setStatus('error');
      
      let errorMessage = 'Verification failed. Please try again.';
      if (error.response) {
        // Handle specific database errors
        if (error.response.data.error?.includes('Database configuration error')) {
          errorMessage = 'System error. Please contact support.';
        } else {
          errorMessage = error.response.data.error || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      setErrorMessage(errorMessage);
      console.error('Verification error:', {
        error: error.response?.data || error.message,
        request: { email: locationEmail, userType: locationUserType }
      });
    }
  };

  const handleResendOtp = async () => {
  try {
    setStatus('verifying');
    
    const response = await axios.post(
      '/auth/resend-otp',
      {
        email: locationEmail,
        userType: locationUserType
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to resend OTP');
    }

    setStatus('idle');
    setErrorMessage('');
    alert('New OTP sent successfully!');
    
  } catch (error) {
    setStatus('error');
    
    let errorMessage = 'Failed to resend OTP. Please try again.';
    if (error.response) {
      errorMessage = error.response.data.error || errorMessage;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    setErrorMessage(errorMessage);
    console.error('Resend OTP error:', {
      error: error.response?.data || error.message,
      request: { email: locationEmail, userType: locationUserType }
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === 'idle' || status === 'verifying' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
            <p className="mb-4">
              We've sent a 6-digit OTP code to <strong>{locationEmail}</strong>.
              Please check your inbox and enter it below.
            </p>
            
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full p-3 mb-4 border border-gray-300 rounded text-center text-xl"
                disabled={status === 'verifying'}
                required
              />
              
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition ${
                  status === 'verifying'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={status === 'verifying'}
              >
                {status === 'verifying' ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <button
              onClick={handleResendOtp}
              className="mt-4 text-green-600 hover:underline text-sm"
              disabled={status === 'verifying'}
            >
              Didn't receive code? Resend OTP
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-xl font-semibold mt-4">Verification Successful!</h2>
            <p className="mt-2">Redirecting you to your dashboard...</p>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="text-xl font-semibold mt-4">Verification Failed</h2>
            <p className="mt-2 text-red-600">{errorMessage}</p>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back to Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}