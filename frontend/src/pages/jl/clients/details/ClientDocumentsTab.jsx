import { Download, Eye, FileText, Trash2 } from 'lucide-react';
import Badge from '../../../../components/ui/Badge.jsx';
import Button from '../../../../components/ui/Button.jsx';
import Card from '../../../../components/ui/Card.jsx';
import { formatDate } from '../../../../utils/format.js';

const headerCell = 'px-4 py-3.5 text-left text-label font-semibold tracking-[0.06em] text-text-secondary';
const cell = 'px-4 py-3.5 text-body text-text-primary';
const iconButton = 'rounded-sm p-1.5 text-text-primary hover:bg-bg-page disabled:cursor-not-allowed disabled:opacity-40';

// Shown on buttons that need the backend document storage.
const NOT_READY = 'Available when document storage is connected';

// Figma "JL 02.4 Client Details - Documents". View, download and upload need the backend,
// so those buttons are disabled for now; delete removes the document from this page only.
export default function ClientDocumentsTab({ documents, onDelete }) {
  return (
    <Card
      title={`Documents (${documents.length})`}
      action={
        <Button type="button" fullWidth={false} disabled title={NOT_READY} className="print:hidden">
          + Add Document
        </Button>
      }
    >
      {documents.length === 0 ? (
        <p className="text-body text-text-secondary">No documents uploaded for this client.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead className="bg-bg-page">
              <tr>
                <th scope="col" className={headerCell}>DOCUMENT NAME</th>
                <th scope="col" className={headerCell}>TYPE</th>
                <th scope="col" className={headerCell}>UPLOADED ON</th>
                <th scope="col" className={headerCell}>UPLOADED BY</th>
                <th scope="col" className={`${headerCell} print:hidden`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border-default">
                  <td className={cell}>
                    <div className="flex items-center gap-3">
                      <FileText size={22} strokeWidth={1.5} className="shrink-0 text-text-secondary" aria-hidden="true" />
                      <div className="flex flex-col">
                        <span>{doc.name}</span>
                        <span className="text-caption text-text-secondary">{doc.size}</span>
                      </div>
                    </div>
                  </td>
                  <td className={cell}>
                    <Badge>{doc.type}</Badge>
                  </td>
                  <td className={cell}>{formatDate(doc.uploadedOn, { short: true })}</td>
                  <td className={cell}>{doc.uploadedBy}</td>
                  <td className={`${cell} print:hidden`}>
                    <div className="flex items-center gap-1">
                      <button type="button" disabled title={NOT_READY} aria-label={`View ${doc.name}`} className={iconButton}>
                        <Eye size={18} />
                      </button>
                      <button type="button" disabled title={NOT_READY} aria-label={`Download ${doc.name}`} className={iconButton}>
                        <Download size={18} />
                      </button>
                      <button type="button" onClick={() => onDelete(doc)} aria-label={`Delete ${doc.name}`} className={iconButton}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
