/**
 * @typedef {Object} StudentProfile
 * @property {string} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} matric_number
 * @property {string} institution
 * @property {string} department
 * @property {string} level
 * @property {string} role
 * @property {string} [avatar_url]
 * @property {string} created_at
 */

/**
 * @typedef {Object} DuesPayment
 * @property {string} id
 * @property {string} student_id
 * @property {string} session
 * @property {number} amount
 * @property {string} reference
 * @property {'pending' | 'verified' | 'rejected'} status
 * @property {string} verified_at
 * @property {string} receipt_url
 */

/**
 * @typedef {Object} AcademicResult
 * @property {string} id
 * @property {string} student_id
 * @property {string} course_code
 * @property {string} course_title
 * @property {number} credit_units
 * @property {number} score
 * @property {string} grade
 * @property {number} grade_point
 * @property {string} session
 * @property {'First' | 'Second'} semester
 */

/**
 * @typedef {Object} HackathonTeam
 * @property {string} id
 * @property {string} team_name
 * @property {string} chapter
 * @property {'fintech' | 'ai' | 'digital'} track
 * @property {string} lead_name
 * @property {string} lead_email
 * @property {string} lead_matric
 * @property {string} lead_phone
 * @property {Array<{name: string, email: string, matric: string, role: string}>} members
 * @property {string} project_title
 * @property {string} problem_statement
 * @property {string} proposed_solution
 * @property {string} tech_stack
 * @property {string} [github_url]
 * @property {'pending' | 'approved' | 'rejected'} status
 * @property {string} created_at
 */

export {};
