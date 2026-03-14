import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import mojoLogo from './mojo-logo.png';
import { DayType, getDayStatus, getUpcomingOfficialHolidayInWeek } from './dayLogic';
import {
  celebrations,
  getCelebrationThemeAliases,
  ordinaryBlurb,
  ordinaryWeekdayBlurbs,
} from './celebrations';
import { imageCredits } from './imageCredits';
import { buildThemeDayBlurbs, filterThemeDays, joinWithAnd } from './themeDayBlurbs';
import { getThemeDaysForDate } from './temadagar';
import { getUpcomingNotables } from './upcomingNotables';

type AppProps = {
  initialDate?: Date;
};

type NameDayState = 'loading' | 'ready' | 'error';

interface SholidayResponse {
  dagar?: Array<{
    namnsdag?: string[];
  }>;
}

function formatForInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatForHumans(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatShortSwedishDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function getRandomItem(options: string[]): string {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

function formatTitle(title: string): string {
  return title.replaceAll('. ', '.\n');
}

function hasOrdinaryWeekdayExcuses(date: Date, dayType: DayType): boolean {
  if (dayType !== 'ordinary') {
    return false;
  }

  const weekday = date.getDay();
  return weekday >= 1 && weekday <= 5;
}

function getDaysUntil(date: Date, target: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - date.getTime()) / millisecondsPerDay);
}

function getUpcomingHolidayBlurb(holidayName: string, daysUntil: number): string {
  if (daysUntil <= 1) {
    return `${holidayName} väntar imorgon, så veckan är i praktiken redan perforerad.`;
  }

  if (daysUntil === 2) {
    return `${holidayName} ligger bara två dagar bort. Ambitionsnivån bör därefter justeras försiktigt nedåt.`;
  }

  if (daysUntil === 3) {
    return `${holidayName} dyker upp om tre dagar, vilket är nära nog för att sabotera seriös framförhållning.`;
  }

  return `${holidayName} ligger senare i veckan. Håll ut, det finns åtminstone en officiell lucka i systemet.`;
}

function formatDaysUntilLabel(daysUntil: number): string {
  return `${daysUntil} ${daysUntil === 1 ? 'dag' : 'dagar'} kvar`;
}

function usesCompactPrimaryMedia(dayType: DayType): boolean {
  return (
    dayType === 'kottonsdag' ||
    dayType === 'fisktorsdag' ||
    dayType === 'marmeladfredag'
  );
}

async function fetchNameDays(dateLabel: string): Promise<string[]> {
  const [year, month, day] = dateLabel.split('-');
  const response = await fetch(
    `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}/${day}`
  );

  if (!response.ok) {
    throw new Error(`Namnsdag lookup failed for ${dateLabel}`);
  }

  const payload = (await response.json()) as SholidayResponse;

  if (!Array.isArray(payload.dagar) || !Array.isArray(payload.dagar[0]?.namnsdag)) {
    return [];
  }

  return payload.dagar[0].namnsdag;
}

