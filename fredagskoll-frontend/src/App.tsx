import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import mojoLogo from './mojo-logo.png';
import {
  appText,
  ordinaryThemeDayCardNotesByLocale,
  ordinaryThemeDayTitleEndingsByLocale,
} from './appText';
import { usesCompactPrimaryMedia, formatTitle, hasLongTitleWord } from './celebrationPresentation';
import {
  getCelebrations,
  getCelebrationThemeAliases,
  getOrdinaryBlurb,
  getOrdinaryDayBlurbs,
} from './celebrations';
import {
  addDays,
  formatCenterDate,
  formatForHumans,
  formatForInput,
  formatShortSwedishDate,
  getDaysUntil,
} from './dateUtils';
import { DayType, getDayStatus, getUpcomingOfficialHolidayInWeek } from './dayLogic';
import { formatDaysUntilLabel, getUpcomingHolidayBlurb } from './holidayPresentation';
import { getImageCreditNote, imageCredits } from './imageCredits';
import {
  Locale,
  LOCALE_STORAGE_KEY,
  getInitialLocale,
  translateOfficialHolidayName,
  translateThemeDayName,
} from './locale';
import { fetchNameDays } from './nameDays';
import { getSeasonalNotes } from './seasonalNotes';
import { buildThemeDayBlurbs, filterThemeDays, joinWithAnd } from './themeDayBlurbs';
import { getThemeDaysForDate } from './temadagar';
import { getUpcomingNotables } from './upcomingNotables';

type AppProps = {
  initialDate?: Date;
};

type NameDayState = 'loading' | 'ready' | 'error';

const imageCreditDayTypes: Record<string, Exclude<DayType, 'ordinary'> | undefined> = {
  vaffeldagen: 'vaffeldagen',
  valborg: 'valborg',
  paskafton: 'paskafton',
  nationaldagen: 'nationaldagen',
  midsommarafton: 'midsommarafton',
  kanelbullensdag: 'kanelbullensdag',
  kladdkakansdag: 'kladdkakansdag',
  surstrommingspremiar: 'surstrommingspremiar',
  lucia: 'lucia',
  nyarsafton: 'nyarsafton',
};

