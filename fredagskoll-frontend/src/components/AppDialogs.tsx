import React from 'react';
import { appText } from '../appText';
import { getImageCreditNote, imageCredits } from '../imageCredits';
import { Locale } from '../locale';
import { getImageCreditLabel } from '../appHelpers';
import { ContentPack } from '../contentPack';
import { releaseNotes } from '../releaseNotes';

type AppDialogsProps = {
  showImageCredits: boolean;
  showReleaseNotes: boolean;
  onCloseImageCredits: () => void;
  onCloseReleaseNotes: () => void;
  locale: Locale;
  contentPack: ContentPack;
};

export function AppDialogs({
  showImageCredits,
  showReleaseNotes,
  onCloseImageCredits,
  onCloseReleaseNotes,
  locale,
  contentPack,
}: AppDialogsProps) {
  const text = appText[locale];

  return (
    <>
      {showImageCredits ? (
        <div
          className="credits-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-credits-title"
        >
          <div className="credits-backdrop" aria-hidden="true" onClick={onCloseImageCredits} />
          <section className="credits-panel">
            <div className="credits-header">
              <div>
                <p className="eyebrow">{text.creditsEyebrow}</p>
                <h2 id="image-credits-title" className="credits-title">
                  {text.creditsTitle}
                </h2>
                <p className="credits-lede">{text.creditsLead}</p>
              </div>
              <button
                type="button"
                className="theme-toggle credits-close"
                onClick={onCloseImageCredits}
              >
                {text.close}
              </button>
            </div>

            <div className="credits-list">
              {imageCredits.map((credit) => (
                <article key={credit.slug} className="credits-item">
                  <p className="credits-item-title">
                    {getImageCreditLabel(credit.slug, locale, contentPack)}
                  </p>
                  <p className="credits-item-meta">
                    {text.creator}:{' '}
                    {credit.creatorUrl ? (
                      <a href={credit.creatorUrl} target="_blank" rel="noreferrer">
                        {credit.creator}
                      </a>
                    ) : (
                      credit.creator
                    )}
                  </p>
                  <p className="credits-item-meta">
                    {text.license}:{' '}
                    {credit.licenseUrl ? (
                      <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                        {credit.licenseName}
                      </a>
                    ) : (
                      credit.licenseName
                    )}
                  </p>
                  <p className="credits-item-meta">
                    {text.source}:{' '}
                    <a href={credit.sourceUrl} target="_blank" rel="noreferrer">
                      {text.commonsFilePage}
                    </a>
                  </p>
                  {credit.note ? (
                    <p className="credits-item-note">{getImageCreditNote(credit.note, locale)}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {showReleaseNotes ? (
        <div
          className="credits-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="release-notes-title"
        >
          <div className="credits-backdrop" aria-hidden="true" onClick={onCloseReleaseNotes} />
          <section className="credits-panel">
            <div className="credits-header">
              <div>
                <p className="eyebrow">{text.releaseNotesLabel}</p>
                <h2 id="release-notes-title" className="credits-title">
                  {text.releaseNotesTitle}
                </h2>
              </div>
              <button
                type="button"
                className="theme-toggle credits-close"
                onClick={onCloseReleaseNotes}
              >
                {text.close}
              </button>
            </div>

            <div className="release-notes-list">
              {releaseNotes.map((note) => (
                <article key={note.version} className="credits-item release-note-item">
                  <p className="release-note-version">v{note.version}</p>
                  <p className="credits-item-meta">{note.summary[locale]}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
