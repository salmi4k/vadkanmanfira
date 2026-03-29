import React from 'react';
import { DisclosurePanel } from './DisclosurePanel';
import { Locale } from '../locale';
import { appText } from '../appText';
import {
  CelebrationContent,
} from '../features/celebrations/celebrations';
import {
  formatTitle,
  hasLongTitleWord,
} from '../features/celebrations/celebrationPresentation';
import {
  getAsIfThatWasNotEnough,
  getOrdinaryNoHitBody,
  getOrdinaryThemeDayLead,
} from '../editorialText';
import { joinWithAnd } from '../features/theme-days/themeDayBlurbs';
import { MobileSectionKey } from '../appTypes';
import { NationalDayPanel } from '../features/national-days/nationalDays';
import { Mood } from '../mood';
import { AiObservabilityState } from '../features/ai/aiObservability';

type MainCelebrationCardProps = {
  centerDate: string;
  celebration: CelebrationContent | null;
  canReroll: boolean;
  compactPrimaryMedia: boolean;
  currentBlurbs: string[] | null;
  extraDisplayThemeDays: string[];
  extraThemeDayLead: string | null;
  expandedSections: Record<MobileSectionKey, boolean>;
  hasThemeDays: boolean;
  isAiBundleLoading: boolean;
  isAiRerolling: boolean;
  locale: Locale;
  mainCardRef: React.RefObject<HTMLElement | null>;
  mainTitle: string;
  nationalDayPanel: NationalDayPanel | null;
  observability: AiObservabilityState | null;
  onReroll: () => void;
  onStepDate: (days: number) => void;
  onToggleMobileSection: (section: MobileSectionKey) => void;
  text: (typeof appText)[Locale];
  themeDayCardNote: string;
  themeDayDisplayTitle: string | null;
  themeDayTitleEnding: string;
  visibleBlurb: string;
  displayThemeDays: string[];
  kicker: string;
};

