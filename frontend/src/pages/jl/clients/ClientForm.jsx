import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import Card from '../../../components/ui/Card.jsx';
import SelectField from '../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../components/ui/TextAreaField.jsx';
import TextField from '../../../components/ui/TextField.jsx';

// Dropdown choices. Figma only shows some of them, so the team should confirm these lists.
const GENDERS = ['Male', 'Female', 'Other'];
const CLIENT_TYPES = ['Individual', 'Company', 'Organization'];
const LANGUAGES = ['Sinhala', 'Tamil', 'English', 'English / Sinhala', 'English / Tamil'];
const RELATIONSHIPS = ['Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Guardian', 'Friend', 'Other'];

const EMPTY_FORM = {
  fullName: '',
  occupation: '',
  contactNo: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  clientType: '',
  nationality: '',
  registeredOn: '',
  language: '',
  repName: '',
  repRelationship: '',
  repContactNo: '',
  notes: '',
};

// Fields marked * in Figma, with the message shown when they are empty.
const REQUIRED = {
  fullName: 'Enter the full name.',
  occupation: 'Enter the occupation.',
  contactNo: 'Enter a contact number.',
  address: 'Enter the address.',
  dateOfBirth: 'Enter the date of birth.',
  gender: 'Select a gender.',
  clientType: 'Select a client type.',
  nationality: 'Enter the nationality.',
  registeredOn: 'Enter the registered date.',
  language: 'Select a language.',
};

// Digits, spaces and dashes, with an optional leading +, e.g. 077 123 4567 or +94 77 123 4567.
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{8,14}$/;

// Today as yyyy-mm-dd, the format date inputs use.
function todayValue() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function validate(form) {
  const errors = {};
  Object.entries(REQUIRED).forEach(([field, message]) => {
    if (!form[field].trim()) errors[field] = message;
  });
  if (form.contactNo.trim() && !PHONE_PATTERN.test(form.contactNo.trim())) {
    errors.contactNo = 'Enter a valid contact number.';
  }
  if (form.repContactNo.trim() && !PHONE_PATTERN.test(form.repContactNo.trim())) {
    errors.repContactNo = 'Enter a valid contact number.';
  }
  if (form.dateOfBirth && form.dateOfBirth > todayValue()) {
    errors.dateOfBirth = 'Date of birth cannot be in the future.';
  }
  return errors;
}

// Keep only the form fields, with missing ones as '' so every input stays controlled.
function toFormValues(values = {}) {
  return Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, values[key] ?? '']));
}

// The client form used by "Add Client" (Figma 02.1) and "Edit Client" (Figma 02.5).
// onSubmit receives the trimmed values once they pass validation.
export default function ClientForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(initialValues));
  const [errors, setErrors] = useState({});

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
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[706fr_356fr]">
      <Card title="Client Information">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <TextField label="Full Name*" placeholder="Enter full name" autoComplete="name" {...field('fullName')} />
          <TextField label="Occupation*" placeholder="Enter occupation" {...field('occupation')} />
          <TextField
            label="Contact No*"
            type="tel"
            placeholder="Enter contact number"
            autoComplete="tel"
            {...field('contactNo')}
          />
          <TextAreaField label="Address*" placeholder="Enter address" rows={3} {...field('address')} />
          <TextField label="Date of Birth*" type="date" max={todayValue()} {...field('dateOfBirth')} />
          <SelectField label="Gender*" placeholder="Select gender" options={GENDERS} {...field('gender')} />
          <SelectField
            label="Client Type*"
            placeholder="Select client type"
            options={CLIENT_TYPES}
            {...field('clientType')}
          />
          <TextField label="Nationality*" placeholder="Enter nationality" {...field('nationality')} />
          <TextField label="Registered*" type="date" {...field('registeredOn')} />
          <SelectField label="Language*" placeholder="Select language" options={LANGUAGES} {...field('language')} />
        </div>

        <div className="flex justify-end gap-3 border-t border-border-default pt-6">
          <Button type="button" variant="secondary" fullWidth={false} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" fullWidth={false}>
            {submitLabel}
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card title="Legal Representative">
          <div className="flex flex-col gap-5">
            <TextField label="Contact Person Name" placeholder="Enter contact person name" {...field('repName')} />
            <SelectField
              label="Relationship to Client"
              placeholder="Select relationship"
              options={RELATIONSHIPS}
              {...field('repRelationship')}
            />
            <TextField label="Contact Number" type="tel" placeholder="Enter contact number" {...field('repContactNo')} />
          </div>
        </Card>

        <Card title="Additional Notes">
          <TextAreaField
            aria-label="Additional notes"
            placeholder="Add any additional notes about the client..."
            rows={9}
            {...field('notes')}
          />
        </Card>
      </div>
    </form>
  );
}
