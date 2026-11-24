import { CalendarDays, Download, Eye, LogIn, LogOut, PenLine, Pencil, Upload, UserPlus } from 'lucide-react';

// Each activity type: the label and icon shown in the table, and the summary card it counts towards.
// group: 'access' (Access Granted), 'document' (Document Actions), 'login' (Login History), or null.
export const ACTIVITY_ACTIONS = {
  accessGranted: { label: 'Access Granted', icon: UserPlus, group: 'access' },
  documentUpdated: { label: 'Document Updated', icon: Pencil, group: 'document' },
  documentViewed: { label: 'Document Viewed', icon: Eye, group: 'document' },
  documentUploaded: { label: 'Document Uploaded', icon: Upload, group: 'document' },
  documentDownloaded: { label: 'Document Downloaded', icon: Download, group: 'document' },
  caseUpdated: { label: 'Case Updated', icon: CalendarDays, group: null },
  noteAdded: { label: 'Diary Note Added', icon: PenLine, group: null },
  login: { label: 'Login', icon: LogIn, group: 'login' },
  logout: { label: 'Logout', icon: LogOut, group: 'login' },
};
