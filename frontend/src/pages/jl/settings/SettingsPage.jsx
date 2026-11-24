import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import Button from '../../../components/ui/Button.jsx';
import Toast from '../../../components/ui/Toast.jsx';
import { applyTheme } from '../../../theme.js';
import { AccountSection, NotificationsSection, PreferencesSection, SecuritySection } from './SettingsSections.jsx';
import { PASSWORD_RULES, SETTINGS_TABS, loadSettings, saveSettings, saveTheme } from './settingsOptions.js';

const TAB_LABELS = {
  account: 'Account',
  security: 'Security',
  notifications: 'Notifications',
  preferences: 'Preferences',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{8,14}$/;
const EMPTY_PASSWORD = { current: '', next: '', confirm: '' };

function validateAccount(account) {
  const errors = {};
  if (!account.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (account.email.trim() && !EMAIL_PATTERN.test(account.email.trim())) errors.email = 'Enter a valid email address.';
  if (account.phone.trim() && !PHONE_PATTERN.test(account.phone.trim())) errors.phone = 'Enter a valid phone number.';
  return errors;
}

// The password is only checked when one of its fields has been filled in.
function validatePassword(password) {
  const errors = {};
  if (!password.current && !password.next && !password.confirm) return errors;
  if (!password.current) errors.current = 'Enter your current password.';
  if (!PASSWORD_RULES.every((rule) => rule.test(password.next))) errors.next = 'The new password does not meet all the requirements.';
  if (password.confirm !== password.next) errors.confirm = 'The passwords do not match.';
  return errors;
}

// Figma "JL 08 - 08.3 Settings": Account, Security, Notifications and Preferences tabs with one
// Save Changes button for all of them. The open tab is kept in the URL (?tab=security).
// The Appearance (theme) choice is applied and saved as soon as it is picked; the rest waits for Save Changes.
// Settings are saved in this browser until the backend has a settings endpoint;
// changing the password is checked here but needs a backend endpoint to take effect.
export default function SettingsPage() {
  const { session } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState(() => loadSettings(session));
  const [accountErrors, setAccountErrors] = useState({});
  const [password, setPassword] = useState(EMPTY_PASSWORD);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [photo, setPhoto] = useState({ url: '', error: '' });
  const [toast, setToast] = useState(null);
  const toastCount = useRef(0);

  // Free the previous photo preview when a new one is chosen or the page closes.
  useEffect(() => () => photo.url && URL.revokeObjectURL(photo.url), [photo.url]);

  const tab = SETTINGS_TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'account';
  const openTab = (id) => setSearchParams(id === 'account' ? {} : { tab: id }, { replace: true });

  const showToast = (text) => {
    toastCount.current += 1;
    setToast({ id: toastCount.current, text });
  };

  const setValue = (section, name, value) => {
    setSettings((current) => ({ ...current, [section]: { ...current[section], [name]: value } }));
  };

  const handleSave = () => {
    const foundAccount = validateAccount(settings.account);
    const foundPassword = validatePassword(password);
    setAccountErrors(foundAccount);
    setPasswordErrors(foundPassword);
    if (Object.keys(foundAccount).length > 0) {
      openTab('account');
      return;
    }
    if (Object.keys(foundPassword).length > 0) {
      openTab('security');
      return;
    }

    const trimmed = {
      ...settings,
      account: Object.fromEntries(Object.entries(settings.account).map(([k, v]) => [k, v.trim()])),
    };
    setSettings(trimmed);
    applyTheme(trimmed.preferences.theme);
    const stored = saveSettings(session, trimmed);
    const passwordFilled = Boolean(password.next);
    setPassword(EMPTY_PASSWORD);

    if (!stored) showToast('Could not save settings in this browser');
    else if (passwordFilled) showToast('Settings saved. Changing the password needs the server and is not done yet');
    else showToast('Settings saved');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Settings</h1>
        <Button type="button" fullWidth={false} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div role="tablist" aria-label="Settings sections" className="grid grid-cols-4 border-b border-border-default">
        {SETTINGS_TABS.map((id) => {
          const selected = id === tab;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls="settings-panel"
              onClick={() => openTab(id)}
              className={`-mb-px border-b-2 px-2 py-3 text-body transition-colors ${
                selected
                  ? 'border-action-primary font-medium text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {TAB_LABELS[id]}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="settings-panel" aria-labelledby={`tab-${tab}`}>
        {tab === 'account' && (
          <AccountSection
            values={settings.account}
            errors={accountErrors}
            photoUrl={photo.url}
            photoError={photo.error}
            onChange={(name, value) => {
              setValue('account', name, value);
              setAccountErrors((current) => ({ ...current, [name]: undefined }));
            }}
            onPhoto={(file, error) => setPhoto(file ? { url: URL.createObjectURL(file), error: '' } : { url: photo.url, error })}
          />
        )}
        {tab === 'security' && (
          <SecuritySection
            values={settings.security}
            onToggle={(name, value) => setValue('security', name, value)}
            password={password}
            passwordErrors={passwordErrors}
            onPasswordChange={(name, value) => {
              setPassword((current) => ({ ...current, [name]: value }));
              setPasswordErrors((current) => ({ ...current, [name]: undefined }));
            }}
          />
        )}
        {tab === 'notifications' && (
          <NotificationsSection
            values={settings.notifications}
            onToggle={(name, value) => setValue('notifications', name, value)}
          />
        )}
        {tab === 'preferences' && (
          <PreferencesSection
            values={settings.preferences}
            onChange={(name, value) => {
              setValue('preferences', name, value);
              // The theme is applied and saved straight away, so every page uses it at once.
              if (name === 'theme') {
                applyTheme(value);
                saveTheme(session, value);
              }
            }}
          />
        )}
      </div>

      {toast && <Toast key={toast.id} message={toast.text} onDone={() => setToast(null)} />}
    </div>
  );
}
