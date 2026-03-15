import React from 'react';
import mojoLogo from '../mojo-logo.png';
import publicLogo from '../vkmf-logo-public.png';
import { appText } from '../appText';
import { ContentPack, showsTeamBranding } from '../contentPack';
import { formatShortSwedishDate } from '../dateUtils';
import { formatDaysUntilLabel, getUpcomingHolidayBlurb } from '../holidayPresentation';
import { joinWithConjunction, Locale, localeOptions } from '../locale';
import { getMoodLabel, getMoodNote, Mood, moodOptions } from '../mood';
import { getReleaseNote } from '../releaseNotes';
import { MobileSectionKey } from '../appTypes';
import { DisclosurePanel } from './DisclosurePanel';
import { MobileSection } from './MobileSection';

type SeasonalNote = {
  id: string;
  label: string;
  meta: string;
  title: string;
  note: string;
};

type UpcomingNote = {
  dateLabel: string;
  label: string;
  daysUntil: number;
  title: string;
  date: Date;
  note: string;
};

type IntroPanelProps = {
  locale: Locale;
  darkMode: boolean;
  contentPack: ContentPack;
  buildStamp: string;
  mood: Mood;
  selectedDate: string;
  humanDate: string;
  dateLabel: string;
  nameDayState: 'loading' | 'ready' | 'error';
  nameDays: string[];
  upcomingHolidayName: string | null;
  upcomingHolidayDate?: Date;
  daysUntilHoliday: number | null;
  seasonalNotes: SeasonalNote[];
  upcomingNotables: UpcomingNote[];
  isMobileLayout: boolean;
  showLanguageMenu: boolean;
  expandedSections: Record<MobileSectionKey, boolean>;
  currentReleaseVersion: string;
  onToggleLanguageMenu: () => void;
  onToggleDarkMode: () => void;
  onSelectLocale: (locale: Locale) => void;
  onSelectMood: (mood: Mood) => void;
  onDateChange: (date: string) => void;
  onToggleMobileSection: (section: MobileSectionKey) => void;
  onOpenImageCredits: () => void;
  onOpenReleaseNotes: () => void;
};

