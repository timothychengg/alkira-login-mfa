# Alkira Login + MFA – React + Vite + TypeScript

A professional, self-contained demo implementing:

- Email/password login
- A second-step MFA (6-digit code)
- Sign-up flow
- Protected routes (requires successful MFA)
- Simple role-based access control (readOnly vs readWrite)
- Clean UX states (validation, loading, error messages)
- Cypress end-to-end tests (3 specs)

> **Note**: This project uses a local in-browser mock API with deterministic OTP `123456` to keep the demo and tests simple and stable.

## Tech Stack

- React 18 + TypeScript + Vite
- React Router v6
- Tailwind CSS
- Cypress for E2E tests
- Zod for validation

## Getting Started

```bash
# 1) Install deps
npm install

# 2) Start dev server
npm run dev
# App at http://localhost:5173
```

## Test

Open another terminal:

```bash
# Runs headless e2e
npm run test:e2e

# Or open Cypress runner
npm run test:open
```

## Demo Flow

1. **Sign up** on `/signup` (choose `readOnly` or `readWrite` to demo access control).
2. **Login** on `/login`. Correct credentials will trigger MFA.
3. **MFA** on `/mfa` using code `123456`.
4. You’ll land on `/app` (protected). If your role is `readWrite`, you can add notes; `readOnly` users can’t.

## Notes & Decisions

- **Mock API** persists users in `localStorage` and session in `sessionStorage` only. No backend needed.
- Password rules enforced via Zod (min length, upper/lowercase, digit).
- Clean, componentized inputs with accessible labels and helpful error messages.
- Deterministic OTP makes tests reliable and the demo straightforward.
- The code is split into `pages`, `components`, `state` (auth context), `services` (mock API), and `utils`.

## Possible Extensions

- Replace mock API with a real backend or auth provider.
- Add email delivery for OTP or app-authenticator integration (TOTP).
- Expand role model & feature flags per role.
- Add unit tests (React Testing Library) and lint checks in CI.
