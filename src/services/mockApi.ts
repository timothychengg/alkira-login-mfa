/**
 * A tiny in-memory "API".
 * - Users persisted to localStorage for demo purposes.
 * - Login returns an MFA challenge that must be verified via a 6-digit code.
 * - Deterministic OTP '123456' to make Cypress tests stable.
 */

export type Role = 'readOnly' | 'readWrite';
export type UserRecord = {
  email: string;
  passwordHash: string;
  role: Role;
};

type MfaChallenge = {
  email: string;
  mfaToken: string;
  otp: string;
};

// Simple "hash" (DO NOT use in real apps)
function hash(pw: string) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return 'h' + Math.abs(h);
}

const STORAGE_USERS = 'demo.users.v1';
const STORAGE_SESS = 'demo.session.v1';
const STORAGE_MFA = 'demo.mfa.v1';

function loadUsers(): Record<string, UserRecord> {
  const raw = localStorage.getItem(STORAGE_USERS);
  return raw ? JSON.parse(raw) : {};
}
function saveUsers(db: Record<string, UserRecord>) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(db));
}

export async function signup(
  email: string,
  password: string,
  role: Role = 'readOnly'
) {
  await sleep(300);
  const db = loadUsers();
  const key = email.toLowerCase();
  if (db[key]) {
    const err: any = new Error('User already exists');
    err.code = 'USER_EXISTS';
    throw err;
  }
  db[key] = { email: key, passwordHash: hash(password), role };
  saveUsers(db);
  // Simulate email verification success and direct to login
  return { ok: true };
}

export async function login(email: string, password: string) {
  await sleep(400);
  const db = loadUsers();
  const key = email.toLowerCase();
  const rec = db[key];
  if (!rec) {
    const err: any = new Error('Invalid credentials');
    err.code = 'NO_USER';
    throw err;
  }
  if (rec.passwordHash !== hash(password)) {
    const err: any = new Error('Invalid credentials');
    err.code = 'BAD_PW';
    throw err;
  }

  // Create MFA challenge
  const challenge: MfaChallenge = {
    email: key,
    mfaToken: cryptoToken(),
    otp: '123456', // deterministic for demo & tests
  };
  sessionStorage.setItem(STORAGE_MFA, JSON.stringify(challenge));
  return { requiresMfa: true, mfaToken: challenge.mfaToken };
}

export async function verifyMfa(code: string) {
  await sleep(300);
  const raw = sessionStorage.getItem(STORAGE_MFA);
  if (!raw) {
    const err: any = new Error('MFA challenge not found or expired');
    err.code = 'NO_CHALLENGE';
    throw err;
  }
  const challenge: MfaChallenge = JSON.parse(raw);
  if (code !== challenge.otp) {
    const err: any = new Error('Incorrect code');
    err.code = 'BAD_OTP';
    throw err;
  }

  // Establish a "session"
  const db = loadUsers();
  const rec = db[challenge.email];
  const session = { email: rec.email, role: rec.role, token: cryptoToken() };
  sessionStorage.setItem(STORAGE_SESS, JSON.stringify(session));
  sessionStorage.removeItem(STORAGE_MFA);
  return session;
}

export async function currentSession() {
  await sleep(50);
  const raw = sessionStorage.getItem(STORAGE_SESS);
  return raw ? JSON.parse(raw) : null;
}

export async function signout() {
  await sleep(100);
  sessionStorage.removeItem(STORAGE_SESS);
}

function cryptoToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
