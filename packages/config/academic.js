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
 * Extract and validate 4-digit admission year from student registration number
 * e.g. '2024CS12345' -> 2024, '2022/139481' -> 2022
 * Rejects invalid prefixes like 'ABC12345' or future years > CURRENT_ACADEMIC_YEAR_START
 */
export function parseAdmissionYear(regNumber, currentYearStart = CURRENT_ACADEMIC_YEAR_START) {
  if (!regNumber || typeof regNumber !== 'string') {
    return { valid: false, error: 'Registration number cannot be empty.' };
  }

  const cleaned = regNumber.trim();
  if (cleaned.length < 4) {
    return { valid: false, error: 'Registration number is too short.' };
  }

  const yearPrefix = cleaned.substring(0, 4);
  if (!/^\d{4}$/.test(yearPrefix)) {
    return { 
      valid: false, 
      error: `Registration number must begin with a valid 4-digit year (e.g. 2024...). Found "${yearPrefix}".` 
    };
  }

  const year = parseInt(yearPrefix, 10);
  if (year < 1980) {
    return { valid: false, error: `Admission year ${year} is invalid (must be 1980 or later).` };
  }

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
