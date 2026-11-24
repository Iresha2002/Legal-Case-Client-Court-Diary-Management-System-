import { useRef } from 'react';
import {
  Bell,
  CalendarDays,
  Check,
  Circle,
  Clock,
  FileText,
  Image,
  List,
  Lock,
  Mail,
  Sun,
  Users,
} from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import PasswordField from '../../../components/ui/PasswordField.jsx';
import SelectField from '../../../components/ui/SelectField.jsx';
import Switch from '../../../components/ui/Switch.jsx';
import TextField from '../../../components/ui/TextField.jsx';
import { initials } from '../../../utils/format.js';
import { LANGUAGES, PASSWORD_RULES, TIME_ZONES } from './settingsOptions.js';

function Card({ title, description, className = '', children }) {
  return (
    <section className={`flex flex-col gap-5 rounded-md border border-border-default bg-bg-surface p-6 ${className}`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">{title}</h2>
        <p className="text-caption text-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

// One row with an icon, a title, a description and a switch (Figma security, notification
// and display rows). `boxed` puts the icon in a grey box like the security and notification rows.
function ToggleRow({ icon: Icon, title, description, checked, onChange, boxed = true }) {
  return (
    <li className="flex items-center gap-4 border-b border-border-default py-3.5 last:border-b-0">
      <span
        className={`flex shrink-0 items-center justify-center text-text-primary ${
          boxed ? 'size-10 rounded-sm border border-border-default bg-bg-page' : 'size-6'
        }`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-body font-medium text-text-primary">{title}</p>
        <p className="text-caption text-text-secondary">{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </li>
  );
}

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

// Figma "JL 08 Settings - Account".
export function AccountSection({ values, errors, photoUrl, photoError, onChange, onPhoto }) {
  const fileRef = useRef(null);
  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event) => onChange(name, event.target.value),
  });

  return (
    <Card
      title="Personal Information"
      description="Manage your personal information and account details."
      className="mx-auto w-full max-w-[694px]"
    >
      <div className="flex flex-col items-center gap-3">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="size-20 rounded-full object-cover" />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-full bg-action-primary text-[24px] font-bold text-text-inverse">
            {initials(values.fullName)}
          </span>
        )}
        <Button type="button" variant="secondary" fullWidth={false} onClick={() => fileRef.current?.click()}>
          Change Photo
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files[0];
            event.target.value = '';
            if (!file) return;
            if (!/\.(jpe?g|png)$/i.test(file.name)) onPhoto(null, 'Choose a JPG or PNG image.');
            else if (file.size > MAX_PHOTO_BYTES) onPhoto(null, 'The image is larger than 2 MB.');
            else onPhoto(file, '');
          }}
        />
        <p className={`text-caption ${photoError ? 'text-red-600' : 'text-text-secondary'}`}>
          {photoError || 'JPG, PNG up to 2MB'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <TextField label="Full Name" autoComplete="name" {...field('fullName')} />
        <TextField label="Email Address" type="email" autoComplete="email" placeholder="Enter your email" {...field('email')} />
        <TextField label="Phone Number" type="tel" autoComplete="tel" placeholder="Enter your phone number" {...field('phone')} />
        <TextField label="Job Title / Role" {...field('jobTitle')} />
        <SelectField label="Preferred Language" placeholder="Select language" options={LANGUAGES} {...field('language')} />
        <SelectField label="Time Zone" placeholder="Select time zone" options={TIME_ZONES} {...field('timeZone')} />
      </div>
    </Card>
  );
}

