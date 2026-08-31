import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePasswordValidator } from '../../utils/passwordValidator';
import axios from 'axios';
import SignupField from './SignupField';
import PasswordInput from './PasswordInput';
import ScrollToTopLink from '../ScrollToTopLink';

export default function SignupForm() {
  const location = useLocation();
  const [userType, setUserType] = useState(location.state?.userType || 'student');
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  // Student form data
  const [studentForm, setStudentForm] = useState({
    reg_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    level: 100
  });

  // Staff form data
  const [staffForm, setStaffForm] = useState({
    staff_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    is_course_rep: false,
    reg_number: '',
    level: null
  });

  const [validation, setValidation] = useState({
    isValid: false,
    error: null,
    isChecking: false,
    isSubmitting: false,
    isPasswordValid: false,
    details: null
  });

  const navigate = useNavigate();

  const validateRegNumber = (reg) => {
    return /^\d{11}$/.test(reg);
  };

  const validateLevel = (level) => {
    return [100, 200, 300, 400, 500].includes(Number(level));
  };

  const validateStaffId = (id) => {
    return /^[A-Z0-9]{6,20}$/.test(id);
  };

  const validateRequiredFields = () => {
    if (userType === 'student') {
      return (
        studentForm.reg_number.trim() &&
        studentForm.first_name.trim() &&
        studentForm.last_name.trim() &&
        studentForm.email.trim() &&
        studentForm.password.trim()
      );
    } else {
      const baseFields = (
        staffForm.staff_id.trim() &&
        staffForm.first_name.trim() &&
        staffForm.last_name.trim() &&
        staffForm.email.trim() &&
        staffForm.password.trim()
      );
      
      // Add course rep specific requirements
      if (staffForm.is_course_rep) {
        return baseFields && staffForm.reg_number.trim() && staffForm.level;
      }
      return baseFields;
    }
  };

  const validateStudentForm = () => {
    return validateRegNumber(studentForm.reg_number) && 
           validateLevel(studentForm.level);
  };

  const validateStaffForm = () => {
    const staffIdValid = validateStaffId(staffForm.staff_id);
    
    // Course rep must have valid reg number and level
    if (staffForm.is_course_rep) {
      return staffIdValid && 
             validateRegNumber(staffForm.reg_number) && 
             validateLevel(staffForm.level);
    }
    
    return staffIdValid;
  };

  const isFormValid = 
    validation.isValid && 
    validation.isPasswordValid && 
    !validation.isSubmitting &&
    validateRequiredFields() &&
    (userType === 'student' ? validateStudentForm() : validateStaffForm());

  useEffect(() => {
    const validateUser = async () => {
      if (!validateRequiredFields()) {
        setValidation(prev => ({
          ...prev,
          isValid: false,
          error: 'Please fill all required fields'
        }));
        return;
      }

      if (userType === 'student') {
        if (!validateStudentForm()) {
          setValidation(prev => ({
            ...prev,
            isValid: false,
            error: !validateRegNumber(studentForm.reg_number) 
              ? 'Registration number must be exactly 11 digits (numbers only)' 
              : 'Please select a valid level (100-500)'
          }));
          return;
        }
      } else {
        if (!validateStaffForm()) {
          let error = '';
          if (!validateStaffId(staffForm.staff_id)) {
            error = 'Staff ID must be 6-20 alphanumeric characters';
          } else if (staffForm.is_course_rep) {
            if (!staffForm.reg_number) {
              error = 'Registration number is required for course reps';
            } else if (!validateRegNumber(staffForm.reg_number)) {
              error = 'Registration number must be exactly 11 digits (numbers only)';
            } else if (!staffForm.level) {
              error = 'Academic level is required for course reps';
            } else if (!validateLevel(staffForm.level)) {
              error = 'Please select a valid academic level (100-500)';
            }
          }
          
          setValidation(prev => ({
            ...prev,
            isValid: false,
            error: error || 'Invalid staff information'
          }));
          return;
        }
      }

      setValidation(prev => ({ ...prev, isChecking: true }));
    
      try {
        const endpoint = userType === 'student' 
          ? '/auth/validate'
          : '/auth/validate-staff';
  
        const payload = userType === 'student' ? {
          reg_number: studentForm.reg_number,
          email: studentForm.email.toLowerCase().trim(),
          first_name: studentForm.first_name.trim(),
          middle_name: studentForm.middle_name.trim(),
          last_name: studentForm.last_name.trim(),
          level: studentForm.level
        } : {
          staff_id: staffForm.staff_id,
          email: staffForm.email.toLowerCase().trim(),
          first_name: staffForm.first_name.trim(),
          middle_name: staffForm.middle_name.trim(),
          last_name: staffForm.last_name.trim(),
          is_course_rep: staffForm.is_course_rep,
          reg_number: staffForm.reg_number.trim() || null,
          level: staffForm.level || null
        };

        const { data } = await axios.post(endpoint, payload);

        setValidation(prev => ({
          ...prev,
          ...data,
          isChecking: false
        }));
      } catch (error) {
        setValidation(prev => ({
          ...prev,
          isValid: false,
          error: error.response?.data?.error || 'Verification service down',
          details: error.response?.data?.details || null,
          isChecking: false
        }));
      }
    };

    const debounceTimer = setTimeout(validateUser, 500);
    return () => clearTimeout(debounceTimer);
  }, [userType === 'student' ? studentForm : staffForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidationErrors(true);
    
    if (!isFormValid) {
      setValidation(prev => ({
        ...prev,
        error: "Please fix all validation errors before submitting",
        isSubmitting: false
      }));
      return;
    }

    setValidation(prev => ({ ...prev, isSubmitting: true }));
    console.log('[SIGNUP] Starting registration request...');
    const startTime = Date.now();

    try {
      const endpoint = userType === 'student' 
        ? '/auth/register'
        : '/auth/register-staff';
  
      const submissionData = userType === 'student' ? {
        reg_number: studentForm.reg_number,
        official_email: studentForm.email.toLowerCase().trim(), 
        password: studentForm.password,
        first_name: studentForm.first_name.trim(),
        middle_name: studentForm.middle_name.trim() || null,
        last_name: studentForm.last_name.trim(),
        level: studentForm.level
      } : {
        staff_id: staffForm.staff_id,
        email: staffForm.email.toLowerCase().trim(),
        password: staffForm.password,
        first_name: staffForm.first_name.trim(),
        middle_name: staffForm.middle_name.trim() || null,
        last_name: staffForm.last_name.trim(),
        is_course_rep: staffForm.is_course_rep,
        reg_number: staffForm.reg_number.trim() || null,
        level: staffForm.level || null
      };
  
      const response = await axios.post(endpoint, submissionData);
      console.log(`[SIGNUP] Registration successful after ${Date.now() - startTime}ms`);
  
      navigate('/verify-otp', { 
        state: { 
          email: userType === 'student' 
            ? studentForm.email.toLowerCase().trim()
            : staffForm.email.toLowerCase().trim(),
          userType 
        } 
      });
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setValidation(prev => ({
        ...prev,
        isValid: false,
        error: error.response?.data?.error || 'Registration failed',
        isSubmitting: false
      }));
    }
  };

  const { PasswordRequirements, isPasswordValid } = usePasswordValidator(
    userType === 'student' ? studentForm.password : staffForm.password
  );

  useEffect(() => {
    setValidation(prev => ({ ...prev, isPasswordValid }));
  }, [isPasswordValid]);

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'reg_number') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 11);
      setStudentForm(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    if (name === 'level') {
      const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 100;
      const clampedValue = Math.max(100, Math.min(500, numericValue));
      setStudentForm(prev => ({
        ...prev,
        [name]: clampedValue
      }));
      return;
    }

    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStaffChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setStaffForm(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    if (name === 'reg_number') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 11);
      setStaffForm(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    if (name === 'level') {
      const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 100;
      const clampedValue = Math.max(100, Math.min(500, numericValue));
      setStaffForm(prev => ({
        ...prev,
        [name]: clampedValue
      }));
      return;
    }

    setStaffForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Welcome to FUTO Computer Science
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Official {userType === 'student' ? 'Student' : 'Staff'} Registration Portal
        </p>

        <div className="flex justify-center mt-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                userType === 'student' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType('staff')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                userType === 'staff' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Staff
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {userType === 'student' ? (
          <>
            <SignupField
              label="Registration Number *"
              name="reg_number"
              value={studentForm.reg_number}
              onChange={handleStudentChange}
              error={studentForm.reg_number && !validateRegNumber(studentForm.reg_number) ? 
                    "Must be exactly 11 digits (numbers only)" : null}
              placeholder="e.g., 20231112345"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <SignupField
                label="First Name *"
                name="first_name"
                value={studentForm.first_name}
                onChange={handleStudentChange}
                transform="capitalize"
                required
              />

              <SignupField
                label="Last Name *"
                name="last_name"
                value={studentForm.last_name}
                onChange={handleStudentChange}
                transform="capitalize"
                required
              />
            </div>

            <SignupField
              label="Middle Name"
              name="middle_name"
              value={studentForm.middle_name}
              onChange={handleStudentChange}
              transform="capitalize"
              placeholder="Enter if you have a middle name"
            />

            <SignupField
              label="University Email *"
              name="email"
              type="email"
              value={studentForm.email}
              onChange={handleStudentChange}
              pattern=".+@gmail\.com"
              title="Must be @futo.edu.ng email"
              required
            />

            <SignupField
              label="Academic Level *"
              name="level"
              value={studentForm.level}
              onChange={handleStudentChange}
              isSelect
              options={[ 
                { value: 100, label: '100 Level' }, 
                { value: 200, label: '200 Level' }, 
                { value: 300, label: '300 Level' }, 
                { value: 400, label: '400 Level' }, 
                { value: 500, label: '500 Level' }
              ]}
              required
            />
          </>
        ) : (
          <>
            <SignupField
              label="Staff ID *"
              name="staff_id"
              value={staffForm.staff_id}
              onChange={handleStaffChange}
              error={staffForm.staff_id && !validateStaffId(staffForm.staff_id) ? 
                    "Must be 6-20 alphanumeric characters" : null}
              placeholder="e.g., STAFF12345"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <SignupField
                label="First Name *"
                name="first_name"
                value={staffForm.first_name}
                onChange={handleStaffChange}
                error={showValidationErrors && !staffForm.first_name.trim() ? 
                  "First name is required" : null}
                transform="capitalize"
                required
              />

              <SignupField
                label="Last Name *"
                name="last_name"
                value={staffForm.last_name}
                onChange={handleStaffChange}
                error={showValidationErrors && !staffForm.last_name.trim() ? 
                  "Last name is required" : null}
                transform="capitalize"
                required
              />
            </div>

            <SignupField
              label="Middle Name"
              name="middle_name"
              value={staffForm.middle_name}
              onChange={handleStaffChange}
              transform="capitalize"
              placeholder="Enter if you have a middle name"
            />

            <SignupField
              label="University Email *"
              name="email"
              type="email"
              value={staffForm.email}
              onChange={handleStaffChange}
              pattern=".+@gmail\.com"
              title="Must be @futo.edu.ng email"
              required
            />

            <div className="flex items-center">
              <input
                id="is-course-rep"
                name="is_course_rep"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                checked={staffForm.is_course_rep}
                onChange={handleStaffChange}
              />
              <label htmlFor="is-course-rep" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I'm a Course Representative
              </label>
            </div>

            {staffForm.is_course_rep && (
              <>
                <SignupField
                  label="Registration Number *"
                  name="reg_number"
                  value={staffForm.reg_number}
                  onChange={handleStaffChange}
                  error={(!staffForm.reg_number || !validateRegNumber(staffForm.reg_number)) ? 
                        "Must be exactly 11 digits (numbers only)" : null}
                  placeholder="Your student reg number"
                  required
                />

                <SignupField
                  label="Academic Level *"
                  name="level"
                  value={staffForm.level}
                  onChange={handleStaffChange}
                  isSelect
                  error={!staffForm.level ? "Level is required" : null}
                  options={[ 
                    { value: 100, label: '100 Level' }, 
                    { value: 200, label: '200 Level' }, 
                    { value: 300, label: '300 Level' }, 
                    { value: 400, label: '400 Level' }, 
                    { value: 500, label: '500 Level' }
                  ]}
                  required
                />
              </>
            )}
          </>
        )}

        <div className="space-y-2">
          <PasswordInput
            label="Password *"
            name="password"
            value={userType === 'student' ? studentForm.password : staffForm.password}
            onChange={userType === 'student' ? handleStudentChange : handleStaffChange}
            required
          />
          <PasswordRequirements />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || validation.isSubmitting}
          className={`w-full py-2.5 px-4 rounded-md text-white font-medium transition ${isFormValid && !validation.isSubmitting ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {validation.isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending verification email...
            </span>
          ) : 'Create Account'}
        </button>

        {validation.error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <p className="font-medium">{validation.error}</p>
            {validation.details && (
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(validation.details).map(([field, msg]) => (
                  <li key={field}><span className="font-medium">{field}:</span> {msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-sm space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            By registering, you agree to our terms of service
          </p>

          <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <ScrollToTopLink 
                to="/login" 
                state={{ userType }}
                className="text-green-600 hover:underline font-medium dark:text-green-400"
              >
                Login here
              </ScrollToTopLink>
            </p>

          
          </div>
        </div>
      </form>
    </div>
  );
}