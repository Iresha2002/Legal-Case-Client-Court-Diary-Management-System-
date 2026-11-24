import { useRef, useState } from 'react';
import { CloudUpload, FileText, X } from 'lucide-react';
import Button from '../../../../components/ui/Button.jsx';
import Modal from '../../../../components/ui/Modal.jsx';
import SelectField from '../../../../components/ui/SelectField.jsx';
import TextAreaField from '../../../../components/ui/TextAreaField.jsx';
import TextField from '../../../../components/ui/TextField.jsx';
import { formatDate, formatFileSize, toDateValue } from '../../../../utils/format.js';
import { DOCUMENT_TYPES } from '../caseOptions.js';
import { NO_FILE_TITLE } from './detailsHelpers.js';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function extensionOf(fileName) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

// Checks a chosen file and returns an error message, or '' when it is fine.
function checkFile(file) {
  if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) return 'Choose a PDF, DOC, DOCX, JPG or PNG file.';
  if (file.size > MAX_FILE_BYTES) return 'The file is larger than 10 MB.';
  return '';
}

// Figma "Click to upload or drag and drop" box.
function FileDrop({ file, error, onSelect, onRemove }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-sm border border-border-default px-4 py-3">
        <FileText size={20} className="shrink-0 text-text-secondary" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-body text-text-primary">{file.name}</span>
          <span className="text-caption text-text-secondary">{formatFileSize(file.size)}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove file"
          className="rounded-sm p-1.5 text-text-primary hover:bg-bg-page"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files[0]) onSelect(event.dataTransfer.files[0]);
        }}
        aria-describedby={error ? 'upload-error' : undefined}
        className={`flex flex-col items-center gap-2 rounded-sm border border-dashed px-4 py-6 text-center transition-colors ${
          dragging ? 'border-border-strong bg-border-default' : 'bg-bg-page'
        } ${error ? 'border-red-600' : 'border-border-default'}`}
      >
        <CloudUpload size={24} className="text-text-primary" aria-hidden="true" />
        <span className="text-body text-text-secondary">
          <span className="font-medium text-text-primary">Click to upload</span> or drag and drop
        </span>
        <span className="text-caption text-text-secondary">PDF, DOC, DOCX, JPG, PNG (Max 10 MB)</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        className="hidden"
        onChange={(event) => {
          if (event.target.files[0]) onSelect(event.target.files[0]);
          event.target.value = ''; // so choosing the same file again still fires onChange
        }}
      />
      {error && (
        <p id="upload-error" className="text-caption text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// Figma "JL 03.4 Add Legal Document". Until the backend stores files, the chosen file is kept
// in browser memory, so it can be viewed and downloaded in this session only.
export function AddDocumentDialog({ caseItem, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', type: '', date: toDateValue(), description: '' });
  const [file, setFile] = useState(null);
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

  const handleSelect = (chosen) => {
    const problem = checkFile(chosen);
    setErrors((current) => ({ ...current, file: problem || undefined }));
    if (problem) return;
    setFile(chosen);
    // Suggest the file name (without its extension) when no name has been typed yet.
    setForm((current) => (current.name ? current : { ...current, name: chosen.name.replace(/\.[^.]+$/, '') }));
    setErrors((current) => ({ ...current, name: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = 'Enter a document name.';
    if (!form.type) found.type = 'Select a document type.';
    if (!file) found.file = 'Choose a file to upload.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const extension = extensionOf(file.name);
    const name = extensionOf(form.name.trim()) === extension ? form.name.trim() : `${form.name.trim()}.${extension}`;
    onSave({
      name,
      type: form.type,
      size: formatFileSize(file.size),
      uploadedOn: form.date || toDateValue(),
      description: form.description.trim(),
      url: URL.createObjectURL(file),
      mimeType: file.type,
    });
  };

  return (
    <Modal title="Add Legal Document" subtitle="Upload a new document related to this case." onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex items-center gap-4 rounded-sm bg-bg-page px-4 py-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-border-default">
            <FileText size={20} aria-hidden="true" />
          </span>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-caption">
            <dt className="text-text-secondary">Case Number</dt>
            <dd className="text-text-primary">{caseItem.id}</dd>
            <dt className="text-text-secondary">Case Title</dt>
            <dd className="text-text-primary">{caseItem.title || '—'}</dd>
            <dt className="text-text-secondary">Client</dt>
            <dd className="text-text-primary">{caseItem.clientName}</dd>
          </dl>
        </div>

        <TextField label="Document Name *" placeholder="Enter document name..." {...field('name')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Document Type *"
            placeholder="Select document type..."
            options={DOCUMENT_TYPES}
            {...field('type')}
          />
          <TextField label="Document Date" type="date" {...field('date')} />
        </div>
        <TextAreaField
          label="Description (Optional)"
          placeholder="Enter a short description about this document..."
          rows={2}
          {...field('description')}
        />
        <div className="flex flex-col gap-2">
          <span className="text-body font-medium text-text-primary">Upload File *</span>
          <FileDrop
            file={file}
            error={errors.file}
            onSelect={handleSelect}
            onRemove={() => setFile(null)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth={false}>
            Upload Document
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Preview({ doc }) {
  if (doc.url && doc.mimeType?.startsWith('image/')) {
    return <img src={doc.url} alt={doc.name} className="max-h-[420px] w-full rounded-sm object-contain" />;
  }
  if (doc.url && doc.mimeType === 'application/pdf') {
    return <iframe src={doc.url} title={doc.name} className="h-[420px] w-full rounded-sm border-0" />;
  }
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
      <FileText size={40} strokeWidth={1.25} className="text-text-secondary" aria-hidden="true" />
      <p className="text-body font-medium text-text-primary">Document preview</p>
      <p className="text-caption text-text-secondary">
        {doc.url ? 'Preview is not available for this file type. Download it to open.' : NO_FILE_TITLE}
      </p>
    </div>
  );
}

// Figma "JL 03.2m View Document".
export function ViewDocumentDialog({ doc, onClose }) {
  return (
    <Modal
      title={doc.name}
      subtitle={`${doc.size}  |  ${doc.type}  |  Uploaded ${formatDate(doc.uploadedOn, { short: true })}`}
      onClose={onClose}
    >
      <div className="rounded-sm bg-bg-page">
        <Preview doc={doc} />
      </div>
      <div className="flex justify-end gap-3">
        {doc.url ? (
          <a
            href={doc.url}
            download={doc.name}
            className="flex items-center justify-center rounded-sm border border-border-strong bg-bg-surface px-5 py-3 text-body font-medium text-text-primary hover:bg-neutral-100"
          >
            Download
          </a>
        ) : (
          <Button type="button" variant="secondary" fullWidth={false} disabled title={NO_FILE_TITLE}>
            Download
          </Button>
        )}
        <Button type="button" fullWidth={false} onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
