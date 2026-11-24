import { useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { CalendarDays, Copy, Mail, Phone, Printer } from 'lucide-react';
import ActionMenu from '../../../components/ui/ActionMenu.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import Breadcrumb from '../../../components/ui/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import Toast from '../../../components/ui/Toast.jsx';
import { clients } from '../../../mocks/mockClients.js';
import { formatDate, initials } from '../../../utils/format.js';
import CaseMessage from './CaseMessage.jsx';
import StatusMenu from './details/StatusMenu.jsx';
import HearingTimeline from './details/HearingTimeline.jsx';
import DiaryNotesCard from './details/DiaryNotesCard.jsx';
import DocumentsCard from './details/DocumentsCard.jsx';
import { AddNoteDialog, DeleteNoteDialog, ViewNoteDialog } from './details/NoteDialogs.jsx';
import { AddDocumentDialog, ViewDocumentDialog } from './details/DocumentDialogs.jsx';
import { HearingSummaryDialog, ScheduleHearingDialog } from './details/HearingDialogs.jsx';
import { nextId } from './details/detailsHelpers.js';

// One labelled value in the case summary and client cards.
function InfoItem({ label, children, className = '' }) {
  return (
    <div className={`flex min-w-0 flex-col justify-center gap-1.5 ${className}`}>
      <p className="text-caption text-text-secondary">{label}</p>
      <div className="text-body font-medium text-text-primary">{children}</div>
    </div>
  );
}

const dividedItem = 'lg:border-l lg:border-border-default lg:pl-6';

// Figma "JL 03.2 Case Details" and its dialogs (03.3, 03.4, 03.7, 03.9, 03.2a - 03.2m, 03.33 - 03.37).
export default function CaseDetailsPage() {
  const { caseId } = useParams();
  const { cases, updateCase, getDetails, updateDetails } = useOutletContext();
  const navigate = useNavigate();
  // Which dialog is open, e.g. { type: 'viewNote', note }. null = none.
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);

  const item = cases.find((c) => c.id === caseId);
  if (!item) return <CaseMessage title="Case not found" text="This case does not exist or has been removed." />;
  if (!item.assignedToMe) {
    return (
      <CaseMessage
        title="Access restricted"
        text="This case is not assigned to you. Use Request Access on the Cases page to ask for access."
      />
    );
  }

  const { hearings, notes, documents } = getDetails(item.id);
  const client = clients.find((c) => c.name === item.clientName);

  const showToast = (text) => setToast({ id: Date.now(), text });
  const closeDialog = () => setDialog(null);
  const update = (updater) => updateDetails(item.id, updater);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.id);
      showToast('Case number copied');
    } catch {
      showToast('Could not copy the case number');
    }
  };

  const handleStatusChange = (status) => {
    updateCase(item.id, { ...item, status });
    showToast(`Case status changed to ${status}`);
  };

  const saveNote = (values) => {
    update((d) => ({ ...d, notes: [...d.notes, { ...values, id: nextId(d.notes) }] }));
    closeDialog();
    showToast('Diary note added');
  };

  const deleteNote = (note) => {
    update((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== note.id) }));
    closeDialog();
    showToast('Diary note deleted');
  };

  const saveDocument = (values) => {
    update((d) => ({ ...d, documents: [{ ...values, id: nextId(d.documents) }, ...d.documents] }));
    closeDialog();
    showToast('Document uploaded');
  };

  const saveSummary = (hearing, summary) => {
    update((d) => ({
      ...d,
      hearings: d.hearings.map((h) => (h.id === hearing.id ? { ...h, summary, status: 'Completed' } : h)),
    }));
    closeDialog();
    showToast('Hearing summary saved');
  };

  const saveHearing = (values) => {
    update((d) => ({
      ...d,
      hearings: [...d.hearings, { ...values, id: nextId(d.hearings), status: 'Upcoming', summary: '' }],
    }));
    closeDialog();
    showToast('Hearing scheduled');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Breadcrumb backTo="/cases" items={[{ label: 'Cases', to: '/cases' }, { label: 'Case Details' }]} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] leading-[36px] font-bold text-text-primary">Case Details</h1>
          <div className="flex items-center gap-3 print:hidden">
            <StatusMenu status={item.status} onChange={handleStatusChange} />
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              onClick={() => navigate(`/cases/${item.id}/edit`)}
            >
              Edit Case
            </Button>
            {/* Figma shows a "More" button without its menu; Print is the only action for now. */}
            <ActionMenu
              label="More actions"
              items={[{ label: 'Print', icon: Printer, onSelect: () => window.print() }]}
            />
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 rounded-md border border-border-default bg-bg-surface px-6 py-5 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-1">
          <p className="text-caption text-text-secondary">Case No.</p>
          <div className="flex items-center gap-3">
            <p className="text-[28px] leading-[36px] font-bold text-text-primary">{item.id}</p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy case number"
              className="rounded-sm border border-border-default p-1.5 text-text-primary hover:bg-bg-page print:hidden"
            >
              <Copy size={16} />
            </button>
          </div>
          {item.title && <p className="text-body text-text-primary">{item.title}</p>}
        </div>
        <InfoItem label="Case Type" className={dividedItem}>
          <Badge>{item.type}</Badge>
        </InfoItem>
        <InfoItem label="Assigned Lawyer" className={dividedItem}>
          {item.lawyer}
        </InfoItem>
        <InfoItem label="Filing Date" className={dividedItem}>
          {item.filedOn ? (
            <span className="flex items-center gap-2">
              <CalendarDays size={16} aria-hidden="true" />
              {formatDate(item.filedOn, { short: true })}
            </span>
          ) : (
            '—'
          )}
        </InfoItem>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-md border border-border-default bg-bg-surface px-6 py-4 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-action-primary text-caption font-semibold text-text-inverse">
            {initials(item.clientName)}
          </span>
          <InfoItem label="Client Information">
            {client ? (
              <Link to={`/clients/${client.id}`} className="hover:underline">
                {item.clientName}
              </Link>
            ) : (
              item.clientName
            )}
          </InfoItem>
        </div>
        <div className="flex items-center gap-3 md:border-l md:border-border-default md:pl-6">
          <Mail size={18} className="shrink-0" aria-hidden="true" />
          <InfoItem label="Email">{client?.email || '—'}</InfoItem>
        </div>
        <div className="flex items-center gap-3 md:border-l md:border-border-default md:pl-6">
          <Phone size={18} className="shrink-0" aria-hidden="true" />
          <InfoItem label="Phone">{client?.contactNo || '—'}</InfoItem>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[634fr_436fr]">
        <HearingTimeline
          hearings={hearings}
          onAddSummary={(hearing, number) => setDialog({ type: 'summary', hearing, number })}
          onSchedule={() => setDialog({ type: 'schedule' })}
        />
        <div className="flex flex-col gap-5">
          <DiaryNotesCard
            notes={notes}
            onAdd={() => setDialog({ type: 'addNote' })}
            onView={(note) => setDialog({ type: 'viewNote', note })}
            onDelete={(note) => setDialog({ type: 'deleteNote', note })}
          />
          <DocumentsCard
            documents={documents}
            onAdd={() => setDialog({ type: 'addDocument' })}
            onView={(doc) => setDialog({ type: 'viewDocument', doc })}
          />
        </div>
      </div>

      {dialog?.type === 'addNote' && <AddNoteDialog onSave={saveNote} onClose={closeDialog} />}
      {dialog?.type === 'viewNote' && (
        <ViewNoteDialog
          note={dialog.note}
          caseId={item.id}
          onDelete={() => setDialog({ type: 'deleteNote', note: dialog.note })}
          onClose={closeDialog}
        />
      )}
      {dialog?.type === 'deleteNote' && (
        <DeleteNoteDialog note={dialog.note} onConfirm={() => deleteNote(dialog.note)} onClose={closeDialog} />
      )}
      {dialog?.type === 'addDocument' && (
        <AddDocumentDialog caseItem={item} onSave={saveDocument} onClose={closeDialog} />
      )}
      {dialog?.type === 'viewDocument' && <ViewDocumentDialog doc={dialog.doc} onClose={closeDialog} />}
      {dialog?.type === 'summary' && (
        <HearingSummaryDialog
          hearing={dialog.hearing}
          number={dialog.number}
          caseId={item.id}
          onSave={(summary) => saveSummary(dialog.hearing, summary)}
          onClose={closeDialog}
        />
      )}
      {dialog?.type === 'schedule' && (
        <ScheduleHearingDialog
          number={hearings.length + 1}
          caseId={item.id}
          previous={hearings[hearings.length - 1]}
          onSave={saveHearing}
          onClose={closeDialog}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.text} onDone={() => setToast(null)} />}
    </div>
  );
}
