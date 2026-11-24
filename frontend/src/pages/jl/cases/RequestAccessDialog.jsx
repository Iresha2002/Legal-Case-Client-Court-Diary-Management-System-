import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import SelectField from '../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../components/ui/TextAreaField.jsx';
import { ACCESS_TYPES } from '../../../state/accessRequestsContext.js';

// Figma "JL 03.5 Request Case Access": asks the case's lawyer for access to a restricted case.
export default function RequestAccessDialog({ caseItem, onSend, onClose }) {
  const [access, setAccess] = useState(ACCESS_TYPES[0].value);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!reason.trim()) {
      setError('Explain why you need access to this case.');
      return;
    }
    onSend({ caseId: caseItem.id, assignedTo: caseItem.lawyer, access, reason: reason.trim() });
  };

  return (
    <Modal
      title="Request Case Access"
      subtitle={`${caseItem.lawyer} is responsible for this case and will review your request.`}
      size="md"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <dl className="grid grid-cols-[120px_1fr] gap-y-1.5 rounded-sm bg-bg-page px-4 py-3 text-caption">
          <dt className="text-text-secondary">Case Number</dt>
          <dd className="text-text-primary">{caseItem.id}</dd>
          <dt className="text-text-secondary">Case Type</dt>
          <dd className="text-text-primary">{caseItem.type}</dd>
          <dt className="text-text-secondary">Assigned Lawyer</dt>
          <dd className="text-text-primary">{caseItem.lawyer}</dd>
        </dl>
        <SelectField
          label="Access needed"
          placeholder="Select access"
          options={ACCESS_TYPES}
          value={access}
          onChange={(event) => setAccess(event.target.value)}
        />
        <TextAreaField
          label="Reason for request *"
          placeholder="Explain why you need access to this case..."
          rows={3}
          value={reason}
          error={error}
          onChange={(event) => {
            setReason(event.target.value);
            setError('');
          }}
        />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth={false}>
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
