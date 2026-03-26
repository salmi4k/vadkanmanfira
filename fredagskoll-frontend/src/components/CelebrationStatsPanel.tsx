import React from 'react';
import { Locale } from '../locale';
import { appText } from '../appText';
import { CelebrationStats } from '../features/shareability/celebrationStats';

type CelebrationStatsPanelProps = {
  locale: Locale;
  stats: CelebrationStats;
};

export function CelebrationStatsPanel({ locale, stats }: CelebrationStatsPanelProps) {
  const text = appText[locale];

  return (
    <section className="celebration-stats-panel app-panel" aria-label={text.celebrationStatsTitle}>
      <p className="eyebrow">{text.celebrationStatsLabel}</p>
      <h3 className="mini-panel-title">{text.celebrationStatsTitle}</h3>
      <p className="stats-summary">{text.celebrationStatsTotalDays(stats.totalCelebrationDays)}</p>
      <p className="stats-summary">
        {text.celebrationStatsBusiestMonth(stats.busiestMonthLabel, stats.busiestMonthCount)}
      </p>
      <p className="stats-summary">
        {text.celebrationStatsTopCategory(stats.topCategoryLabel, stats.topCategoryCount)}
      </p>
      <div className="stats-top-dates">
        <p className="stats-top-dates-label">{text.celebrationStatsTopDates}</p>
        <ul className="stats-top-dates-list">
          {stats.topDates.map((item) => (
            <li key={`${item.dateLabel}-${item.label}`}>
              <strong>{item.label}</strong>
              <span>{`${item.dateLabel} · ${item.score}/100`}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
