const users = new Map([
  ['reader@demo.com', { password: 'Password1!', role: 'readOnly' }],
  ['writer@demo.com', { password: 'Password1!', role: 'readWrite' }],
]);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function signup(email, password) {
  await sleep(500);
  if (users.has(email)) throw new Error('Email already registered');
  users.set(email, { password, role: 'readOnly' });
  return { ok: true };
}

export async function login(email, password) {
  await sleep(600);
  const rec = users.get(email);
  if (!rec || rec.password !== password) throw new Error('Invalid credentials');
  const tempLoginToken = btoa(JSON.stringify({ email, t: Date.now() }));
  return { tempLoginToken };
}

export async function sendOtp(tempLoginToken) {
  await sleep(300);
  if (!tempLoginToken) throw new Error('No pending login');
  return { sent: true };
}

export async function verifyOtp(tempLoginToken, code) {
  await sleep(600);
  if (!tempLoginToken) throw new Error('Session expired');
  if (code !== '123456') throw new Error('Invalid code');
  const payload = JSON.parse(atob(tempLoginToken));
  const rec = users.get(payload.email);
  if (!rec) throw new Error('User not found');
  const user = {
    id: crypto.randomUUID(),
    email: payload.email,
    role: rec.role,
  };
  const accessToken = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    })
  );
  return { user, accessToken };
}
