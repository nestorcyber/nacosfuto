import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const usePasswordValidator = (password) => {
  const [passwordValidations, setPasswordValidations] = useState({
    hasMinLength: false,
    hasMaxLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Special characters regex: !@#$%^&*()_+-=[]{};':"\|,.<>/?
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  const validatePassword = () => {
    const validations = {
      hasMinLength: password.length >= 8,
      hasMaxLength: password.length <= 16,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: specialCharRegex.test(password)
    };
    setPasswordValidations(validations);
  };

  useEffect(() => {
    validatePassword();
  }, [password]);

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const PasswordRequirements = () => (
    <div className={`mt-2 space-y-1 text-sm transition-all duration-300 ${password ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} text-gray-600 dark:text-gray-300`}>
      <div className={`flex items-center ${password ? 'visible' : 'invisible'}`}>
        <span className="mr-2">
          {passwordValidations.hasMinLength ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
        8-16 characters
      </div>

      <div className={`flex items-center ${password ? 'visible' : 'invisible'}`}>
        <span className="mr-2">
          {passwordValidations.hasUppercase ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
        At least one uppercase letter (A-Z)
      </div>

      <div className={`flex items-center ${password ? 'visible' : 'invisible'}`}>
        <span className="mr-2">
          {passwordValidations.hasNumber ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
        At least one number (0-9)
      </div>

      <div className={`flex items-center ${password ? 'visible' : 'invisible'}`}>
        <span className="mr-2">
          {passwordValidations.hasSpecialChar ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
        At least one special character (!@#$%^&* etc.)
      </div>
    </div>
  );

  return { 
    passwordValidations, 
    PasswordRequirements, 
    isPasswordValid 
  };
};