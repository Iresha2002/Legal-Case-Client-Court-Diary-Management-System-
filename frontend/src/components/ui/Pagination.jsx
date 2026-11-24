import { ChevronLeft, ChevronRight } from 'lucide-react';

const MAX_BUTTONS = 5;

const buttonClass =
  'flex size-8 items-center justify-center rounded-sm border text-caption font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

// Figma table pagination: ‹ 1 2 3 4 5 ›. Shows at most 5 page numbers around the current page.
export default function Pagination({ page, pageCount, onChange }) {
  const first = Math.min(Math.max(page - 2, 1), Math.max(pageCount - MAX_BUTTONS + 1, 1));
  const pages = Array.from({ length: Math.min(MAX_BUTTONS, pageCount) }, (_, i) => first + i);

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${buttonClass} border-border-default bg-bg-surface text-text-primary hover:bg-bg-page`}
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
          className={`${buttonClass} ${
            number === page
              ? 'border-action-primary bg-action-primary text-text-inverse'
              : 'border-border-default bg-bg-surface text-text-primary hover:bg-bg-page'
          }`}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        className={`${buttonClass} border-border-default bg-bg-surface text-text-primary hover:bg-bg-page`}
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
