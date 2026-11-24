// Default settings, choices and storage for the Settings screen (Figma "JL 08").
// Until the backend has a settings endpoint, saved settings are kept in this browser only.

export const SETTINGS_TABS = ['account', 'security', 'notifications', 'preferences'];

export const LANGUAGES = ['English', 'Sinhala', 'Tamil'];
export const TIME_ZONES = ['Asia/Colombo', 'Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'UTC'];

// Same rules as the strength bar in Figma; the backend also requires at least 8 characters.
export const PASSWORD_RULES = [
  { label: 'Minimum 8 characters', test: (p) => p.length >= 8 },
  { label: 'At least one number', test: (p) => /\d/.test(p) },
  { label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'At least one special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const ROLE_LABELS = {
  ROLE_SENIOR_LAWYER: 'Senior Lawyer',
  ROLE_JUNIOR_LAWYER: 'Junior Lawyer',
  ROLE_CLERK: 'Clerk',
};

// Settings before the user saves anything: name and role come from the login session.
export function defaultSettings(session) {
  return {
    account: {
      fullName: session?.name ?? '',
      email: '',
      phone: '',
      jobTitle: ROLE_LABELS[session?.role] ?? '',
      language: 'English',
      timeZone: 'Asia/Colombo',
    },
    security: { twoFactor: true, sessionTimeout: false, loginAlerts: true, documentLogging: true },
    notifications: {
      email: true,
      inApp: true,
      caseUpdates: true,
      hearings: true,
      reminders: true,
      documents: true,
      mentions: true,
      system: false,
    },
    // Light by default: the app is designed in light colours, and 'system' would turn it dark on
    // computers set to dark mode before the user chose anything.
    preferences: { theme: 'light', showPictures: true, compact: false },
  };
}

function storageKey(session) {
  return `lexis-diary.settings.${session?.userId ?? 'guest'}`;
}

// Saved settings merged over the defaults, so a newly added setting still has a value.
// Storage can be blocked (private mode, browser settings), so every access is wrapped in try/catch.
export function loadSettings(session) {
  const defaults = defaultSettings(session);
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(session)) ?? 'null');
    if (!saved) return defaults;
    return Object.fromEntries(
      Object.entries(defaults).map(([section, values]) => [section, { ...values, ...saved[section] }]),
    );
  } catch {
    return defaults;
  }
}

// Saves only the Appearance choice, straight away, keeping the other saved settings as they are.
export function saveTheme(session, theme) {
  const saved = loadSettings(session);
  return saveSettings(session, { ...saved, preferences: { ...saved.preferences, theme } });
}

// Returns false when the browser does not allow saving.
export function saveSettings(session, settings) {
  try {
    localStorage.setItem(storageKey(session), JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