export function IntroPanel({
  locale,
  darkMode,
  contentPack,
  buildStamp,
  mood,
  selectedDate,
  humanDate,
  dateLabel,
  nameDayState,
  nameDays,
  upcomingHolidayName,
  upcomingHolidayDate,
  daysUntilHoliday,
  seasonalNotes,
  upcomingNotables,
  isMobileLayout,
  showLanguageMenu,
  expandedSections,
  currentReleaseVersion,
  onToggleLanguageMenu,
  onToggleDarkMode,
  onSelectLocale,
  onSelectMood,
  onDateChange,
  onToggleMobileSection,
  onOpenImageCredits,
  onOpenReleaseNotes,
}: IntroPanelProps) {
  const text = appText[locale];
  const currentReleaseNote = getReleaseNote(currentReleaseVersion);

  return (
    <header className="app-panel app-panel--intro">
      <div className="intro-controls">
        <div className="language-control">
          <button
            type="button"
            className="theme-toggle theme-toggle--language"
            aria-haspopup="menu"
            aria-expanded={showLanguageMenu}
            aria-label={text.languageMenuLabel}
            onClick={onToggleLanguageMenu}
          >
            <span className="language-toggle-flag" aria-hidden="true">
              {localeOptions.find((option) => option.value === locale)?.flag}
            </span>
            <span className="language-toggle-code" aria-hidden="true">
              {localeOptions.find((option) => option.value === locale)?.shortLabel}
            </span>
          </button>
          {showLanguageMenu ? (
            <div className="language-menu" role="menu" aria-label={text.languageMenuLabel}>
              {localeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={locale === option.value}
                  className={`language-option${
                    locale === option.value ? ' language-option--active' : ''
                  }`}
                  onClick={() => onSelectLocale(option.value)}
                >
                  <span className="language-option-flag" aria-hidden="true">
                    {option.flag}
                  </span>
                  <span className="language-option-text">{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button type="button" className="theme-toggle" onClick={onToggleDarkMode}>
          {darkMode ? text.lightMode : text.darkMode}
        </button>
      </div>

      <div className={`brand-block${showsTeamBranding(contentPack) ? '' : ' brand-block--text-only'}`}>
        {showsTeamBranding(contentPack) ? (
          <img src={mojoLogo} alt="Mojo Logo" className="brand-logo" />
        ) : (
          <div className="brand-mark" aria-label="VKMF">
            <img src={publicLogo} alt="VKMF emblem" className="brand-logo brand-logo--public" />
            <span className="brand-mark-label">VKMF</span>
          </div>
        )}
        <div className="brand-copy">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 className="brand-title">{text.title}</h1>
          <p className="brand-lede">{text.lede}</p>
        </div>
      </div>

      <label htmlFor="date-picker" className="picker-label">
        {text.pickDate}
      </label>
      <div className="picker-shell">
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          className="date-picker"
        />
        <div className="picker-meta">
          <span>{humanDate}</span>
          <span>{dateLabel}</span>
        </div>
      </div>

      <label htmlFor="mood-picker" className="picker-label">
        {text.moodLabel}
      </label>
      <div className="picker-shell picker-shell--mood">
        <select
          id="mood-picker"
          value={mood}
          onChange={(event) => onSelectMood(event.target.value as Mood)}
          className="date-picker mood-picker"
        >
          {moodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {getMoodLabel(option.value, locale)}
            </option>
          ))}
        </select>
        <p className="mood-note">{getMoodNote(mood, locale)}</p>
      </div>

      <div className="nameday-card">
        <p className="eyebrow">{text.nameday}</p>
        {nameDayState === 'loading' ? <p className="nameday-text">{text.namedayLoading}</p> : null}
        {nameDayState === 'error' ? <p className="nameday-text">{text.namedayError}</p> : null}
        {nameDayState === 'ready' && nameDays.length > 0 ? (
          <p className="nameday-text">{joinWithConjunction(nameDays, locale)}</p>
        ) : null}
        {nameDayState === 'ready' && nameDays.length === 0 ? (
          <p className="nameday-text">{text.namedayNone}</p>
        ) : null}
      </div>

      {upcomingHolidayName && upcomingHolidayDate && daysUntilHoliday !== null ? (
        <MobileSection
          isMobile={isMobileLayout}
          expanded={expandedSections.holiday}
          onToggle={() => onToggleMobileSection('holiday')}
          summary={text.mobileWeeklyHolidaySummary}
        >
          <div className="holiday-card">
            <p className="eyebrow">{text.weeklyHoliday}</p>
            <p className="holiday-title">{upcomingHolidayName}</p>
            <p className="nameday-text">
              {getUpcomingHolidayBlurb(upcomingHolidayName, daysUntilHoliday, locale)}
            </p>
            <p className="holiday-meta">
              {formatDaysUntilLabel(daysUntilHoliday, locale)} {text.untilLabel}{' '}
              {formatShortSwedishDate(upcomingHolidayDate, locale)}.
            </p>
          </div>
        </MobileSection>
      ) : null}

      {seasonalNotes.length > 0 ? (
        <MobileSection
          isMobile={isMobileLayout}
          expanded={expandedSections.season}
          onToggle={() => onToggleMobileSection('season')}
          summary={text.mobileSeasonSummary(seasonalNotes.length)}
        >
          <div className="season-card">
            <p className="eyebrow">{text.nowCard}</p>
            <div className="season-list">
              {seasonalNotes.map((item) => (
                <article key={item.id} className="season-item">
                  <div className="season-item-top">
                    <span className="season-label">{item.label}</span>
                    <span className="season-meta">{item.meta}</span>
                  </div>
                  <p className="season-title">{item.title}</p>
                  <p className="nameday-text">{item.note}</p>
                </article>
              ))}
            </div>
          </div>
        </MobileSection>
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
                <p className="upcoming-date">{formatShortSwedishDate(item.date, locale)}</p>
                <p className="upcoming-note">{item.note}</p>
              </article>
            ))}
          </div>
        </DisclosurePanel>
      ) : null}

      <footer className="intro-footer">
        <div className="intro-footer-links">
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
          <span className="build-stamp">
            {text.buildInfoLabel} {buildStamp}
          </span>
        </div>
        <div className="release-note-card release-note-card--subtle">
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
      </footer>
    </header>
  );
}
