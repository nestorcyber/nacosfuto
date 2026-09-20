import { signInStudent } from '../packages/supabase/src/auth.js';

// Setup fake localStorage in node environment for test
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

async function runTests() {
  console.log('\n=============================================');
  console.log('       TESTING STUDENT LOGIN & ERROR CASES   ');
  console.log('=============================================\n');

  // Test 1: Empty input
  console.log('[Test 1] Missing credentials...');
  const res1 = await signInStudent('', '');
  console.log('Result:', res1.error ? `✔ Error caught: "${res1.error.message}"` : '❌ Should have failed');

  // Test 2: Non-existent student
  console.log('\n[Test 2] Non-existent student (99999999999)...');
  const res2 = await signInStudent('99999999999', 'password');
  console.log('Result:', res2.error ? `✔ Error caught: "${res2.error.message}"` : '❌ Should have failed');

  // Test 3: Valid user, wrong password
  console.log('\n[Test 3] Valid student (20241450682), wrong password...');
  const res3 = await signInStudent('20241450682', 'wrong_password_123');
  console.log('Result:', res3.error ? `✔ Error caught: "${res3.error.message}"` : '❌ Should have failed');

  // Test 4: Valid user by Reg Number, correct password
  console.log('\n[Test 4] Valid student (20241450682) by Reg No, correct password...');
  const res4 = await signInStudent('20241450682', 'password');
  if (res4.data?.user) {
    console.log(`✔ Login successful! User: ${res4.data.user.full_name}, RegNo: ${res4.data.user.registration_number}, Level: ${res4.data.user.level}`);
  } else {
    console.error('❌ Login failed:', res4.error);
  }

  // Test 5: Valid user by Email, correct password
  console.log('\n[Test 5] Valid student by Email (nestor.ifeanyi@futo.edu.ng), correct password...');
  const res5 = await signInStudent('nestor.ifeanyi@futo.edu.ng', 'password');
  if (res5.data?.user) {
    console.log(`✔ Login successful by email! User: ${res5.data.user.full_name}`);
  } else {
    console.error('❌ Login failed:', res5.error);
  }

  console.log('\n=============================================');
  console.log('       ALL LOGIN TEST CASES COMPLETED        ');
  console.log('=============================================\n');
}

runTests().catch(console.error);
