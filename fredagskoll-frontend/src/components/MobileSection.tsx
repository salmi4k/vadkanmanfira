import React from 'react';

type MobileSectionProps = {
  isMobile: boolean;
  expanded: boolean;
  onToggle: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
};

export function MobileSection({
  isMobile,
  expanded,
  onToggle,
  summary,
  children,
}: MobileSectionProps) {
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <section className={`mobile-section${expanded ? ' mobile-section--open' : ''}`}>
      <button type="button" className="mobile-section-toggle" onClick={onToggle}>
        <span>{summary}</span>
        <span className="mobile-section-chevron" aria-hidden="true">
          {expanded ? '-' : '+'}
        </span>
      </button>
      {expanded ? <div className="mobile-section-content">{children}</div> : null}
    </section>
  );
}
