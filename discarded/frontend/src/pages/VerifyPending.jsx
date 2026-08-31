import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function VerifyPending() {
  const { user } = useAuth();

  const handleResendOtp = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/auth/resend-otp`,
        { 
          email: user.email,
          userType: user.userType 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      alert('OTP code resent!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to resend OTP code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          We've sent an OTP code to <strong>{user?.email}</strong>.
          Please check your inbox and enter the OTP code to verify your email.
        </p>
        <button
          onClick={handleResendOtp}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Resend OTP Code
        </button>
      </div>
    </div>
  );
}