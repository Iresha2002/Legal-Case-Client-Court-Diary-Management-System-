import { Download, Eye, FileText, Plus } from 'lucide-react';
import Badge from '../../../../components/ui/Badge.jsx';
import Button from '../../../../components/ui/Button.jsx';
import { NO_FILE_TITLE } from './detailsHelpers.js';

const iconButton =
  'inline-flex rounded-sm p-1.5 text-text-primary hover:bg-bg-page disabled:cursor-not-allowed disabled:opacity-40';

// Figma "Documents" card on Case Details: file name and size, type, view and download.
// Documents uploaded in this session have a `url` (the file in browser memory), so they can be
// opened and downloaded; the sample documents cannot.
export default function DocumentsCard({ documents, onAdd, onView }) {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-border-default bg-bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">Documents ({documents.length})</h2>
        <Button type="button" fullWidth={false} onClick={onAdd} className="print:hidden">
          <Plus size={16} aria-hidden="true" />
          Add Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <p className="text-body text-text-secondary">No documents uploaded yet.</p>
      ) : (
        <ul className="flex flex-col">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 border-b border-border-default py-3">
              <FileText size={22} strokeWidth={1.5} className="shrink-0 text-text-secondary" aria-hidden="true" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body text-text-primary" title={doc.name}>
                  {doc.name}
                </span>
                <span className="text-caption text-text-secondary">{doc.size}</span>
              </div>
              <Badge>{doc.type}</Badge>
              <div className="flex items-center gap-1 print:hidden">
                <button type="button" onClick={() => onView(doc)} aria-label={`View ${doc.name}`} className={iconButton}>
                  <Eye size={18} />
                </button>
                {doc.url ? (
                  <a href={doc.url} download={doc.name} aria-label={`Download ${doc.name}`} className={iconButton}>
                    <Download size={18} />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    title={NO_FILE_TITLE}
                    aria-label={`Download ${doc.name}`}
                    className={iconButton}
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
