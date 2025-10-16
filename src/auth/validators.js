export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
export function validatePassword(pw) {
  return /^(?=.*\d).{8,}$/.test(pw);
}
