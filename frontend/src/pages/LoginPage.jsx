import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import TextField from '../components/ui/TextField.jsx';
import PasswordField from '../components/ui/PasswordField.jsx';
import Checkbox from '../components/ui/Checkbox.jsx';
import { login } from '../api/auth.js';
import { saveSession } from '../auth/session.js';
import scaleIcon from '../assets/icons/scale.svg';
import loginBg from '../assets/images/login-bg.jpg';

function BrandPanel() {
  return (
    <aside
      className="relative hidden flex-col justify-between overflow-hidden bg-bg-brand-image bg-cover bg-[position:8%_center] px-[72px] py-16 lg:flex"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Darkens the photo so the white text stays readable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/30"
      />

      <div className="relative flex items-center gap-4">
        <img src={scaleIcon} alt="" width="44" height="44" className="block shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="font-serif text-logo font-semibold tracking-[0.06em] text-text-inverse">LEXIS DIARY</p>
          <p className="text-caption font-medium text-text-sidebar">
            Secure Legal Case &amp; Court Diary Management System
          </p>
        </div>
      </div>

      <div className="relative flex max-w-[520px] flex-col gap-6">
        <h2 className="font-serif text-display font-bold text-text-inverse">
          Justice.
          <br />
          Organized.
          <br />
          Secure.
        </h2>
        <div className="h-0.5 w-12 bg-text-inverse" />
        <p className="text-body text-text-sidebar">
          Manage cases, track hearings, maintain client records and keep your legal diary all in one place.
        </p>
      </div>
    </aside>
  );
}

// Same rule and message as the backend, so the user sees the problem before sending.
const MIN_PASSWORD_LENGTH = 8;

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your email.';
  if (!password) errors.password = 'Enter your password.';
  else if (password.length < MIN_PASSWORD_LENGTH) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

// onLogin is called with the session after a successful login.
export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      const session = await login(form.email.trim(), form.password);
      saveSession(session, form.remember);
      onLogin?.(session);
    } catch (error) {
      // The message comes from the backend, for example "Incorrect email or password."
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-bg-page lg:grid-cols-[900fr_636fr]">
      <BrandPanel />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-[440px] flex-col gap-5 rounded-md border border-border-default bg-bg-surface p-6 shadow-raised sm:p-10">
          <p className="text-label font-semibold tracking-[0.06em] text-text-secondary">SECURE PORTAL</p>

          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-[36px] leading-[44px] font-bold text-text-primary sm:text-display">
              Welcome Back
            </h1>
            <p className="text-body text-text-secondary">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => update('email')(e.target.value)}
              error={errors.email}
            />
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => update('password')(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-between gap-4">
              <Checkbox label="Remember me" checked={form.remember} onChange={update('remember')} />
              <button type="button" className="text-body font-medium text-text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            {serverError && (
              <p role="alert" className="rounded-sm border border-red-600 bg-bg-page px-4 py-3 text-body text-red-600">
                {serverError}
              </p>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log In'}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border-default" />
            <span className="text-caption font-medium text-text-secondary">OR</span>
            <div className="h-px flex-1 bg-border-default" />
          </div>

          <Button type="button" variant="secondary">
            Login with SSO
          </Button>

          <p className="text-center text-caption font-medium text-text-secondary">
            © 2026 LEXIS DIARY. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
