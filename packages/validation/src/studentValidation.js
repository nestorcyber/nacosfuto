/**
 * NACOS Student Registration & Data Validation Rules
 */

/**
 * Clean and format registration number
 */
export function sanitizeRegNumber(regNo) {
  if (!regNo) return '';
  return regNo.toString().replace(/[\s\-\/\.]/g, '').toUpperCase();
}

/**
 * Validate FUTO Computer Science Registration Number
 * Expected pattern: 11 digits
 * Format breakdown:
 * - 4-digit Admission Year (e.g., 2018 - 2030)
 * - 2-digit Department Code (e.g., 14 for 2024, 15 for 2025, 16 for 2026, or valid CS dept codes 10-25)
 * - 5-digit Unique Student Sequence (e.g., 29481)
 * Examples: 20241429481, 20251512345, 20261699999
 */
export function validateRegistrationNumber(regNo) {
  if (!regNo) {
    return { isValid: false, error: 'Registration number is required.' };
  }

  const clean = sanitizeRegNumber(regNo);

  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(clean)) {
    return {
      isValid: false,
      error: 'Registration number must be exactly 11 digits (e.g., 20241429481).'
    };
  }

  const year = parseInt(clean.slice(0, 4), 10);
  const currentYear = new Date().getFullYear();

  // Validate admission year boundary
  if (year < 2015 || year > currentYear + 2) {
    return {
      isValid: false,
      error: `Invalid admission year (${year}) in registration number.`
    };
  }

  return { isValid: true, sanitized: clean };
}

/**
 * Validate Student Email Address
 */
export function validateEmail(email) {
  if (!email) {
    return { isValid: false, error: 'Email address is required.' };
  }

  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const isInstitutional = clean.endsWith('@futo.edu.ng');

  return { isValid: true, sanitized: clean, isInstitutional };
}

/**
 * Validate Student Nigerian Phone Number
 * Accepts: +234XXXXXXXXXX, 080XXXXXXXX, 090XXXXXXXX, 070XXXXXXXX, 081XXXXXXXX, 234XXXXXXXXXX
 */
export function validatePhoneNumber(phone) {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required.' };
  }

  let clean = phone.toString().replace(/[\s\-\(\)]/g, '');

  if (clean.startsWith('+234')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('234')) {
    clean = '0' + clean.slice(3);
  }

  const ngPhoneRegex = /^0(70|80|81|90|91|80|71)\d{8}$/;

  if (!ngPhoneRegex.test(clean)) {
    return {
      isValid: false,
      error: 'Please enter a valid Nigerian mobile phone number (e.g., 08012345678).'
    };
  }

  return { 
    isValid: true, 
    sanitized: clean, 
    international: '+234' + clean.slice(1),
    termii: '234' + clean.slice(1)
  };
}

/**
 * Format Nigerian phone number for Termii API
 * Termii expects format: 2348012345678 (no leading '+' and no leading '0')
 */
export function formatPhoneForTermii(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1);
  }
  if (digits.startsWith('234') && digits.length === 13) {
    return digits;
  }
  if (digits.length === 10) {
    return '234' + digits;
  }
  return digits;
}

