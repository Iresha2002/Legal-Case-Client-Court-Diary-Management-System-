import { useState } from 'react';
import Button from '../../../../components/ui/Button.jsx';
import Modal from '../../../../components/ui/Modal.jsx';
import SelectField from '../../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../../components/ui/TextAreaField.jsx';
import TextField from '../../../../components/ui/TextField.jsx';
import { formatDate, formatTime } from '../../../../utils/format.js';
import { hearingWhen } from './detailsHelpers.js';

// Court times every 30 minutes from 08:00 to 16:30, as { value: "09:00", label: "09:00 AM" }.
const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  const value = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  return { value, label: formatTime(value) };
});

function DialogButtons({ submitLabel, onClose }) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" fullWidth={false}>
        {submitLabel}
      </Button>
    </div>
  );
}

// Figma "JL 03.7 Add Hearing Summary". Saving marks the hearing as completed.
export function HearingSummaryDialog({ hearing, number, caseId, onSave, onClose }) {
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!summary.trim()) {
      setError('Write a short summary of the hearing.');
      return;
    }
    onSave(summary.trim());
  };

  return (
    <Modal
      title="Add Hearing Summary"
      subtitle={`Hearing ${number}  |  ${formatDate(hearing.date, { short: true })}  |  ${caseId}`}
      size="lg"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <dl className="grid grid-cols-[120px_1fr] gap-y-1.5 rounded-sm bg-bg-page px-4 py-3 text-caption">
          <dt className="text-text-secondary">Hearing date</dt>
          <dd className="text-text-primary">{hearingWhen(hearing)}</dd>
          <dt className="text-text-secondary">Court room</dt>
          <dd className="text-text-primary">{hearing.courtRoom}</dd>
          <dt className="text-text-secondary">Judge</dt>
          <dd className="text-text-primary">{hearing.judge}</dd>
        </dl>
        <TextAreaField
          label="What happened in this hearing? *"
          placeholder="Write a short summary of the hearing..."
          hint="This summary is shown on the Court Calendar when you open the next hearing."
          rows={4}
          value={summary}
          error={error}
          onChange={(event) => {
            setSummary(event.target.value);
            setError('');
          }}
        />
        <DialogButtons submitLabel="Save Summary" onClose={onClose} />
      </form>
    </Modal>
  );
}

// Figma "JL 03.9 Schedule Next Hearing". The new hearing must be after the previous one.
export function ScheduleHearingDialog({ number, caseId, previous, onSave, onClose }) {
  const [form, setForm] = useState({ date: '', time: '', courtRoom: '', judge: '' });
  const [errors, setErrors] = useState({});

  const field = (name) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: (event) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [name]: value }));
      setErrors((current) => ({ ...current, [name]: undefined }));
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!form.date) found.date = 'Choose the hearing date.';
    else if (previous && form.date <= previous.date) {
      found.date = `Choose a date after Hearing ${number - 1} (${formatDate(previous.date, { short: true })}).`;
    }
    if (!form.time) found.time = 'Select a time.';
    if (!form.courtRoom.trim()) found.courtRoom = 'Enter the court room.';
    if (!form.judge.trim()) found.judge = "Enter the judge's name.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ ...form, courtRoom: form.courtRoom.trim(), judge: form.judge.trim() });
  };

  return (
    <Modal
      title={previous ? 'Schedule Next Hearing' : 'Schedule Hearing'}
      subtitle={`Hearing ${number}  |  ${caseId}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {previous?.summary && (
          <div className="flex flex-col gap-1 rounded-sm bg-bg-page px-4 py-3">
            <p className="text-label font-semibold tracking-[0.06em] text-text-secondary">
              SUMMARY OF HEARING {number - 1}
            </p>
            <p className="text-caption text-text-primary">{previous.summary}</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Hearing Date *" type="date" min={previous?.date} {...field('date')} />
          <SelectField label="Time *" placeholder="Select time" options={TIME_OPTIONS} {...field('time')} />
          <TextField label="Court Room *" placeholder="Enter court room number" {...field('courtRoom')} />
          <TextField label="Judge's Name *" placeholder="Enter judge's name" {...field('judge')} />
        </div>
        <DialogButtons submitLabel="Save Hearing" onClose={onClose} />
      </form>
    </Modal>
  );
}
