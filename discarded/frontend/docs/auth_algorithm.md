# FUTO CSC Authentication System

## Backend Flow

### Registration
1. Client submits:
   - 11-digit registration number
   - First name, last name
   - @futo.edu.ng email
   - Password

2. Server validates:
   - Checks `valid_registrations` table for exact match
   - Verifies email pattern
   - Validates password strength

3. On success:
   - Creates unverified account in `users` table
   - Sends verification email
   - Returns 201 Created

### Login
1. Client submits:
   - Email OR registration number
   - Password

2. Server:
   - Finds user by email OR reg number
   - Verifies password hash
   - Checks email verification status
   - Generates JWT token (7d expiry)

3. On success:
   - Returns user data + token

### Profile System
1. User data structure:
   - Basic info (from registration)
   - Avatar (default or custom)
   - Level-specific dashboard

2. Avatar handling:
   - Default images provided
   - Path: `/assets/avatars/default-{1-6}.png`
   - Later: Custom uploads

## Frontend Components

### Auth State Management
```javascript
// AuthContext.js
{
  isLoggedIn: boolean,
  user: {
    id: string,
    reg_number: string,
    email: string,
    level: number,
    avatar: string
  },
  login: (credentials) => Promise,
  logout: () => void
}