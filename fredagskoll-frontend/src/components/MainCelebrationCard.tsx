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
import { UpcomingNotable } from '../features/upcoming/upcomingNotables';
import { formatShortSwedishDate } from '../dateUtils';
import { Mood } from '../mood';

type MainCelebrationCardProps = {
  categoryLabel: string | null;
  centerDate: string;
  celebration: CelebrationContent | null;
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
  mood: Mood;
  scoreLabel: string;
  nationalDayPanel: NationalDayPanel | null;
  onReroll: () => void;
  onStepDate: (days: number) => void;
  onToggleMobileSection: (section: MobileSectionKey) => void;
  text: (typeof appText)[Locale];
  themeDayCardNote: string;
  themeDayDisplayTitle: string | null;
  themeDayTitleEnding: string;
  upcomingNotables: UpcomingNotable[];
  visibleBlurb: string;
  displayThemeDays: string[];
  moodLabel: string;
  kicker: string;
};

export function MainCelebrationCard({
  categoryLabel,
  centerDate,
  celebration,
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
  mood,
  moodLabel,
  scoreLabel,
  nationalDayPanel,
  onReroll,
  onStepDate,
  onToggleMobileSection,
  text,
  themeDayCardNote,
  themeDayDisplayTitle,
  themeDayTitleEnding,
  upcomingNotables,
  visibleBlurb,
}: MainCelebrationCardProps) {
  const hasLongWordTitle = hasLongTitleWord(themeDayDisplayTitle ?? mainTitle);
  const celebrationSubtitle = celebration?.subtitle ?? null;

  return (
    <main ref={mainCardRef} className="app-panel celebration-card">
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
        <div className="card-kicker-metrics">
          {categoryLabel ? <span className="mood-pill mood-pill--category">{categoryLabel}</span> : null}
          <span className="mood-pill mood-pill--score">{scoreLabel}</span>
          <span className="mood-pill">{moodLabel}</span>
        </div>
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
        {currentBlurbs && !isAiBundleLoading ? (
          <button
            type="button"
            className="reroll-button"
            onClick={onReroll}
            disabled={isAiRerolling}
          >
            {text.reroll}
          </button>
        ) : null}
      </div>

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

      {upcomingNotables.length > 0 ? (
        <DisclosurePanel
          className="upcoming-card"
          isOpen={expandedSections.upcoming}
          onToggle={() => onToggleMobileSection('upcoming')}
          title={text.upcoming}
        >
          <div className="upcoming-list">
            {upcomingNotables.map((item) => (
              <article key={item.dateLabel} className="upcoming-item">
                <div className="upcoming-item-top">
                  <span className="upcoming-label">{item.label}</span>
                  <span className="upcoming-days">
                    {item.daysUntil === 1
                      ? text.upcomingTomorrow
                      : text.upcomingInDays(item.daysUntil)}
                  </span>
                </div>
                <p className="upcoming-title">{item.title}</p>
                <p className="upcoming-date">
                  {formatShortSwedishDate(item.date, locale)}
                </p>
                <p className="upcoming-note">{item.note}</p>
              </article>
            ))}
          </div>
        </DisclosurePanel>
      ) : null}
    </main>
  );
}
