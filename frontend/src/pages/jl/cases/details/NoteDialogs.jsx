import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Badge from '../../../../components/ui/Badge.jsx';
import Button from '../../../../components/ui/Button.jsx';
import Modal from '../../../../components/ui/Modal.jsx';
import SelectField from '../../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../../components/ui/TextAreaField.jsx';
import TextField from '../../../../components/ui/TextField.jsx';
import { formatDate, toDateValue } from '../../../../utils/format.js';
import { NOTE_TAGS } from '../caseOptions.js';

// Figma "JL 03.3 Add Diary Note".
// Figma shows a formatting toolbar (bold, lists, links); this first version uses plain text.
export function AddNoteDialog({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', date: toDateValue(), tag: '', content: '' });
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
    if (!form.title.trim()) found.title = 'Enter a note title.';
    if (!form.date) found.date = 'Choose a date.';
    if (!form.content.trim()) found.content = 'Write the note.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ ...form, title: form.title.trim(), content: form.content.trim() });
  };

  return (
    <Modal
      title="Add Diary Note"
      subtitle="Add a new note related to this case. Keep it clear, detailed, and organized."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <TextField label="Note Title *" placeholder="Enter note title..." {...field('title')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Date *" type="date" {...field('date')} />
          <SelectField label="Tags" placeholder="Select tag..." options={NOTE_TAGS} {...field('tag')} />
        </div>
        <TextAreaField label="Note Content *" placeholder="Write your note here..." rows={6} {...field('content')} />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth={false}>
            Save Note
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Figma "JL 03.2d - 03.2f View Diary Note".
export function ViewNoteDialog({ note, caseId, onDelete, onClose }) {
  return (
    <Modal title={note.title} subtitle={formatDate(note.date)} size="md" onClose={onClose}>
      <div className="flex flex-wrap items-center gap-3 text-caption text-text-secondary">
        {note.tag && (
          <span className="flex items-center gap-2">
            Tag <Badge>{note.tag}</Badge>
          </span>
        )}
        <span>Case {caseId}</span>
      </div>
      <p className="rounded-sm bg-bg-page px-4 py-3 text-body whitespace-pre-line text-text-primary">{note.content}</p>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" fullWidth={false} onClick={onDelete}>
          Delete
        </Button>
        <Button type="button" fullWidth={false} onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

// Figma "JL 03.2g - 03.2i Delete Diary Note".
export function DeleteNoteDialog({ note, onConfirm, onClose }) {
  return (
    <Modal
      title="Delete this diary note?"
      icon={<Trash2 size={18} />}
      size="sm"
      showClose={false}
      onClose={onClose}
    >
      <p className="text-body text-text-secondary">
        &quot;{note.title}&quot; will be permanently removed from this case. This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" fullWidth={false} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
