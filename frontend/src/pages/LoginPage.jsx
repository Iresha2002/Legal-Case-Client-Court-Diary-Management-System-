import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import TextField from '../components/ui/TextField.jsx';
import PasswordField from '../components/ui/PasswordField.jsx';
import Checkbox from '../components/ui/Checkbox.jsx';
import scaleIcon from '../assets/icons/scale.svg';

function BrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between bg-bg-brand-image px-[72px] py-16 lg:flex">
      <div className="flex items-center gap-4">
        <img src={scaleIcon} alt="" width="44" height="44" className="block shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="font-serif text-logo font-semibold tracking-[0.06em] text-text-inverse">LEXIS DIARY</p>
          <p className="text-caption font-medium text-text-sidebar">
            Secure Legal Case &amp; Court Diary Management System
          </p>
        </div>
      </div>

      <div className="flex max-w-[520px] flex-col gap-6">
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

function validate({ identifier, password }) {
  const errors = {};
  if (!identifier.trim()) errors.identifier = 'Enter your email or username.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  const update = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // TODO: call the backend login endpoint once it exists (no auth controller yet).
    setNotice('Sign-in is not connected to the server yet.');
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
              label="Email or username"
              name="identifier"
              autoComplete="username"
              placeholder="Enter your email or username"
              value={form.identifier}
              onChange={(e) => update('identifier')(e.target.value)}
              error={errors.identifier}
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

            {notice && (
              <p role="status" className="rounded-sm border border-border-default bg-bg-page px-4 py-3 text-body text-text-primary">
                {notice}
              </p>
            )}

            <Button type="submit">Log In</Button>
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
