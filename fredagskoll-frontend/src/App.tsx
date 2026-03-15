import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { AiBlurbRequest } from './features/ai/aiBlurbs';
import { appText } from './appText';
import { buildInfo } from './buildInfo.generated';
import { IntroPanel } from './components/IntroPanel';
import { AppDialogs } from './components/AppDialogs';
import { DisclosurePanel } from './components/DisclosurePanel';
import { formatBuildStamp, getInitialMobileLayout } from './appHelpers';
import {
  formatTitle,
  hasLongTitleWord,
  usesCompactPrimaryMedia,
} from './features/celebrations/celebrationPresentation';
import {
  CelebrationContent,
  getCelebrations,
  getCelebrationThemeAliases,
  getOrdinaryBlurb,
  getOrdinaryDayBlurbs,
} from './features/celebrations/celebrations';
import { ContentPack, getActiveContentPack } from './contentPack';
import {
  addDays,
  formatCenterDate,
  formatForHumans,
  formatForInput,
  formatShortSwedishDate,
  getDaysUntil,
} from './dateUtils';
import { getDayStatus, getUpcomingOfficialHolidayInWeek } from './dayLogic';
import { Locale, getInitialLocale, persistLocale, translateOfficialHolidayName, translateThemeDayName } from './locale';
import {
  getAsIfThatWasNotEnough,
  getOrdinaryNoHitBody,
  getOrdinaryThemeDayCardNotes,
  getOrdinaryThemeDayLead,
  getOrdinaryThemeDayTitleEndings,
  getOrdinaryTitle,
} from './editorialText';
import { getNationalDayPanel } from './features/national-days/nationalDays';
import { getSeasonalNotes } from './features/upcoming/seasonalNotes';
import { getInitialDarkMode, getInitialMood, getMoodLabel, persistDarkMode, persistMood, Mood } from './mood';
import { getReleaseNote } from './releaseNotes';
import {
  buildThemeDayBlurbs,
  filterThemeDays,
  joinWithAnd,
} from './features/theme-days/themeDayBlurbs';
import { getThemeDaysForDate } from './features/theme-days/temadagar';
import { getUpcomingNotables } from './features/upcoming/upcomingNotables';
import { useAiContent } from './features/ai/useAiContent';
import { useNameDays } from './features/name-days/useNameDays';
import { MobileSectionKey } from './appTypes';

type AppProps = {
  initialDate?: Date;
  contentPack?: ContentPack;
};

