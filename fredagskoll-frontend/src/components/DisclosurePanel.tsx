import React from 'react';

type DisclosurePanelProps = {
  className: string;
  isOpen: boolean;
  onToggle: () => void;
  title: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
};

export function DisclosurePanel({
  className,
  isOpen,
  onToggle,
  title,
  badge,
  children,
}: DisclosurePanelProps) {
  const hasDuplicateStringLabel =
    typeof badge === 'string' && typeof title === 'string' && badge === title;

  return (
    <section className={`${className} disclosure-panel${isOpen ? ' disclosure-panel--open' : ''}`}>
      <button
        type="button"
        className="disclosure-toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="disclosure-heading">
          {badge ? <span className="disclosure-badge">{badge}</span> : null}
          {!hasDuplicateStringLabel ? <span className="disclosure-title">{title}</span> : null}
        </span>
        <span className="disclosure-chevron" aria-hidden="true">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      {isOpen ? <div className="disclosure-content">{children}</div> : null}
    </section>
  );
}
