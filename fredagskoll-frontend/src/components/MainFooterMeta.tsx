import React from 'react';
import { appText } from '../appText';
import { Locale } from '../locale';

type MainFooterMetaProps = {
  locale: Locale;
  onOpenImageCredits: () => void;
  onOpenReleaseNotes: () => void;
};

export function MainFooterMeta({
  locale,
  onOpenImageCredits,
  onOpenReleaseNotes,
}: MainFooterMetaProps) {
  const text = appText[locale];

  return (
    <footer className="app-panel main-footer-meta">
      <p className="main-footer-copy">{text.creditsLead}</p>
      <div className="main-footer-actions">
        <button
          type="button"
          className="source-link source-link--button"
          onClick={onOpenImageCredits}
        >
          {text.imageCredits}
        </button>
        <button
          type="button"
          className="source-link source-link--button"
          onClick={onOpenReleaseNotes}
        >
          {text.releaseNotesOpen}
        </button>
      </div>
    </footer>
  );
}
