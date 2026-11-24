import { Eye, Plus, Trash2 } from 'lucide-react';
import ActionMenu from '../../../../components/ui/ActionMenu.jsx';
import Badge from '../../../../components/ui/Badge.jsx';
import Button from '../../../../components/ui/Button.jsx';
import { formatDate } from '../../../../utils/format.js';

// Figma "Diary Notes" card: newest note first, each with a date tile, tag and a View / Delete menu.
export default function DiaryNotesCard({ notes, onAdd, onView, onDelete }) {
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border-default bg-bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] leading-[26px] font-semibold text-text-primary">Diary Notes ({notes.length})</h2>
        <Button type="button" fullWidth={false} onClick={onAdd} className="print:hidden">
          <Plus size={16} aria-hidden="true" />
          Add Note
        </Button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-body text-text-secondary">No diary notes yet.</p>
      ) : (
        <ul className="flex flex-col">
          {sorted.map((note) => {
            const [day, month] = formatDate(note.date, { short: true }).split(' ');
            return (
              <li key={note.id} className="flex items-center gap-4 border-b border-border-default py-3">
                <span className="flex w-12 shrink-0 flex-col items-center rounded-sm bg-bg-page py-1.5">
                  <span className="text-body font-semibold text-text-primary">{day}</span>
                  <span className="text-caption text-text-secondary">{month}</span>
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                  <p className="text-body font-medium text-text-primary">{note.title}</p>
                  {note.tag && <Badge>{note.tag}</Badge>}
                </div>
                <div className="print:hidden">
                  <ActionMenu
                    label={`Actions for note ${note.title}`}
                    bordered={false}
                    items={[
                      { label: 'View', icon: Eye, onSelect: () => onView(note) },
                      { label: 'Delete', icon: Trash2, onSelect: () => onDelete(note) },
                    ]}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
