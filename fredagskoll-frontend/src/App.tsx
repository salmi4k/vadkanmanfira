import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { AiBlurbBundle, fetchAiBlurbBundle } from './aiBlurbs';
import mojoLogo from './mojo-logo.png';
import publicLogo from './vkmf-logo-public.png';
import {
  appText,
} from './appText';
import { buildInfo } from './buildInfo.generated';
import { usesCompactPrimaryMedia, formatTitle, hasLongTitleWord } from './celebrationPresentation';
import {
  getCelebrations,
  getCelebrationThemeAliases,
  getOrdinaryBlurb,
  getOrdinaryDayBlurbs,
} from './celebrations';
import { ContentPack, getActiveContentPack, showsTeamBranding } from './contentPack';
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
  getIntlLocale,
  getInitialLocale,
  joinWithConjunction,
  localeOptions,
  translateOfficialHolidayName,
  translateThemeDayName,
} from './locale';
import { fetchNameDays } from './nameDays';
import { getNationalDayPanel } from './nationalDays';
import {
  getAsIfThatWasNotEnough,
  getOrdinaryNoHitBody,
  getOrdinaryThemeDayCardNotes,
  getOrdinaryThemeDayLead,
  getOrdinaryThemeDayTitleEndings,
  getOrdinaryTitle,
} from './editorialText';
import { getSeasonalNotes } from './seasonalNotes';
import {
  getInitialMood,
  getMoodLabel,
  getMoodNote,
  moodOptions,
  MOOD_STORAGE_KEY,
  Mood,
} from './mood';
import { buildThemeDayBlurbs, filterThemeDays, joinWithAnd } from './themeDayBlurbs';
import { getThemeDaysForDate } from './temadagar';
import { getUpcomingNotables } from './upcomingNotables';

type AppProps = {
  initialDate?: Date;
  contentPack?: ContentPack;
};

type NameDayState = 'loading' | 'ready' | 'error';
type AiBundleState = 'loading' | 'ready' | 'fallback';
type MobileSectionKey =
  | 'holiday'
  | 'season'
  | 'upcoming'
  | 'extraThemeDays'
  | 'worldNationalDays';

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

function getImageCreditLabel(slug: string, locale: Locale, contentPack: ContentPack): string {
  const dayType = imageCreditDayTypes[slug];
  if (!dayType) {
    return slug;
  }

  const aliases = getCelebrationThemeAliases(dayType, locale, contentPack);
  return aliases[0] ?? slug;
}

function getInitialMobileLayout(): boolean {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 640px)').matches
    : false;
}

function MobileSection({
  isMobile,
  expanded,
  onToggle,
  summary,
  children,
}: {
  isMobile: boolean;
  expanded: boolean;
  onToggle: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <section className={`mobile-section${expanded ? ' mobile-section--open' : ''}`}>
      <button type="button" className="mobile-section-toggle" onClick={onToggle}>
        <span>{summary}</span>
        <span className="mobile-section-chevron" aria-hidden="true">
          {expanded ? '−' : '+'}
        </span>
      </button>
      {expanded ? <div className="mobile-section-content">{children}</div> : null}
    </section>
  );
}

