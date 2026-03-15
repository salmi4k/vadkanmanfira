import React from 'react';
import { FikaSuggestion } from '../features/engagement/engagement';

type EngagementPanelProps = {
  categoryLabel: string | null;
  scoreLabel: string;
  fikaSuggestion: FikaSuggestion;
};

export function EngagementPanel({
  categoryLabel,
  fikaSuggestion,
  scoreLabel,
}: EngagementPanelProps) {
  return (
    <section className="engagement-panel" aria-label={fikaSuggestion.label}>
      <div className="engagement-metrics" aria-label={scoreLabel}>
        {categoryLabel ? (
          <span className="engagement-chip engagement-chip--category">{categoryLabel}</span>
        ) : null}
        <span className="engagement-chip engagement-chip--score">{scoreLabel}</span>
      </div>

      <div className="fika-card">
        <p className="eyebrow">{fikaSuggestion.label}</p>
        <p className="fika-item">{fikaSuggestion.item}</p>
        <p className="fika-score">{`${fikaSuggestion.score}/10`}</p>
        <p className="fika-note">{fikaSuggestion.note}</p>
      </div>
    </section>
  );
}