function getRandomItem(options: string[], fallback: string, current?: string): string {
  if (options.length === 0) {
    return fallback;
  }

  if (options.length === 1) {
    return options[0];
  }

  const candidates = current ? options.filter((option) => option !== current) : options;
  const pool = candidates.length > 0 ? candidates : options;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function getImageCreditLabel(slug: string, locale: Locale): string {
  const dayType = imageCreditDayTypes[slug];
  if (!dayType) {
    return slug;
  }

  const aliases = getCelebrationThemeAliases(dayType, locale);
  return aliases[0] ?? slug;
}

function App({ initialDate = new Date() }: AppProps) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [darkMode, setDarkMode] = useState(false);
  const [showImageCredits, setShowImageCredits] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatForInput(initialDate));
  const [nameDays, setNameDays] = useState<string[]>([]);
  const [nameDayState, setNameDayState] = useState<NameDayState>('loading');
  const [blurb, setBlurb] = useState(getOrdinaryBlurb(getInitialLocale()));
  const [themeDayTitleEnding, setThemeDayTitleEnding] = useState(
    ordinaryThemeDayTitleEndingsByLocale[getInitialLocale()][0]
  );
  const [themeDayCardNote, setThemeDayCardNote] = useState(
    ordinaryThemeDayCardNotesByLocale[getInitialLocale()][0]
  );

  const text = appText[locale];
  const celebrations = useMemo(() => getCelebrations(locale), [locale]);
  const ordinaryBlurb = useMemo(() => getOrdinaryBlurb(locale), [locale]);
  const selectedDateObject = useMemo(
    () => new Date(`${selectedDate}T12:00:00`),
    [selectedDate]
  );
  const dayStatus = getDayStatus(selectedDateObject);
  const celebration =
    dayStatus.dayType === 'ordinary' ? null : celebrations[dayStatus.dayType];
  const themeDays = useMemo(
    () => getThemeDaysForDate(selectedDateObject),
    [selectedDateObject]
  );
  const visibleThemeDays = useMemo(() => {
    if (!celebration || dayStatus.dayType === 'ordinary') {
      return themeDays;
    }

    return filterThemeDays(themeDays, getCelebrationThemeAliases(dayStatus.dayType, locale));
  }, [celebration, dayStatus.dayType, locale, themeDays]);
  const displayThemeDays = useMemo(
    () => visibleThemeDays.map((themeDay) => translateThemeDayName(themeDay, locale)),
    [locale, visibleThemeDays]
  );
  const hasThemeDays = displayThemeDays.length > 0;
  const humanDate = formatForHumans(selectedDateObject, locale);
  const centerDate = formatCenterDate(selectedDateObject, locale);
  const upcomingHoliday = getUpcomingOfficialHolidayInWeek(selectedDateObject);
  const upcomingHolidayName = upcomingHoliday
    ? translateOfficialHolidayName(upcomingHoliday.name, locale)
    : null;
  const daysUntilHoliday = upcomingHoliday
    ? getDaysUntil(selectedDateObject, upcomingHoliday.date)
    : null;
  const upcomingNotables = useMemo(
    () => getUpcomingNotables(selectedDateObject, 4, 21, locale),
    [locale, selectedDateObject]
  );
  const seasonalNotes = useMemo(
    () => getSeasonalNotes(selectedDateObject, locale),
    [locale, selectedDateObject]
  );
  const theme = celebration?.theme ?? 'ordinary';
  const compactPrimaryMedia = usesCompactPrimaryMedia(dayStatus.dayType);
  const themeDayBlurbs = useMemo(
    () => (!celebration && hasThemeDays ? buildThemeDayBlurbs(visibleThemeDays, locale) : null),
    [celebration, hasThemeDays, locale, visibleThemeDays]
  );
  const currentBlurbs = useMemo(() => {
    if (celebration) {
      return celebration.blurbs;
    }

    if (themeDayBlurbs) {
      return themeDayBlurbs;
    }

    if (dayStatus.dayType !== 'ordinary') {
      return null;
    }

    return getOrdinaryDayBlurbs(locale, selectedDateObject.getDay() === 0 || selectedDateObject.getDay() === 6);
  }, [celebration, dayStatus.dayType, locale, selectedDateObject, themeDayBlurbs]);
  const kicker = celebration
    ? celebration.kicker
    : hasThemeDays
      ? displayThemeDays.length > 1
        ? text.unofficialThemeDays(displayThemeDays.length)
        : text.unofficialThemeDay
      : text.noOfficialEnergy;
  const themeDayDisplayTitle = hasThemeDays ? displayThemeDays[0] : null;
  const celebrationSubtitle = celebration?.subtitle ?? null;
  const mainTitle = celebration
    ? celebration.title
    : hasThemeDays
      ? `${themeDayDisplayTitle}. ${themeDayTitleEnding}`
      : text.ordinaryTitle;
  const hasLongWordTitle = hasLongTitleWord(themeDayDisplayTitle ?? mainTitle);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    if (!currentBlurbs) {
      setBlurb(ordinaryBlurb);
      return;
    }

    setBlurb(getRandomItem(currentBlurbs, ordinaryBlurb));
  }, [selectedDate, locale, currentBlurbs, ordinaryBlurb]);

  useEffect(() => {
    const endings = ordinaryThemeDayTitleEndingsByLocale[locale];
    if (!themeDayDisplayTitle || celebration) {
      setThemeDayTitleEnding(endings[0]);
      return;
    }

    setThemeDayTitleEnding(getRandomItem(endings, endings[0]));
  }, [selectedDate, locale, themeDayDisplayTitle, celebration]);

  useEffect(() => {
    const notes = ordinaryThemeDayCardNotesByLocale[locale];
    if (!hasThemeDays || celebration) {
      setThemeDayCardNote(notes[0]);
      return;
    }

    setThemeDayCardNote(getRandomItem(notes, notes[0]));
  }, [selectedDate, locale, hasThemeDays, celebration]);

  useEffect(() => {
    let isCurrent = true;

    setNameDayState('loading');

    fetchNameDays(dayStatus.dateLabel)
      .then((names) => {
        if (!isCurrent) {
          return;
        }

        setNameDays(names);
        setNameDayState('ready');
      })
      .catch(() => {
        if (!isCurrent) {
          return;
        }

        setNameDays([]);
        setNameDayState('error');
      });

    return () => {
      isCurrent = false;
    };
  }, [dayStatus.dateLabel]);

  function stepSelectedDate(days: number): void {
    setSelectedDate(formatForInput(addDays(selectedDateObject, days)));
  }

  return (
    <div className={`App ${darkMode ? 'dark' : ''} theme-${theme}`}>
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-grid">
        <header className="app-panel app-panel--intro">
          <div className="intro-controls">
            <button
              type="button"
              className="theme-toggle theme-toggle--language"
              onClick={() => setLocale((current) => (current === 'sv' ? 'en' : 'sv'))}
            >
              {text.languageButton}
            </button>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setDarkMode((current) => !current)}
            >
              {darkMode ? text.lightMode : text.darkMode}
            </button>
          </div>

          <div className="brand-block">
            <img src={mojoLogo} alt="Mojo Logo" className="brand-logo" />
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
              onChange={(event) => setSelectedDate(event.target.value)}
              className="date-picker"
            />
            <div className="picker-meta">
              <span>{humanDate}</span>
              <span>{dayStatus.dateLabel}</span>
            </div>
          </div>

          <div className="nameday-card">
            <p className="eyebrow">{text.nameday}</p>
            {nameDayState === 'loading' ? <p className="nameday-text">{text.namedayLoading}</p> : null}
            {nameDayState === 'error' ? <p className="nameday-text">{text.namedayError}</p> : null}
            {nameDayState === 'ready' && nameDays.length > 0 ? (
              <p className="nameday-text">{nameDays.join(locale === 'en' ? ' and ' : ' och ')}</p>
            ) : null}
            {nameDayState === 'ready' && nameDays.length === 0 ? (
              <p className="nameday-text">{text.namedayNone}</p>
            ) : null}
          </div>

          {upcomingHoliday && upcomingHolidayName && daysUntilHoliday !== null ? (
            <div className="holiday-card">
              <p className="eyebrow">{text.weeklyHoliday}</p>
              <p className="holiday-title">{upcomingHolidayName}</p>
              <p className="nameday-text">
                {getUpcomingHolidayBlurb(upcomingHolidayName, daysUntilHoliday, locale)}
              </p>
              <p className="holiday-meta">
                {formatDaysUntilLabel(daysUntilHoliday, locale)}{' '}
                {locale === 'en' ? 'until' : 'till'}{' '}
                {formatShortSwedishDate(upcomingHoliday.date, locale)}.
              </p>
            </div>
          ) : null}

          {seasonalNotes.length > 0 ? (
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
          ) : null}

          {upcomingNotables.length > 0 ? (
            <div className="upcoming-card">
              <p className="eyebrow">{text.upcoming}</p>
              <div className="upcoming-list">
                {upcomingNotables.map((item) => (
                  <article key={item.dateLabel} className="upcoming-item">
                    <div className="upcoming-item-top">
                      <span className="upcoming-label">{item.label}</span>
                      <span className="upcoming-days">
                        {item.daysUntil === 1 ? text.upcomingTomorrow : text.upcomingInDays(item.daysUntil)}
                      </span>
                    </div>
                    <p className="upcoming-title">{item.title}</p>
                    <p className="upcoming-date">{formatShortSwedishDate(item.date, locale)}</p>
                    <p className="upcoming-note">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <footer className="intro-footer">
            <button
              type="button"
              className="source-link source-link--button"
              onClick={() => setShowImageCredits(true)}
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
          </footer>
        </header>

        <main className="app-panel celebration-card">
          <div className="card-nav" aria-label={locale === 'en' ? 'Date navigation' : 'Datumnavigering'}>
            <button
              type="button"
              className="card-nav-button"
              onClick={() => stepSelectedDate(-1)}
            >
              {text.previousDay}
            </button>
            <p className="card-date">{centerDate}</p>
            <button
              type="button"
              className="card-nav-button"
              onClick={() => stepSelectedDate(1)}
            >
              {text.nextDay}
            </button>
          </div>
          <p className="eyebrow">{kicker}</p>
          {themeDayDisplayTitle && !celebration ? (
            <h2
              className={`celebration-title celebration-title--stacked${
                hasLongWordTitle ? ' celebration-title--longword' : ''
              }`}
            >
              {themeDayDisplayTitle}.
              <span className="celebration-title-subline">{themeDayTitleEnding}</span>
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
            <p className="celebration-blurb">{blurb}</p>
            {currentBlurbs ? (
              <button
                type="button"
                className="reroll-button"
                onClick={() => setBlurb(getRandomItem(currentBlurbs, ordinaryBlurb, blurb))}
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

              {hasThemeDays ? (
                <div className="theme-day-panel">
                  <span className="ordinary-badge">{text.extraThemeDays}</span>
                  <p>
                    {text.asIfThatWasNotEnough(
                      themeDayDisplayTitle ?? '',
                      joinWithAnd(displayThemeDays, locale)
                    )}
                  </p>
                  <ul className="theme-day-list">
                    {displayThemeDays.map((themeDay) => (
                      <li key={themeDay}>{themeDay}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <div className="ordinary-card">
              <span className="ordinary-badge">
                {hasThemeDays ? text.todayThemeDays : text.noHit}
              </span>
              <p>
                {hasThemeDays
                  ? text.ordinaryThemeDayLead(joinWithAnd(displayThemeDays, locale), themeDayCardNote)
                  : text.ordinaryNoHitBody}
              </p>
              {hasThemeDays ? (
                <ul className="theme-day-list">
                  {displayThemeDays.map((themeDay) => (
                    <li key={themeDay}>{themeDay}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </main>
      </div>

      {showImageCredits ? (
        <div
          className="credits-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-credits-title"
        >
          <div
            className="credits-backdrop"
            aria-hidden="true"
            onClick={() => setShowImageCredits(false)}
          />
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
                onClick={() => setShowImageCredits(false)}
              >
                {text.close}
              </button>
            </div>

            <div className="credits-list">
              {imageCredits.map((credit) => (
                <article key={credit.slug} className="credits-item">
                  <p className="credits-item-title">{getImageCreditLabel(credit.slug, locale)}</p>
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
    </div>
  );
}

export default App;
