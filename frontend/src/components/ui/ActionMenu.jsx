import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

// Figma table row menu: a ⋮ button that opens a small list of actions.
// items: [{ label, icon, onSelect }]
//
// The menu uses fixed positioning under the button, so it is not cut off
// by tables that scroll sideways. It closes on outside click, Escape, scroll or resize.
export default function ActionMenu({ label, items }) {
  const [position, setPosition] = useState(null); // null = closed
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!position) return undefined;
    const close = () => setPosition(null);
    const handleClick = (event) => {
      if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) close();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [position]);

  const toggle = () => {
    if (position) {
      setPosition(null);
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={Boolean(position)}
        className="flex size-8 items-center justify-center rounded-sm border border-border-default bg-bg-surface text-text-primary hover:bg-bg-page"
      >
        <MoreVertical size={16} />
      </button>

      {position && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: position.top, right: position.right }}
          className="fixed z-30 min-w-[180px] rounded-md border border-border-default bg-bg-surface p-2 shadow-raised"
        >
          {items.map(({ label: itemLabel, icon: Icon, onSelect }) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              onClick={() => {
                setPosition(null);
                onSelect();
              }}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-body text-text-primary hover:bg-bg-page"
            >
              {Icon && <Icon size={18} aria-hidden="true" />}
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
