/**
 * NACOS FUTO Academic Year Configuration & Calculation Utilities
 */

// Central configuration: current academic session starting year (e.g. 2026 for 2026/2027)
export const CURRENT_ACADEMIC_YEAR_START = 2026;

/**
 * Format academic session string from start year
 * e.g. 2026 -> '2026/2027'
 */
export function getAcademicSession(yearStart = CURRENT_ACADEMIC_YEAR_START) {
  return `${yearStart}/${yearStart + 1}`;
}

/**
 * FUTO Registration Number Year-Code Mapping
 * Each admission year has a specific 2-digit department code.
 * Format: YYYY + CODE + 5 digits = 11 digits total
 * e.g. 2024 + 14 + 29481 = 20241429481
 */
export const FUTO_YEAR_CODES = {
  2020: '10',
  2021: '12',
  2022: '12',
  2023: '13',
  2024: '14',
  2025: '15',
  2026: '16',
};

/**
 * Validate FUTO registration number format.
 * Expected format: YYYY + 2-digit year code + 5-digit serial = 11 digits total.
 * Returns { valid: true } or { valid: false, error: '...' }
 */
export function validateRegistrationNumberFormat(regNumber) {
  if (!regNumber || typeof regNumber !== 'string') {
    return { valid: false, error: 'Registration number is required.' };
  }

  const cleaned = regNumber.trim();

  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Registration number must be exactly 11 digits (e.g. 20241429481).'
    };
  }

  const yearPrefix = cleaned.substring(0, 4);
  const year = parseInt(yearPrefix, 10);
  const codePrefix = cleaned.substring(4, 6);

  // Check year is within valid range
  if (year < 2010 || year > CURRENT_ACADEMIC_YEAR_START) {
    return {
      valid: false,
      error: `Invalid admission year ${year}. Must be between 2010 and ${CURRENT_ACADEMIC_YEAR_START}.`
    };
  }

  // Check if we have a known code mapping for this year
  const expectedCode = FUTO_YEAR_CODES[year];
  if (!expectedCode) {
    return {
      valid: false,
      error: `Admission year ${year} is not recognized. Please contact the department if this is correct.`
    };
  }

  // Validate the department code matches expected
  if (codePrefix !== expectedCode) {
    return {
      valid: false,
      error: `Invalid registration number format. Year ${year} should have code ${expectedCode}, but got ${codePrefix}.`
    };
  }

  return { valid: true, year, code: codePrefix };
}

/**
 * Extract and validate 4-digit admission year from student registration number
 * e.g. '20241429481' -> 2024
 * Also validates FUTO registration number format (YYYY + code + 5 digits = 11 digits)
 */
export function parseAdmissionYear(regNumber, currentYearStart = CURRENT_ACADEMIC_YEAR_START) {
  if (!regNumber || typeof regNumber !== 'string') {
    return { valid: false, error: 'Registration number cannot be empty.' };
  }

  const cleaned = regNumber.trim();
  if (cleaned.length < 4) {
    return { valid: false, error: 'Registration number is too short.' };
  }

  // Enforce strictly numeric format: registration numbers contain digits only, no letters
  if (!/^\d+$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Registration number must contain digits only without any letters (e.g. 20241429481).'
    };
  }

  // Validate full FUTO format (11 digits with correct year code)
  const formatCheck = validateRegistrationNumberFormat(cleaned);
  if (!formatCheck.valid) {
    return { valid: false, error: formatCheck.error };
  }

  const yearPrefix = cleaned.substring(0, 4);
  const year = parseInt(yearPrefix, 10);

  if (year > currentYearStart) {
    return { 
      valid: false, 
      error: `Admission year ${year} cannot be in the future (current session start is ${currentYearStart}).` 
    };
  }

  return { valid: true, admissionYear: year };
}

/**
 * Calculate dynamic academic level from admission year and current academic year start
 * Formula: current_level = current_academic_year_start - admission_year + 1
 */
export function calculateCurrentLevel(admissionYear, currentYearStart = CURRENT_ACADEMIC_YEAR_START, programmeDuration = 5) {
  const numericLevel = currentYearStart - admissionYear + 1;

  if (numericLevel <= 0) {
    return { numericLevel, levelString: '100 Level', isGraduated: false };
  }

  if (numericLevel === 1) return { numericLevel: 1, levelString: '100 Level', isGraduated: false };
  if (numericLevel === 2) return { numericLevel: 2, levelString: '200 Level', isGraduated: false };
  if (numericLevel === 3) return { numericLevel: 3, levelString: '300 Level', isGraduated: false };
  if (numericLevel === 4) return { numericLevel: 4, levelString: '400 Level', isGraduated: false };
  if (numericLevel === 5) return { numericLevel: 5, levelString: '500 Level', isGraduated: false };
  if (numericLevel === 6 && programmeDuration >= 6) {
    return { numericLevel: 6, levelString: '600 Level', isGraduated: false };
  }

  if (numericLevel > programmeDuration) {
    return { 
      numericLevel, 
      levelString: `Graduated (${programmeDuration}-Yr Alumni)`, 
      isGraduated: true 
    };
  }

  return { numericLevel, levelString: `${numericLevel * 100} Level`, isGraduated: false };
}

/**
 * Calculate expected graduation year
 * Formula: expected_graduation_year = admission_year + programme_duration
 */
export function calculateExpectedGraduation(admissionYear, programmeDuration = 5) {
  const duration = parseInt(programmeDuration, 10) || 5;
  return admissionYear + duration;
}