function App({ initialDate = new Date() }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [showImageCredits, setShowImageCredits] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatForInput(initialDate));
  const [nameDays, setNameDays] = useState<string[]>([]);
  const [nameDayState, setNameDayState] = useState<NameDayState>('loading');
  const [blurb, setBlurb] = useState(ordinaryBlurb);

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

    return filterThemeDays(themeDays, getCelebrationThemeAliases(dayStatus.dayType));
  }, [celebration, dayStatus.dayType, themeDays]);
  const hasThemeDays = visibleThemeDays.length > 0;
  const humanDate = formatForHumans(selectedDateObject);
  const upcomingHoliday = getUpcomingOfficialHolidayInWeek(selectedDateObject);
  const daysUntilHoliday = upcomingHoliday
    ? getDaysUntil(selectedDateObject, upcomingHoliday.date)
    : null;
  const upcomingNotables = useMemo(
    () => getUpcomingNotables(selectedDateObject),
    [selectedDateObject]
  );
  const theme = celebration?.theme ?? 'ordinary';
  const compactPrimaryMedia = usesCompactPrimaryMedia(dayStatus.dayType);
  const themeDayBlurbs = useMemo(
    () => (!celebration && hasThemeDays ? buildThemeDayBlurbs(visibleThemeDays) : null),
    [celebration, hasThemeDays, visibleThemeDays]
  );
  const currentBlurbs = useMemo(() => {
    if (celebration) {
      return celebration.blurbs;
    }

    if (themeDayBlurbs) {
      return themeDayBlurbs;
    }

    if (hasOrdinaryWeekdayExcuses(selectedDateObject, dayStatus.dayType)) {
      return ordinaryWeekdayBlurbs;
    }

    return null;
  }, [celebration, themeDayBlurbs, dayStatus.dayType, selectedDateObject]);
  const kicker = celebration
    ? celebration.kicker
    : hasThemeDays
      ? visibleThemeDays.length > 1
        ? `Inofficiella temadagar x${visibleThemeDays.length}`
        : 'Inofficiell temadag'
      : 'Ingen officiell stordådskänsla';
  const mainTitle = celebration
    ? celebration.title
    : hasThemeDays
      ? `${visibleThemeDays[0]}. Det får väl räcka.`
      : 'En vanlig dag. Så sorgligt är det.';

  useEffect(() => {
    if (!currentBlurbs) {
      setBlurb(ordinaryBlurb);
      return;
    }

    setBlurb(getRandomItem(currentBlurbs));
  }, [selectedDate, currentBlurbs]);

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

  return (
    <div className={`App ${darkMode ? 'dark' : ''} theme-${theme}`}>
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-grid">
        <header className="app-panel app-panel--intro">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
          >
            {darkMode ? 'Ljust läge' : 'Mörkt läge'}
          </button>

          <div className="brand-block">
            <img src={mojoLogo} alt="Mojo Logo" className="brand-logo" />
            <div className="brand-copy">
              <p className="eyebrow">Fredagskoll deluxe</p>
              <h1 className="brand-title">Vad firar vi idag?</h1>
              <p className="brand-lede">
                Välj ett datum och låt appen avgöra om dagen förtjänar sill,
                semla, fisk eller bara ett tyst konstaterande av tomhet.
              </p>
            </div>
          </div>

          <label htmlFor="date-picker" className="picker-label">
            Välj datum
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
            <p className="eyebrow">Dagens namnsdag</p>
            {nameDayState === 'loading' ? (
              <p className="nameday-text">Laddar namnsdag från öppet API.</p>
            ) : null}
            {nameDayState === 'error' ? (
              <p className="nameday-text">
                Namnsdag gick inte att hämta just nu. Internet måste förstås
                också vilja samarbeta.
              </p>
            ) : null}
            {nameDayState === 'ready' && nameDays.length > 0 ? (
              <p className="nameday-text">{nameDays.join(' och ')}</p>
            ) : null}
            {nameDayState === 'ready' && nameDays.length === 0 ? (
              <p className="nameday-text">Ingen namnsdag registrerad för datumet.</p>
            ) : null}
          </div>

          {upcomingHoliday && daysUntilHoliday !== null ? (
            <div className="holiday-card">
              <p className="eyebrow">Veckans helgdag</p>
              <p className="holiday-title">{upcomingHoliday.name}</p>
              <p className="nameday-text">
                {getUpcomingHolidayBlurb(upcomingHoliday.name, daysUntilHoliday)}
              </p>
              <p className="holiday-meta">
                {formatDaysUntilLabel(daysUntilHoliday)} till{' '}
                {formatShortSwedishDate(upcomingHoliday.date)}.
              </p>
            </div>
          ) : null}

          {upcomingNotables.length > 0 ? (
            <div className="upcoming-card">
              <p className="eyebrow">På gång</p>
              <div className="upcoming-list">
                {upcomingNotables.map((item) => (
                  <article key={item.dateLabel} className="upcoming-item">
                    <div className="upcoming-item-top">
                      <span className="upcoming-label">{item.label}</span>
                      <span className="upcoming-days">
                        {item.daysUntil === 1 ? 'I morgon' : `Om ${item.daysUntil} dagar`}
                      </span>
                    </div>
                    <p className="upcoming-title">{item.title}</p>
                    <p className="upcoming-date">{formatShortSwedishDate(item.date)}</p>
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
              Bildkällor
            </button>
            <a
              className="source-link"
              href="https://temadagar.se/kalender/"
              target="_blank"
              rel="noreferrer"
            >
              Temadagar inspirerade av temadagar.se
            </a>
          </footer>
        </header>

        <main className="app-panel celebration-card">
          <p className="eyebrow">{kicker}</p>
          <h2 className="celebration-title">{formatTitle(mainTitle)}</h2>
          <div className="blurb-row">
            <p className="celebration-blurb">{blurb}</p>
            {currentBlurbs ? (
              <button
                type="button"
                className="reroll-button"
                onClick={() => setBlurb(getRandomItem(currentBlurbs))}
              >
                Ny ursäkt
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
                    <span>{celebration.visualBadge ?? 'Bildfri zon'}</span>
                    <strong>
                      {celebration.visualTitle ??
                        'Det här firandet får bära sig självt utan fotobevis.'}
                    </strong>
                    <p>
                      {celebration.visualBody ??
                        'Ingen bild finns än, men dagen försöker i alla fall inte se tom ut längre.'}
                    </p>
                  </div>
                ) : null}
              </div>

              {hasThemeDays ? (
                <div className="theme-day-panel">
                  <span className="ordinary-badge">Fler temadagar idag</span>
                  <p>
                    Som om {mainTitle.split('.')[0].toLowerCase()} inte räckte, så pågår även{' '}
                    {joinWithAnd(visibleThemeDays)} i bakgrunden.
                  </p>
                  <ul className="theme-day-list">
                    {visibleThemeDays.map((themeDay) => (
                      <li key={themeDay}>{themeDay}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <div className="ordinary-card">
              <span className="ordinary-badge">
                {hasThemeDays ? 'Dagens temadagar' : 'Ingen träff'}
              </span>
              <p>
                {hasThemeDays
                  ? `Temadagsmotorn hittade ${joinWithAnd(visibleThemeDays)}. Det är inte officiellt, men det räcker gott för att börja improvisera.`
                  : 'Datumet har kollats. Systemet fann ingen semla, ingen sill, ingen bullplikt och ingen kollektiv ursäkt för att tappa fokus.'}
              </p>
              {hasThemeDays ? (
                <ul className="theme-day-list">
                  {visibleThemeDays.map((themeDay) => (
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
                <p className="eyebrow">Bildkällor</p>
                <h2 id="image-credits-title" className="credits-title">
                  Wikimedia Commons-credits
                </h2>
                <p className="credits-lede">
                  De nedladdade Commons-bilderna är publikt krediterade här med skapare,
                  källsida och licens. Bilderna i appen är nedskalade versioner.
                </p>
              </div>
              <button
                type="button"
                className="theme-toggle credits-close"
                onClick={() => setShowImageCredits(false)}
              >
                Stäng
              </button>
            </div>

            <div className="credits-list">
              {imageCredits.map((credit) => (
                <article key={credit.slug} className="credits-item">
                  <p className="credits-item-title">{credit.label}</p>
                  <p className="credits-item-meta">
                    Skapare:{' '}
                    {credit.creatorUrl ? (
                      <a href={credit.creatorUrl} target="_blank" rel="noreferrer">
                        {credit.creator}
                      </a>
                    ) : (
                      credit.creator
                    )}
                  </p>
                  <p className="credits-item-meta">
                    Licens:{' '}
                    {credit.licenseUrl ? (
                      <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                        {credit.licenseName}
                      </a>
                    ) : (
                      credit.licenseName
                    )}
                  </p>
                  <p className="credits-item-meta">
                    Källa:{' '}
                    <a href={credit.sourceUrl} target="_blank" rel="noreferrer">
                      Commons-filsida
                    </a>
                  </p>
                  {credit.note ? <p className="credits-item-note">{credit.note}</p> : null}
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
