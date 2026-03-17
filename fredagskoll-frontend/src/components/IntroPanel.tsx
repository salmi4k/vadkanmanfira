import React from 'react';
import mojoLogo from '../mojo-logo.png';
import publicLogo from '../vkmf-logo-public.png';
import { appText } from '../appText';
import { ContentPack, showsTeamBranding } from '../contentPack';
import { formatShortSwedishDate } from '../dateUtils';
import { formatDaysUntilLabel, getUpcomingHolidayBlurb } from '../holidayPresentation';
import { joinWithConjunction, Locale, localeOptions } from '../locale';

type SeasonalNote = {
  id: string;
  label: string;
  meta: string;
  title: string;
  note: string;
};

type IntroPanelProps = {
  locale: Locale;
  contentPack: ContentPack;
  selectedDate: string;
  humanDate: string;
  dateLabel: string;
  nameDayState: 'loading' | 'ready' | 'error';
  nameDays: string[];
  upcomingHolidayName: string | null;
  upcomingHolidayDate?: Date;
  daysUntilHoliday: number | null;
  seasonalNotes: SeasonalNote[];
  showLanguageMenu: boolean;
  onToggleLanguageMenu: () => void;
  onSelectLocale: (locale: Locale) => void;
  onDateChange: (date: string) => void;
  onDateCommit: () => void;
  onSurpriseDate: () => void;
};

export function IntroPanel({
  locale,
  contentPack,
  selectedDate,
  humanDate,
  dateLabel,
  nameDayState,
  nameDays,
  upcomingHolidayName,
  upcomingHolidayDate,
  daysUntilHoliday,
  seasonalNotes,
  showLanguageMenu,
  onToggleLanguageMenu,
  onSelectLocale,
  onDateChange,
  onDateCommit,
  onSurpriseDate,
}: IntroPanelProps) {
  const text = appText[locale];
  const supportItems: Array<{ label: string; title: string; note: string }> = [];

  if (nameDayState === 'ready' && nameDays.length > 0) {
    supportItems.push({
      label: text.nameday,
      title: joinWithConjunction(nameDays, locale),
      note: humanDate,
    });
  }

  if (upcomingHolidayName && upcomingHolidayDate && daysUntilHoliday !== null) {
    supportItems.push({
      label: text.weeklyHoliday,
      title: upcomingHolidayName,
      note: `${formatDaysUntilLabel(daysUntilHoliday, locale)} ${text.untilLabel} ${formatShortSwedishDate(upcomingHolidayDate, locale)}.`,
    });
  }

  if (seasonalNotes.length > 0) {
    supportItems.push({
      label: text.nowCard,
      title: seasonalNotes[0].title,
      note: seasonalNotes[0].note,
    });
  }

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
          onBlur={onDateCommit}
          className="date-picker"
        />
        <div className="picker-meta">
          <span>{humanDate}</span>
          <span>{dateLabel}</span>
        </div>
      </div>
      <button type="button" className="surprise-button" onClick={onSurpriseDate}>
        {text.surpriseAction}
      </button>
      <p className="surprise-hint">{text.surpriseHint}</p>

      <section className="support-strip" aria-label={text.upcoming}>
        {nameDayState === 'loading' ? <p className="support-strip-empty">{text.namedayLoading}</p> : null}
        {nameDayState === 'error' ? <p className="support-strip-empty">{text.namedayError}</p> : null}
        {nameDayState === 'ready' && supportItems.length === 0 ? (
          <p className="support-strip-empty">{text.namedayNone}</p>
        ) : null}
        {supportItems.map((item) => (
          <article key={`${item.label}-${item.title}`} className="support-fact">
            <p className="support-fact-label">{item.label}</p>
            <p className="support-fact-title">{item.title}</p>
            <p className="support-fact-note">
              {item.label === text.weeklyHoliday && upcomingHolidayName && daysUntilHoliday !== null
                ? getUpcomingHolidayBlurb(upcomingHolidayName, daysUntilHoliday, locale)
                : item.note}
            </p>
          </article>
        ))}
      </section>

    </header>
  );
}
