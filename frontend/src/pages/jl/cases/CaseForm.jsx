import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import SelectField from '../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../components/ui/TextAreaField.jsx';
import TextField from '../../../components/ui/TextField.jsx';
import { clients } from '../../../mocks/mockClients.js';
import { CASE_STATUSES, CASE_TYPES, LAWYERS, PRIORITIES } from './caseOptions.js';

const DESCRIPTION_MAX = 500;

const EMPTY_FORM = {
  id: '',
  type: '',
  clientName: '',
  lawyer: '',
  title: '',
  description: '',
  filedOn: '',
  priority: '',
  status: 'Ongoing',
};

const REQUIRED = {
  id: 'Enter a case number.',
  type: 'Select a case type.',
  clientName: 'Select a client.',
  lawyer: 'Select a lawyer.',
  title: 'Enter a case title.',
  status: 'Select a status.',
};

// Keep only the form fields, with missing ones as '' so every input stays controlled.
function toFormValues(values = {}) {
  return Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, values[key] ?? EMPTY_FORM[key]]));
}

// Figma section card: numbered circle, title and a short description.
function Section({ number, title, description, children }) {
  return (
    <section className="flex flex-col gap-6 rounded-md border border-border-default bg-bg-surface p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-action-primary text-caption font-semibold text-text-inverse">
          {number}
        </span>
        <div className="flex flex-col">
          <h2 className="text-body font-semibold text-text-primary">{title}</h2>
          <p className="text-caption text-text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

// The case form used by "Add New Case" (Figma 03.1) and "Edit Case" (Figma 03.30).
// `takenIds` are case numbers already in use, so a new number must be unique.
// onSubmit receives the trimmed values once they pass validation.
export default function CaseForm({ initialValues, takenIds, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(initialValues));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const found = {};
    Object.entries(REQUIRED).forEach(([field, message]) => {
      if (!form[field].trim()) found[field] = message;
    });
    if (!found.id && takenIds.includes(form.id.trim().toUpperCase())) {
      found.id = 'This case number is already in use.';
    }
    return found;
  };

  // Props shared by every field: name, value, error and an onChange that clears the field's error.
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
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const values = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    onSubmit({ ...values, id: values.id.toUpperCase() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Section number={1} title="Basic Information" description="Enter the main details about the case.">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <TextField
            label="Case Number *"
            placeholder="e.g. LC-2026-0046"
            hint="Enter a unique case number."
            {...field('id')}
          />
          <SelectField
            label="Case Type *"
            placeholder="Select case type"
            options={Object.values(CASE_TYPES)}
            {...field('type')}
          />
          <SelectField
            label="Client *"
            placeholder="Select client"
            options={clients.map((client) => client.name)}
            {...field('clientName')}
          />
          <SelectField label="Assigned Lawyer *" placeholder="Select lawyer" options={LAWYERS} {...field('lawyer')} />
          <TextField
            label="Case Title *"
            placeholder="Enter a brief title for the case"
            hint="E.g. Property Dispute, Divorce Case, Contract Agreement, etc."
            className="md:col-span-2"
            {...field('title')}
          />
          <TextAreaField
            label="Description"
            placeholder="Enter a brief description of the case..."
            rows={3}
            maxLength={DESCRIPTION_MAX}
            showCount
            className="md:col-span-2"
            {...field('description')}
          />
        </div>
      </Section>

      <Section number={2} title="Additional Information" description="Add any other relevant details.">
        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 md:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_auto]">
          <TextField label="Filing Date" type="date" {...field('filedOn')} />
          <SelectField label="Priority" placeholder="Select priority" options={PRIORITIES} {...field('priority')} />
          <SelectField label="Status *" placeholder="Select status" options={CASE_STATUSES} {...field('status')} />
          <div className="flex justify-end gap-3 md:col-span-3 xl:col-span-1 xl:pt-[30px]">
            <Button type="button" variant="secondary" fullWidth={false} onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" fullWidth={false}>
              {submitLabel}
            </Button>
          </div>
        </div>
      </Section>
    </form>
  );
}