// Figma "JL 08.1 Settings - Security".
export function SecuritySection({ values, onToggle, password, passwordErrors, onPasswordChange }) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password.next)).length;
  const field = (name, label, placeholder, autoComplete) => (
    <PasswordField
      label={label}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={password[name]}
      error={passwordErrors[name]}
      onChange={(event) => onPasswordChange(name, event.target.value)}
    />
  );

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <Card title="Security Controls" description="Manage security settings to keep your account safe.">
        <ul>
          <ToggleRow
            icon={Lock}
            title="Two-factor authentication"
            description="Add an extra layer of security to your account."
            checked={values.twoFactor}
            onChange={(v) => onToggle('twoFactor', v)}
          />
          <ToggleRow
            icon={Clock}
            title="Session timeout"
            description="Automatically sign you out after 30 minutes of inactivity."
            checked={values.sessionTimeout}
            onChange={(v) => onToggle('sessionTimeout', v)}
          />
          <ToggleRow
            icon={Bell}
            title="Login alerts"
            description="Notify me about new device sign-ins."
            checked={values.loginAlerts}
            onChange={(v) => onToggle('loginAlerts', v)}
          />
          <ToggleRow
            icon={FileText}
            title="Document access logging"
            description="Record every access to secure documents."
            checked={values.documentLogging}
            onChange={(v) => onToggle('documentLogging', v)}
          />
        </ul>
      </Card>

      <Card title="Change Password" description="Update your password regularly to keep your account secure.">
        <div className="flex flex-col gap-4">
          {field('current', 'Current Password', 'Enter current password', 'current-password')}
          {field('next', 'New Password', 'Enter new password', 'new-password')}

          <div className="grid grid-cols-4 gap-2" aria-hidden="true">
            {PASSWORD_RULES.map((rule, index) => (
              <span
                key={rule.label}
                className={`h-1 rounded-full ${index < passed ? 'bg-text-secondary' : 'bg-border-default'}`}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-body font-medium text-text-primary">Password Requirements:</p>
            <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(password.next);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-caption ${met ? 'text-text-primary' : 'text-text-secondary'}`}
                  >
                    {met ? (
                      <span className="flex size-3.5 items-center justify-center rounded-full bg-action-primary text-text-inverse">
                        <Check size={10} strokeWidth={3} aria-hidden="true" />
                      </span>
                    ) : (
                      <Circle size={14} aria-hidden="true" />
                    )}
                    {rule.label}
                    <span className="sr-only">{met ? '(done)' : '(not yet)'}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {field('confirm', 'Confirm New Password', 'Confirm new password', 'new-password')}
        </div>
      </Card>
    </div>
  );
}

const NOTIFICATION_ROWS = [
  { key: 'email', icon: Mail, title: 'Email Notifications', description: 'Receive important updates via email.' },
  { key: 'inApp', icon: Bell, title: 'In-App Notifications', description: 'Show notifications inside the system.' },
  {
    key: 'caseUpdates',
    icon: CalendarDays,
    title: 'Case Updates',
    description: 'Get notified about case status changes, assignments and updates.',
  },
  { key: 'hearings', icon: CalendarDays, title: 'Court Hearings', description: 'Receive reminders for upcoming court hearings.' },
  { key: 'reminders', icon: Bell, title: 'Reminders', description: 'Get notified about upcoming deadlines and follow-ups.' },
  {
    key: 'documents',
    icon: FileText,
    title: 'Document Updates',
    description: 'Receive notifications when documents are added, updated or shared.',
  },
  {
    key: 'mentions',
    icon: Users,
    title: 'Mentions & Assignments',
    description: 'Get notified when you are mentioned or assigned to a case.',
  },
  { key: 'system', icon: Sun, title: 'System Notifications', description: 'Receive important system announcements.' },
];

// Figma "JL 08.2 Settings - Notifications".
export function NotificationsSection({ values, onToggle }) {
  return (
    <Card
      title="Notification Settings"
      description="Manage how you receive notifications for your account."
      className="mx-auto w-full max-w-[728px]"
    >
      <ul>
        {NOTIFICATION_ROWS.map((row) => (
          <ToggleRow
            key={row.key}
            icon={row.icon}
            title={row.title}
            description={row.description}
            checked={values[row.key]}
            onChange={(v) => onToggle(row.key, v)}
          />
        ))}
      </ul>
    </Card>
  );
}

// Small drawing of a light or dark screen for the Appearance choices. The colours are fixed
// (not theme colours) so each drawing looks the same in both themes.
function ThemePreview({ dark }) {
  return (
    <div
      className={`flex h-full flex-col gap-1.5 rounded-sm border p-3 ${
        dark ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-200 bg-white'
      }`}
    >
      {['w-2/5', 'w-3/5', 'w-1/3'].map((width) => (
        <span key={width} className={`h-1.5 rounded-full ${width} ${dark ? 'bg-neutral-500' : 'bg-neutral-200'}`} />
      ))}
    </div>
  );
}

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

// Figma "JL 08.3 Settings - Preferences".
export function PreferencesSection({ values, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      <Card title="Appearance" description="Choose how the system looks for you.">
        <div role="radiogroup" aria-label="Appearance" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {THEMES.map((theme) => {
            const selected = values.theme === theme.value;
            return (
              <button
                key={theme.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange('theme', theme.value)}
                className={`flex flex-col gap-4 rounded-md border p-5 text-left transition-colors ${
                  selected ? 'border-2 border-border-strong bg-bg-page' : 'border-border-default bg-bg-surface hover:bg-bg-page'
                }`}
              >
                <div className="h-20">
                  {theme.value === 'system' ? (
                    <div className="grid h-full grid-cols-2 overflow-hidden rounded-sm">
                      <ThemePreview />
                      <ThemePreview dark />
                    </div>
                  ) : (
                    <ThemePreview dark={theme.value === 'dark'} />
                  )}
                </div>
                <span className="flex items-center justify-center gap-2 text-body text-text-primary">
                  <span
                    aria-hidden="true"
                    className={`flex size-4 items-center justify-center rounded-full border-2 border-action-primary ${
                      selected ? 'bg-bg-surface' : ''
                    }`}
                  >
                    {selected && <span className="size-2 rounded-full bg-action-primary" />}
                  </span>
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Display Preferences" description="Adjust a few display settings for a better experience.">
        <ul>
          <ToggleRow
            icon={Image}
            title="Show Profile Pictures"
            description="Display avatar images in the system."
            checked={values.showPictures}
            onChange={(v) => onChange('showPictures', v)}
            boxed={false}
          />
          <ToggleRow
            icon={List}
            title="Compact View"
            description="Show more items in lists and tables."
            checked={values.compact}
            onChange={(v) => onChange('compact', v)}
            boxed={false}
          />
        </ul>
      </Card>
    </div>
  );
}
