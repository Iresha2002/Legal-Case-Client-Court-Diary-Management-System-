import { useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import SelectField from '../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../components/ui/TextAreaField.jsx';
import TextField from '../../../components/ui/TextField.jsx';
import { clients } from '../../../mocks/mockClients.js';
import { useCases } from '../../../state/casesContext.js';
import { REMINDER_TYPES, isInFuture } from './reminderOptions.js';

const NOTES_MAX = 500;

const EMPTY_FORM = {
  caseId: '',
  clientName: '',
  type: REMINDER_TYPES[0],
  title: '',
  date: '',
  time: '',
  notes: '',
};

const searchIcon = <Search size={18} className="shrink-0 text-text-secondary" aria-hidden="true" />;

function Optional() {
  return <span className="ml-1 align-top text-label font-normal text-text-secondary">(Optional)</span>;
}

// Keep only the form fields, with missing ones as '' so every input stays controlled.
function toFormValues(values = {}) {
  return Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, values[key] ?? EMPTY_FORM[key]]));
}

// The reminder form used by "Add Reminder" (Figma 05.1) and "Edit Reminder" (same layout).
// Related case and client are optional; typing shows matching suggestions, and choosing a case
// fills in its client. A new date and time must be in the future; when editing, an unchanged
// date and time is accepted, so an overdue reminder can still be renamed.
export default function ReminderForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const { cases } = useCases();
  const [form, setForm] = useState(() => toFormValues(initialValues));
  const [errors, setErrors] = useState({});

  const myCases = cases.filter((c) => c.assignedToMe);
  const clientNames = clients.map((c) => c.name);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const field = (name) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: (event) => setField(name, event.target.value),
  });

  const handleCaseChange = (event) => {
    const value = event.target.value;
    setField('caseId', value);
    const match = myCases.find((c) => c.id === value.trim().toUpperCase());
    if (match?.clientName && !form.clientName) setField('clientName', match.clientName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    const caseId = form.caseId.trim().toUpperCase();
    if (caseId && !myCases.some((c) => c.id === caseId)) found.caseId = 'Choose one of your cases from the list.';
    if (form.clientName.trim() && !clientNames.includes(form.clientName.trim())) {
      found.clientName = 'Choose a client from the list.';
    }
    if (!form.type) found.type = 'Select a reminder type.';
    if (!form.title.trim()) found.title = 'Enter a reminder title.';
    if (!form.date) found.date = 'Choose a date.';
    if (!form.time) found.time = 'Choose a time.';
    const timeChanged = form.date !== initialValues?.date || form.time !== initialValues?.time;
    if (form.date && form.time && timeChanged && !isInFuture(form.date, form.time, new Date())) {
      found.date = 'Choose a date and time in the future.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      ...form,
      caseId,
      clientName: form.clientName.trim(),
      title: form.title.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <section className="flex flex-col gap-5 rounded-md border border-border-default bg-bg-surface p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">Reminder Details</h2>
          <p className="text-caption text-text-secondary">
            Set a reminder for a meeting, follow-up, task or any other case-related activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <TextField
            label={
              <>
                Related Case
                <Optional />
              </>
            }
            placeholder="Search case number or title..."
            list="reminder-cases"
            autoComplete="off"
            trailing={searchIcon}
            {...field('caseId')}
            onChange={handleCaseChange}
          />
          <TextField
            label={
              <>
                Client
                <Optional />
              </>
            }
            placeholder="Search client name..."
            list="reminder-clients"
            autoComplete="off"
            trailing={searchIcon}
            {...field('clientName')}
          />
          <SelectField label="Reminder Type *" placeholder="Select type" options={REMINDER_TYPES} {...field('type')} />
          <TextField label="Reminder Title *" placeholder="e.g. Meeting with client" {...field('title')} />
          <TextField label="Date *" type="date" {...field('date')} />
          <TextField label="Time *" type="time" {...field('time')} />
          <TextAreaField
            label={
              <>
                Notes / Description
                <Optional />
              </>
            }
            placeholder="Add any details you need to remember..."
            rows={3}
            maxLength={NOTES_MAX}
            showCount
            className="md:col-span-2"
            {...field('notes')}
          />
        </div>

        {/* Suggestions for the two search fields. */}
        <datalist id="reminder-cases">
          {myCases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title ? `${c.title} - ${c.clientName}` : c.clientName}
            </option>
          ))}
        </datalist>
        <datalist id="reminder-clients">
          {clientNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" fullWidth={false} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth={false}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