function formatBuildStamp(locale: Locale): string {
  const builtAt = new Date(buildInfo.builtAt);
  const formattedTime = new Intl.DateTimeFormat(getIntlLocale(locale), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(builtAt);

  return `v${buildInfo.version} | ${buildInfo.buildRef} | ${formattedTime}`;
}

function App({
  initialDate = new Date(),
  contentPack = getActiveContentPack(),
}: AppProps) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [darkMode, setDarkMode] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showImageCredits, setShowImageCredits] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(getInitialMobileLayout);
  const [mood, setMood] = useState<Mood>(getInitialMood);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [expandedMobileSections, setExpandedMobileSections] = useState<
    Record<MobileSectionKey, boolean>
  >({
    holiday: false,
    season: false,
    upcoming: false,
    extraThemeDays: false,
    worldNationalDays: false,
  });
  const [selectedDate, setSelectedDate] = useState(formatForInput(initialDate));
  const [nameDays, setNameDays] = useState<string[]>([]);
  const [nameDayState, setNameDayState] = useState<NameDayState>('loading');
  const [aiBundle, setAiBundle] = useState<AiBlurbBundle | null>(null);
  const [aiBundleState, setAiBundleState] = useState<AiBundleState>('loading');
  const [blurb, setBlurb] = useState(getOrdinaryBlurb(getInitialLocale(), getInitialMood()));
  const [themeDayTitleEnding, setThemeDayTitleEnding] = useState(
    getOrdinaryThemeDayTitleEndings(getInitialLocale(), getInitialMood())[0]
  );
  const [themeDayCardNote, setThemeDayCardNote] = useState(
    getOrdinaryThemeDayCardNotes(getInitialLocale(), getInitialMood())[0]
  );

  const text = appText[locale];
  const buildStamp = useMemo(() => formatBuildStamp(locale), [locale]);
  const celebrations = useMemo(
    () => getCelebrations(locale, contentPack, mood),
    [contentPack, locale, mood]
  );
  const ordinaryBlurb = useMemo(() => getOrdinaryBlurb(locale, mood), [locale, mood]);
  const selectedDateObject = useMemo(
    () => new Date(`${selectedDate}T12:00:00`),
    [selectedDate]
  );
  const dayStatus = getDayStatus(selectedDateObject, contentPack);
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

    return filterThemeDays(themeDays, getCelebrationThemeAliases(dayStatus.dayType, locale, contentPack));
  }, [celebration, contentPack, dayStatus.dayType, locale, themeDays]);
  const displayThemeDays = useMemo(
    () => visibleThemeDays.map((themeDay) => translateThemeDayName(themeDay, locale)),
    [locale, visibleThemeDays]
  );
  const extraDisplayThemeDays = useMemo(
    () => displayThemeDays,
    [displayThemeDays]
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
    () => getUpcomingNotables(selectedDateObject, 4, 21, locale, contentPack),
    [contentPack, locale, selectedDateObject]
  );
  const seasonalNotes = useMemo(
    () => getSeasonalNotes(selectedDateObject, locale),
    [locale, selectedDateObject]
  );
  const nationalDayPanel = useMemo(
    () => getNationalDayPanel(selectedDateObject, locale),
    [locale, selectedDateObject]
  );
  const theme = celebration?.theme ?? 'ordinary';
  const compactPrimaryMedia = usesCompactPrimaryMedia(dayStatus.dayType);
  const themeDayBlurbs = useMemo(
    () => (!celebration && hasThemeDays ? buildThemeDayBlurbs(visibleThemeDays, locale, mood) : null),
    [celebration, hasThemeDays, locale, mood, visibleThemeDays]
  );
  const isAiBundleLoading = aiBundleState === 'loading';
  const currentBlurbs = useMemo(() => {
    if (aiBundle?.blurbs.length) {
      return aiBundle.blurbs;
    }

    if (isAiBundleLoading) {
      return null;
    }

    if (celebration) {
      return celebration.blurbs;
    }

    if (themeDayBlurbs) {
      return themeDayBlurbs;
    }

    if (dayStatus.dayType !== 'ordinary') {
      return null;
    }

    return getOrdinaryDayBlurbs(
      locale,
      selectedDateObject.getDay() === 0 || selectedDateObject.getDay() === 6,
      mood
    );
  }, [aiBundle, celebration, dayStatus.dayType, isAiBundleLoading, locale, mood, selectedDateObject, themeDayBlurbs]);
  const kicker = celebration
    ? celebration.kicker
    : hasThemeDays
      ? displayThemeDays.length > 1
        ? text.unofficialThemeDays(displayThemeDays.length)
        : text.unofficialThemeDay
      : text.noOfficialEnergy;
  const themeDayDisplayTitle = hasThemeDays ? displayThemeDays[0] : null;
  const extraThemeDayLead = useMemo(() => {
    if (celebration && dayStatus.dayType !== 'ordinary') {
      const aliases = getCelebrationThemeAliases(dayStatus.dayType, locale, contentPack);
      return aliases[0] ?? celebration.title;
    }

    return themeDayDisplayTitle;
  }, [celebration, contentPack, dayStatus.dayType, locale, themeDayDisplayTitle]);
  const celebrationSubtitle = celebration?.subtitle ?? null;
  const mainTitle = celebration
    ? celebration.title
    : hasThemeDays
      ? `${themeDayDisplayTitle}. ${themeDayTitleEnding}`
      : getOrdinaryTitle(locale, mood);
  const hasLongWordTitle = hasLongTitleWord(themeDayDisplayTitle ?? mainTitle);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsMobileLayout(event.matches);
    };

    setIsMobileLayout(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(MOOD_STORAGE_KEY, mood);
  }, [mood]);

  useEffect(() => {
    setShowLanguageMenu(false);
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();
    const fallbackTitleEnding = getOrdinaryThemeDayTitleEndings(locale, mood)[0];
    const fallbackCardNote = getOrdinaryThemeDayCardNotes(locale, mood)[0];
    const fallbackBlurbs = celebration
      ? celebration.blurbs
      : themeDayBlurbs
        ? themeDayBlurbs
        : dayStatus.dayType === 'ordinary'
          ? getOrdinaryDayBlurbs(
              locale,
              selectedDateObject.getDay() === 0 || selectedDateObject.getDay() === 6,
              mood
            )
          : [];

    const kind = celebration ? 'celebration' : hasThemeDays ? 'themeDay' : 'ordinary';
    const request = {
      locale,
      contentPack,
      kind,
      mood,
      date: selectedDate,
      dateLabel: dayStatus.dateLabel,
      dayType: dayStatus.dayType,
      title: celebration ? celebration.title : themeDayDisplayTitle ?? getOrdinaryTitle(locale, mood),
      subtitle: celebration?.subtitle,
      kicker,
      fallbackTitleEnding,
      fallbackCardNote,
      fallbackBlurbs,
      themeDays: displayThemeDays,
      extraThemeDays: extraDisplayThemeDays,
      seasonalTitles: seasonalNotes.map((item) => item.title),
      upcomingTitles: upcomingNotables.map((item) => item.title),
      upcomingHolidayName: upcomingHolidayName ?? undefined,
      nationalDaySummary: nationalDayPanel?.summary,
      allowHumor: true,
    } as const;

    setAiBundle(null);
    setAiBundleState('loading');

    Promise.resolve(fetchAiBlurbBundle(request, controller.signal))
      .then((bundle) => {
        if (bundle === null) {
          setAiBundleState('fallback');
          return;
        }

        setAiBundle(bundle);
        setAiBundleState('ready');
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setAiBundle(null);
        setAiBundleState('fallback');
      });

    return () => {
      controller.abort();
    };
  }, [
    celebration,
    contentPack,
    dayStatus.dateLabel,
    dayStatus.dayType,
    displayThemeDays,
    extraDisplayThemeDays,
    hasThemeDays,
    kicker,
    locale,
    mood,
    nationalDayPanel,
    selectedDate,
    selectedDateObject,
    seasonalNotes,
    themeDayBlurbs,
    themeDayDisplayTitle,
    upcomingHolidayName,
    upcomingNotables,
  ]);

  useEffect(() => {
    if (isAiBundleLoading) {
      return;
    }

    if (!currentBlurbs) {
      setBlurb(ordinaryBlurb);
      return;
    }

    setBlurb(getRandomItem(currentBlurbs, ordinaryBlurb));
  }, [selectedDate, locale, currentBlurbs, ordinaryBlurb, isAiBundleLoading]);

  useEffect(() => {
    const endings =
      aiBundle?.titleEndings.length && themeDayDisplayTitle && !celebration
        ? aiBundle.titleEndings
        : getOrdinaryThemeDayTitleEndings(locale, mood);
    if (!themeDayDisplayTitle || celebration) {
      setThemeDayTitleEnding(endings[0]);
      return;
    }

    setThemeDayTitleEnding(getRandomItem(endings, endings[0]));
  }, [aiBundle, selectedDate, locale, mood, themeDayDisplayTitle, celebration]);

  useEffect(() => {
    const notes =
      aiBundle?.cardNotes.length && hasThemeDays && !celebration
        ? aiBundle.cardNotes
        : getOrdinaryThemeDayCardNotes(locale, mood);
    if (!hasThemeDays || celebration) {
      setThemeDayCardNote(notes[0]);
      return;
    }

    setThemeDayCardNote(getRandomItem(notes, notes[0]));
  }, [aiBundle, selectedDate, locale, mood, hasThemeDays, celebration]);

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

  function toggleMobileSection(section: MobileSectionKey): void {
    setExpandedMobileSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  return (
    <div
      className={`App ${darkMode ? 'dark' : ''} theme-${theme} locale-${locale}`}
      data-mood={mood}
    >
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-grid">
        <header className="app-panel app-panel--intro">
          <div className="intro-controls">
            <div className="language-control">
              <button
                type="button"
                className="theme-toggle theme-toggle--language"
                aria-haspopup="menu"
                aria-expanded={showLanguageMenu}
                aria-label={text.languageMenuLabel}
                onClick={() => setShowLanguageMenu((current) => !current)}
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
                      onClick={() => setLocale(option.value)}
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
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setDarkMode((current) => !current)}
            >
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
              onChange={(event) => setSelectedDate(event.target.value)}
              className="date-picker"
            />
            <div className="picker-meta">
              <span>{humanDate}</span>
              <span>{dayStatus.dateLabel}</span>
            </div>
          </div>

          <label htmlFor="mood-picker" className="picker-label">
            {text.moodLabel}
          </label>
          <div className="picker-shell picker-shell--mood">
            <select
              id="mood-picker"
              value={mood}
              onChange={(event) => setMood(event.target.value as Mood)}
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

          {upcomingHoliday && upcomingHolidayName && daysUntilHoliday !== null ? (
            <MobileSection
              isMobile={isMobileLayout}
              expanded={expandedMobileSections.holiday}
              onToggle={() => toggleMobileSection('holiday')}
              summary={text.mobileWeeklyHolidaySummary}
            >
              <div className="holiday-card">
                <p className="eyebrow">{text.weeklyHoliday}</p>
                <p className="holiday-title">{upcomingHolidayName}</p>
                <p className="nameday-text">
                  {getUpcomingHolidayBlurb(upcomingHolidayName, daysUntilHoliday, locale)}
                </p>
                <p className="holiday-meta">
                  {formatDaysUntilLabel(daysUntilHoliday, locale)}{' '}
                  {text.untilLabel}{' '}
                  {formatShortSwedishDate(upcomingHoliday.date, locale)}.
                </p>
              </div>
            </MobileSection>
          ) : null}

          {seasonalNotes.length > 0 ? (
            <MobileSection
              isMobile={isMobileLayout}
              expanded={expandedMobileSections.season}
              onToggle={() => toggleMobileSection('season')}
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
            <MobileSection
              isMobile={isMobileLayout}
              expanded={expandedMobileSections.upcoming}
              onToggle={() => toggleMobileSection('upcoming')}
              summary={text.mobileUpcomingSummary(upcomingNotables.length)}
            >
              <div className="upcoming-card">
                <div className="upcoming-header">
                  <p className="eyebrow">{text.upcoming}</p>
                  {!isMobileLayout ? (
                    <button
                      type="button"
                      className="upcoming-toggle"
                      aria-label={showUpcoming ? text.collapseHide : text.collapseShow}
                      title={showUpcoming ? text.collapseHide : text.collapseShow}
                      onClick={() => setShowUpcoming((current) => !current)}
                    >
                      <span aria-hidden="true">{showUpcoming ? '−' : '+'}</span>
                    </button>
                  ) : null}
                </div>
                {isMobileLayout || showUpcoming ? (
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
                ) : null}
              </div>
            </MobileSection>
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
            <span className="build-stamp">
              {text.buildInfoLabel} {buildStamp}
            </span>
          </footer>
        </header>

        <main className="app-panel celebration-card">
          <div className="card-nav" aria-label={text.dateNavigationAria}>
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
          <div className="card-kicker-row">
            <p className="eyebrow">{kicker}</p>
            <span className="mood-pill">{getMoodLabel(mood, locale)}</span>
          </div>
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
            {isAiBundleLoading ? (
              <p className="celebration-blurb celebration-blurb--loading" aria-live="polite">
                {text.blurbLoading}
              </p>
            ) : (
              <p className="celebration-blurb">{blurb}</p>
            )}
            {currentBlurbs && !isAiBundleLoading ? (
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

              {extraDisplayThemeDays.length > 0 ? (
                <MobileSection
                  isMobile={isMobileLayout}
                  expanded={expandedMobileSections.extraThemeDays}
                  onToggle={() => toggleMobileSection('extraThemeDays')}
                  summary={text.mobileExtraThemeDaysSummary(extraDisplayThemeDays.length)}
                >
                  <div className="theme-day-panel">
                    <span className="ordinary-badge">{text.extraThemeDays}</span>
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
                  </div>
                </MobileSection>
              ) : null}
            </>
          ) : (
            <div className="ordinary-card">
              <span className="ordinary-badge">
                {hasThemeDays ? text.todayThemeDays : text.noHit}
              </span>
              <p>
                {hasThemeDays
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
            </div>
          )}

          {nationalDayPanel ? (
            <MobileSection
              isMobile={isMobileLayout}
              expanded={expandedMobileSections.worldNationalDays}
              onToggle={() => toggleMobileSection('worldNationalDays')}
              summary={text.mobileWorldDaysSummary(
                nationalDayPanel.items.length + nationalDayPanel.hiddenCount
              )}
            >
              <div className="world-day-panel">
                <span className="ordinary-badge">{text.worldNationalDaysBadge}</span>
                <p className="world-day-summary">{nationalDayPanel.summary}</p>
                <div className="world-day-header">
                  <p className="eyebrow">{text.worldNationalDays}</p>
                </div>
                <ul className="theme-day-list world-day-list">
                  {nationalDayPanel.items.map((item) => (
                    <li key={`${item.nation}-${item.significance}`}>
                      <strong>{item.nation}</strong>
                      <span>{item.significance}</span>
                    </li>
                  ))}
                </ul>
                {nationalDayPanel.hiddenCount > 0 ? (
                  <p className="world-day-more">{text.worldNationalDaysMore(nationalDayPanel.hiddenCount)}</p>
                ) : null}
              </div>
            </MobileSection>
          ) : null}
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
                  <p className="credits-item-title">{getImageCreditLabel(credit.slug, locale, contentPack)}</p>
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