function App({
  initialDate = new Date(),
  contentPack = getActiveContentPack(),
}: AppProps) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showImageCredits, setShowImageCredits] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(getInitialMobileLayout);
  const [mood, setMood] = useState<Mood>(getInitialMood);
  const [expandedSections, setExpandedSections] = useState<
    Record<MobileSectionKey, boolean>
  >({
    holiday: false,
    season: false,
    upcoming: true,
    themeDays: true,
    extraThemeDays: true,
    worldNationalDays: true,
  });
  const [selectedDate, setSelectedDate] = useState(formatForInput(initialDate));
  const mainCardRef = useRef<HTMLElement | null>(null);
  const shouldScrollAfterDateCommitRef = useRef(false);

  const text = appText[locale];
  const buildStamp = useMemo(() => formatBuildStamp(locale), [locale]);
  const currentReleaseNote = useMemo(() => getReleaseNote(buildInfo.version), []);
  const celebrations = useMemo(
    () => getCelebrations(locale, contentPack, mood),
    [contentPack, locale, mood]
  );
  const ordinaryBlurb = useMemo(() => getOrdinaryBlurb(locale, mood), [locale, mood]);
  const selectedDateObject = useMemo(() => new Date(`${selectedDate}T12:00:00`), [selectedDate]);
  const dayStatus = getDayStatus(selectedDateObject, contentPack);
  const celebration = getCurrentCelebration(dayStatus.dayType, celebrations);
  const themeDays = useMemo(() => getThemeDaysForDate(selectedDateObject), [selectedDateObject]);
  const visibleThemeDays = useMemo(() => {
    if (!celebration || dayStatus.dayType === 'ordinary') {
      return themeDays;
    }

    return filterThemeDays(
      themeDays,
      getCelebrationThemeAliases(dayStatus.dayType, locale, contentPack)
    );
  }, [celebration, contentPack, dayStatus.dayType, locale, themeDays]);
  const displayThemeDays = useMemo(
    () => visibleThemeDays.map((themeDay) => translateThemeDayName(themeDay, locale)),
    [locale, visibleThemeDays]
  );
  const extraDisplayThemeDays = displayThemeDays;
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
  const kicker = getKicker({
    celebration,
    hasThemeDays,
    displayThemeDaysCount: displayThemeDays.length,
    text,
  });
  const themeDayDisplayTitle = hasThemeDays ? displayThemeDays[0] : null;
  const extraThemeDayLead = useMemo(() => {
    if (celebration && dayStatus.dayType !== 'ordinary') {
      const aliases = getCelebrationThemeAliases(dayStatus.dayType, locale, contentPack);
      return aliases[0] ?? celebration.title;
    }

    return themeDayDisplayTitle;
  }, [celebration, contentPack, dayStatus.dayType, locale, themeDayDisplayTitle]);
  const celebrationSubtitle = celebration?.subtitle ?? null;
  const isWeekend = selectedDateObject.getDay() === 0 || selectedDateObject.getDay() === 6;

  const aiRequest = useMemo<AiBlurbRequest>(() => {
    const fallbackTitleEnding = getOrdinaryThemeDayTitleEndings(locale, mood)[0];
    const fallbackCardNote = getOrdinaryThemeDayCardNotes(locale, mood)[0];
    const fallbackBlurbs = celebration
      ? celebration.blurbs
      : themeDayBlurbs
        ? themeDayBlurbs
        : dayStatus.dayType === 'ordinary'
          ? getOrdinaryDayBlurbs(locale, isWeekend, mood)
          : [];

    return {
      locale,
      contentPack,
      kind: celebration ? 'celebration' : hasThemeDays ? 'themeDay' : 'ordinary',
      mood,
      requestMode: 'default',
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
    };
  }, [
    celebration,
    contentPack,
    dayStatus.dateLabel,
    dayStatus.dayType,
    displayThemeDays,
    extraDisplayThemeDays,
    hasThemeDays,
    isWeekend,
    kicker,
    locale,
    mood,
    nationalDayPanel,
    selectedDate,
    seasonalNotes,
    themeDayBlurbs,
    themeDayDisplayTitle,
    upcomingHolidayName,
    upcomingNotables,
  ]);

  const { nameDays, nameDayState } = useNameDays(dayStatus.dateLabel);
  const {
    blurb,
    currentBlurbs,
    handleReroll,
    isAiBundleLoading,
    isAiRerolling,
    themeDayCardNote,
    themeDayTitleEnding,
  } = useAiContent({
    aiRequest,
    ordinaryBlurb,
    locale,
    mood,
    selectedDate,
    celebration,
    themeDayBlurbs,
    dayType: dayStatus.dayType,
    isWeekend,
    hasThemeDays,
    themeDayDisplayTitle,
  });

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
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  useEffect(() => {
    persistMood(mood);
  }, [mood]);

  useEffect(() => {
    persistDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    setShowLanguageMenu(false);
  }, [locale]);

  function stepSelectedDate(days: number): void {
    setSelectedDate(formatForInput(addDays(selectedDateObject, days)));
  }

  function handleDateChange(nextDate: string): void {
    setSelectedDate(nextDate);
    shouldScrollAfterDateCommitRef.current = isMobileLayout;
  }

  function handleDateCommit(): void {
    if (
      !isMobileLayout ||
      typeof window === 'undefined' ||
      !shouldScrollAfterDateCommitRef.current
    ) {
      return;
    }

    shouldScrollAfterDateCommitRef.current = false;
    window.setTimeout(() => {
      mainCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);
  }

  function toggleMobileSection(section: MobileSectionKey): void {
    setExpandedSections((current) => ({
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
        <IntroPanel
          locale={locale}
          darkMode={darkMode}
          contentPack={contentPack}
          mood={mood}
          selectedDate={selectedDate}
          humanDate={humanDate}
          dateLabel={dayStatus.dateLabel}
          nameDayState={nameDayState}
          nameDays={nameDays}
          upcomingHolidayName={upcomingHolidayName}
          upcomingHolidayDate={upcomingHoliday?.date}
          daysUntilHoliday={daysUntilHoliday}
          seasonalNotes={seasonalNotes}
          isMobileLayout={isMobileLayout}
          showLanguageMenu={showLanguageMenu}
          expandedSections={expandedSections}
          onToggleLanguageMenu={() => setShowLanguageMenu((current) => !current)}
          onToggleDarkMode={() => setDarkMode((current) => !current)}
          onSelectLocale={setLocale}
          onSelectMood={setMood}
          onDateChange={handleDateChange}
          onDateCommit={handleDateCommit}
          onToggleMobileSection={toggleMobileSection}
        />

        <div className="app-main-column">
          <main ref={mainCardRef} className="app-panel celebration-card">
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
                <p className="celebration-blurb">{blurb}</p>
              )}
              {currentBlurbs && !isAiBundleLoading ? (
                <button
                  type="button"
                  className="reroll-button"
                  onClick={() => {
                    void handleReroll();
                  }}
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
                      <img src={celebration.primaryImage} alt={celebration.alt ?? celebration.title} />
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
                    onToggle={() => toggleMobileSection('extraThemeDays')}
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
                    toggleMobileSection('themeDays');
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
                onToggle={() => toggleMobileSection('worldNationalDays')}
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
                onToggle={() => toggleMobileSection('upcoming')}
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

          <footer className="app-panel main-footer-meta">
            <div className="main-footer-links">
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
              <a
                className="source-link"
                href="https://sholiday.faboul.se/"
                target="_blank"
                rel="noreferrer"
              >
                {text.namedaySource}
              </a>
            </div>
            <div className="release-note-card release-note-card--subtle main-release-note-card">
              <p className="eyebrow">{text.releaseNotesLabel}</p>
              <p className="release-note-current">
                {currentReleaseNote?.shortSummary[locale] ?? buildStamp}
              </p>
              <button
                type="button"
                className="source-link source-link--button release-note-button"
                onClick={() => setShowReleaseNotes(true)}
              >
                {text.releaseNotesOpen}
              </button>
            </div>
            <span className="build-stamp">
              {text.buildInfoLabel} {buildStamp}
            </span>
          </footer>
        </div>
      </div>

      <AppDialogs
        showImageCredits={showImageCredits}
        showReleaseNotes={showReleaseNotes}
        onCloseImageCredits={() => setShowImageCredits(false)}
        onCloseReleaseNotes={() => setShowReleaseNotes(false)}
        locale={locale}
        contentPack={contentPack}
      />
    </div>
  );
}

function getCurrentCelebration(
  dayType: string,
  celebrations: Record<string, CelebrationContent>
): CelebrationContent | null {
  return dayType === 'ordinary' ? null : celebrations[dayType] ?? null;
}

function getKicker({
  celebration,
  hasThemeDays,
  displayThemeDaysCount,
  text,
}: {
  celebration: CelebrationContent | null;
  hasThemeDays: boolean;
  displayThemeDaysCount: number;
  text: (typeof appText)[Locale];
}) {
  if (celebration) {
    return celebration.kicker;
  }

  if (hasThemeDays) {
    return displayThemeDaysCount > 1
      ? text.unofficialThemeDays(displayThemeDaysCount)
      : text.unofficialThemeDay;
  }

  return text.noOfficialEnergy;
}

export default App;
