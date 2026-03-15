import React from 'react';
import { buildInfo } from '../buildInfo.generated';
import { appText } from '../appText';
import { Locale } from '../locale';
import { getReleaseNote } from '../releaseNotes';

type MainFooterMetaProps = {
  buildStamp: string;
  locale: Locale;
  onOpenImageCredits: () => void;
  onOpenReleaseNotes: () => void;
};

export function MainFooterMeta({
  buildStamp,
  locale,
  onOpenImageCredits,
  onOpenReleaseNotes,
}: MainFooterMetaProps) {
  const text = appText[locale];
  const currentReleaseNote = getReleaseNote(buildInfo.version);

  return (
    <footer className="app-panel main-footer-meta">
      <div className="main-footer-links">
        <button
          type="button"
          className="source-link source-link--button"
          onClick={onOpenImageCredits}
        >
          {text.imageCredits}
        </button>
        <a
          className="source-link"
          href="https://temadagar.se/kalender/"
          target="_blank"
          rel="noreferrer"
        >
          {text.themeDaySource}
        </a>
        <a
          className="source-link"
          href="https://sholiday.faboul.se/"
          target="_blank"
          rel="noreferrer"
        >
          {text.namedaySource}
        </a>
      </div>
      <div className="release-note-card release-note-card--subtle main-release-note-card">
        <p className="eyebrow">{text.releaseNotesLabel}</p>
        <p className="release-note-current">
          {currentReleaseNote?.shortSummary[locale] ?? buildStamp}
        </p>
        <button
          type="button"
          className="source-link source-link--button release-note-button"
          onClick={onOpenReleaseNotes}
        >
          {text.releaseNotesOpen}
        </button>
      </div>
      <span className="build-stamp">
        {text.buildInfoLabel} {buildStamp}
      </span>
    </footer>
  );
}
