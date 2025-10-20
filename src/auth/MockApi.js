// Simple mock "DB" in localStorage so signup persists across refreshes.
const USERS_KEY = 'mock_users_v1';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function ensureSeedUser() {
  const users = loadUsers();
  if (!users.find((u) => u.email === 'test@example.com')) {
    users.push({ email: 'test@example.com', password: 'Test1234!' });
    saveUsers(users);
  }
}
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// ---- Public API ----

// 1) LOGIN (password step) → returns a TEMP token (no access yet)
export async function login(email, password) {
  ensureSeedUser();
  await delay(500);
  const users = loadUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  // Return temp token; not authorized for protected routes yet
  return { tempLoginToken: `temp-${Date.now()}` };
}

// 2) SIGNUP → persist user in localStorage
export async function signup(email, password) {
  await delay(600);
  const users = loadUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (exists) throw new Error('An account with this email already exists.');
  users.push({ email, password });
  saveUsers(users);
  return { success: true };
}

// 3) MFA VERIFY → requires correct OTP and a temp token; returns FINAL access token
export async function verifyMfa({ otp, tempLoginToken }) {
  await delay(500);
  if (!tempLoginToken) throw new Error('Session expired. Please log in again.');
  if (otp !== '123456') throw new Error('Invalid OTP');
  // Issue final access token
  return { accessToken: `access-${Date.now()}` };
}
