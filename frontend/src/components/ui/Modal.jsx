import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-[360px]',
  md: 'max-w-[460px]',
  lg: 'max-w-[560px]',
};

// Figma dialog: dark overlay, white panel, title, optional subtitle and an × button.
// Closes on Escape, the × button or a click on the overlay. While open, the page behind
// does not scroll; when it closes, focus goes back to the button that opened it.
// `icon` is shown above the title (used by the delete confirmation).
export default function Modal({ title, subtitle, icon, size = 'lg', showClose = true, onClose, children }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[calc(100vh-32px)] w-full flex-col gap-5 overflow-y-auto rounded-md bg-bg-surface p-6 shadow-raised outline-none ${SIZES[size]}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {icon && (
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-border-default text-text-primary">
                {icon}
              </span>
            )}
            <h2 id={titleId} className="text-[18px] leading-[26px] font-semibold text-text-primary">
              {title}
            </h2>
            {subtitle && <p className="text-caption text-text-secondary">{subtitle}</p>}
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border-default text-text-primary hover:bg-bg-page"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