export function MainCelebrationCard({
  centerDate,
  celebration,
  canReroll,
  compactPrimaryMedia,
  currentBlurbs,
  displayThemeDays,
  expandedSections,
  extraDisplayThemeDays,
  extraThemeDayLead,
  hasThemeDays,
  isAiBundleLoading,
  isAiRerolling,
  kicker,
  locale,
  mainCardRef,
  mainTitle,
  nationalDayPanel,
  observability,
  onReroll,
  onStepDate,
  onToggleMobileSection,
  text,
  themeDayCardNote,
  themeDayDisplayTitle,
  themeDayTitleEnding,
  visibleBlurb,
}: MainCelebrationCardProps) {
  const hasLongWordTitle = hasLongTitleWord(themeDayDisplayTitle ?? mainTitle);
  const celebrationSubtitle = celebration?.subtitle ?? null;
  const mood: Mood = 'warm';
  const hasCeremonialDay = celebration !== null;
  const resolvedSourceLabel =
    !observability || observability.resolvedSource.status === 'loading'
      ? text.aiObservabilitySourceLoading
      : observability.resolvedSource.source === 'azure-openai'
        ? text.aiObservabilitySourceAI
        : observability.resolvedSource.source === 'cache'
          ? text.aiObservabilitySourceCache
          : observability.resolvedSource.source === 'fallback'
            ? text.aiObservabilitySourceFallback
            : text.aiObservabilitySourceUnknown;
  const rerollOutcomeLabel =
    !observability || observability.rerollOutcome.status === 'idle'
      ? text.aiObservabilityRerollUnknown
      : observability.rerollOutcome.status === 'loading'
        ? text.aiObservabilityRerollLoading
        : observability.rerollOutcome.status === 'fresh-ai'
          ? text.aiObservabilityRerollFresh
          : observability.rerollOutcome.status === 'reused-ai'
            ? text.aiObservabilityRerollReused
            : text.aiObservabilityRerollFallback;

  return (
    <main
      ref={mainCardRef}
      className={`app-panel celebration-card${hasCeremonialDay ? ' celebration-card--ceremonial' : ''}`}
    >
      <div className="card-nav" aria-label={text.dateNavigationAria}>
        <button
          type="button"
          className="card-nav-button"
          onClick={() => onStepDate(-1)}
        >
          {text.previousDay}
        </button>
        <p className="card-date">{centerDate}</p>
        <button
          type="button"
          className="card-nav-button"
          onClick={() => onStepDate(1)}
        >
          {text.nextDay}
        </button>
      </div>

      <div className="card-kicker-row">
        <p className="eyebrow">{kicker}</p>
      </div>

      {themeDayDisplayTitle && !celebration ? (
        <h2
          className={`celebration-title celebration-title--stacked${
            hasLongWordTitle ? ' celebration-title--longword' : ''
          }`}
        >
          {themeDayDisplayTitle}.
          <span className="celebration-title-subline">
            {isAiBundleLoading ? text.blurbLoading : themeDayTitleEnding}
          </span>
        </h2>
      ) : celebrationSubtitle ? (
        <h2
          className={`celebration-title celebration-title--stacked${
            hasLongWordTitle ? ' celebration-title--longword' : ''
          }`}
        >
          {formatTitle(mainTitle)}
          <span className="celebration-title-subline">{celebrationSubtitle}</span>
        </h2>
      ) : (
        <h2
          className={`celebration-title${
            hasLongWordTitle ? ' celebration-title--longword' : ''
          }`}
        >
          {formatTitle(mainTitle)}
        </h2>
      )}

      <div className="blurb-row">
        {isAiBundleLoading ? (
          <p className="celebration-blurb celebration-blurb--loading" aria-live="polite">
            {text.blurbLoading}
          </p>
        ) : (
          <p className="celebration-blurb">{visibleBlurb}</p>
        )}
        {canReroll && currentBlurbs && !isAiBundleLoading ? (
          <div className="reroll-actions">
            <button
              type="button"
              className="reroll-button"
              onClick={onReroll}
              disabled={isAiRerolling}
              aria-describedby={isAiRerolling ? 'reroll-status' : undefined}
            >
              {isAiRerolling ? text.rerollLoading : text.reroll}
            </button>
            {isAiRerolling ? (
              <p id="reroll-status" className="reroll-status" aria-live="polite">
                {text.rerollStatus}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {observability ? (
        <aside className="ai-observability" aria-label={text.aiObservabilityTitle}>
          <p className="ai-observability-line">
            <span className="ai-observability-label">{text.aiObservabilitySourceLabel}</span>
            <strong className="ai-observability-value">{resolvedSourceLabel}</strong>
          </p>
          <p
            className="ai-observability-line ai-observability-line--outcome"
            aria-live="polite"
          >
            <span className="ai-observability-label">{text.aiObservabilityRerollLabel}</span>
            <strong className="ai-observability-value">{rerollOutcomeLabel}</strong>
          </p>
        </aside>
      ) : null}

      {celebration ? (
        <>
          <div className="media-grid">
            {celebration.primaryImage ? (
              <figure
                className={`media-card media-card--primary${
                  compactPrimaryMedia ? ' media-card--compact' : ''
                }`}
              >
                <img
                  src={celebration.primaryImage}
                  alt={celebration.alt ?? celebration.title}
                />
              </figure>
            ) : null}
            {celebration.secondaryImage ? (
              <figure className="media-card">
                <img
                  src={celebration.secondaryImage}
                  alt={`${celebration.alt ?? celebration.title} extra`}
                />
              </figure>
            ) : null}
            {!celebration.primaryImage && !celebration.secondaryImage ? (
              <div className="placeholder-card placeholder-card--visual">
                <span>{celebration.visualBadge ?? text.noImageBadge}</span>
                <strong>{celebration.visualTitle ?? text.noImageTitle}</strong>
                <p>{celebration.visualBody ?? text.noImageBody}</p>
              </div>
            ) : null}
          </div>

          {extraDisplayThemeDays.length > 0 ? (
            <DisclosurePanel
              className="theme-day-panel"
              isOpen={expandedSections.extraThemeDays}
              onToggle={() => onToggleMobileSection('extraThemeDays')}
              badge={text.extraThemeDays}
              title={text.extraThemeDays}
            >
              <p>
                {getAsIfThatWasNotEnough(
                  locale,
                  mood,
                  extraThemeDayLead ?? '',
                  joinWithAnd(extraDisplayThemeDays, locale)
                )}
              </p>
              <ul className="theme-day-list">
                {extraDisplayThemeDays.map((themeDay) => (
                  <li key={themeDay}>{themeDay}</li>
                ))}
              </ul>
            </DisclosurePanel>
          ) : null}
        </>
      ) : (
        <DisclosurePanel
          className="ordinary-card"
          isOpen={!hasThemeDays || expandedSections.themeDays}
          onToggle={() => {
            if (hasThemeDays) {
              onToggleMobileSection('themeDays');
            }
          }}
          badge={hasThemeDays ? text.todayThemeDays : text.noHit}
          title={hasThemeDays ? text.todayThemeDays : text.noHit}
        >
          <p>
            {hasThemeDays && isAiBundleLoading
              ? text.blurbLoading
              : hasThemeDays
                ? getOrdinaryThemeDayLead(
                    locale,
                    mood,
                    joinWithAnd(displayThemeDays, locale),
                    themeDayCardNote
                  )
                : getOrdinaryNoHitBody(locale, mood)}
          </p>
          {hasThemeDays ? (
            <ul className="theme-day-list">
              {displayThemeDays.map((themeDay) => (
                <li key={themeDay}>{themeDay}</li>
              ))}
            </ul>
          ) : null}
        </DisclosurePanel>
      )}

      {nationalDayPanel ? (
        <DisclosurePanel
          className="world-day-panel"
          isOpen={expandedSections.worldNationalDays}
          onToggle={() => onToggleMobileSection('worldNationalDays')}
          badge={text.worldNationalDaysBadge}
          title={text.worldNationalDays}
        >
          <p className="world-day-summary">{nationalDayPanel.summary}</p>
          <ul className="theme-day-list world-day-list">
            {nationalDayPanel.items.map((item) => (
              <li key={`${item.nation}-${item.significance}`}>
                <strong>{item.nation}</strong>
                <span>{item.significance}</span>
              </li>
            ))}
          </ul>
          {nationalDayPanel.hiddenCount > 0 ? (
            <p className="world-day-more">
              {text.worldNationalDaysMore(nationalDayPanel.hiddenCount)}
            </p>
          ) : null}
        </DisclosurePanel>
      ) : null}

    </main>
  );
}
