import React, { useState } from 'react';
import { Locale } from '../locale';
import { appText } from '../appText';
import {
  ShareableCelebration,
  copyShareLink,
  shareCelebration,
} from '../features/shareability/shareability';

type SharePanelProps = {
  locale: Locale;
  shareable: ShareableCelebration | null;
};

export function SharePanel({ locale, shareable }: SharePanelProps) {
  const text = appText[locale];
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  if (!shareable) {
    return null;
  }

  async function handleShare() {
    const result = await shareCelebration(shareable);
    if (result === 'unsupported') {
      await handleCopy();
    }
  }

  async function handleCopy() {
    const copied = await copyShareLink(shareable.shareUrl);
    if (copied) {
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    }
  }

  return (
    <section className="share-panel app-panel" aria-label={text.shareLabel}>
      <p className="share-lead">
        {copyState === 'copied' ? text.shareCopied : text.shareLead}
      </p>
      <button type="button" className="share-button" onClick={() => void handleShare()}>
        {copyState === 'copied' ? text.shareCopied : text.shareOpen}
      </button>
      {copyState === 'copied' ? (
        <p className="share-toast" aria-live="polite">
          {text.shareCopied}
        </p>
      ) : null}
    </section>
  );
}
