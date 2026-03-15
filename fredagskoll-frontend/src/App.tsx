import React, { useMemo, useRef } from 'react';
import './App.css';
import { appText } from './appText';
import { IntroPanel } from './components/IntroPanel';
import { AppDialogs } from './components/AppDialogs';
import { AppMainColumn } from './components/AppMainColumn';
import { formatBuildStamp } from './appHelpers';
import {
  usesCompactPrimaryMedia,
} from './features/celebrations/celebrationPresentation';
import {
  getCelebrations,
  getCelebrationThemeAliases,
  getOrdinaryBlurb,
} from './features/celebrations/celebrations';
import { ContentPack, getActiveContentPack } from './contentPack';
import {
  addDays,
  formatCenterDate,
  formatForHumans,
  formatForInput,
  getDaysUntil,
} from './dateUtils';
import { getDayStatus, getUpcomingOfficialHolidayInWeek } from './dayLogic';
import { translateOfficialHolidayName, translateThemeDayName } from './locale';
import { getNationalDayPanel } from './features/national-days/nationalDays';
import { getSeasonalNotes } from './features/upcoming/seasonalNotes';
import { getMoodLabel } from './mood';
import {
  buildThemeDayBlurbs,
  filterThemeDays,
} from './features/theme-days/themeDayBlurbs';
import { getThemeDaysForDate } from './features/theme-days/temadagar';
import { getUpcomingNotables } from './features/upcoming/upcomingNotables';
import { useAiContent } from './features/ai/useAiContent';
import { useNameDays } from './features/name-days/useNameDays';
import {
  getCategoryLabel,
  getDailyFikaSuggestion,
  getEngagementScoreLabel,
  pickSurpriseDate,
  scoreEngagementSnapshot,
} from './features/engagement/engagement';
import {
  buildAiRequest,
  buildMainCardViewModel,
  getCurrentCelebration,
} from './appViewModel';
import { useAppShellState } from './hooks/useAppShellState';

type AppProps = {
  initialDate?: Date;
  contentPack?: ContentPack;
};

function App({
  initialDate = new Date(),
  contentPack = getActiveContentPack(),
}: AppProps) {
  const mainCardRef = useRef<HTMLElement | null>(null);
  const {
    darkMode,
    expandedSections,
    handleDateChange,
    handleDateCommit,
    isMobileLayout,
    locale,
    mood,
    selectedDate,
    setDarkMode,
    setLocale,
    setMood,
    setShowImageCredits,
    setShowLanguageMenu,
    setShowReleaseNotes,
    showImageCredits,
    showLanguageMenu,
    showReleaseNotes,
    toggleMobileSection,
    jumpToDate,
  } = useAppShellState({ initialDate });

  const text = appText[locale];
  const buildStamp = useMemo(() => formatBuildStamp(locale), [locale]);
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
  const engagementSnapshot = useMemo(
    () => scoreEngagementSnapshot(selectedDateObject, contentPack),
    [contentPack, selectedDateObject]
  );
  const categoryLabel = useMemo(
    () => getCategoryLabel(engagementSnapshot.category, locale),
    [engagementSnapshot.category, locale]
  );
  const scoreLabel = useMemo(
    () => getEngagementScoreLabel(engagementSnapshot.score, locale),
    [engagementSnapshot.score, locale]
  );
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
  const {
    extraThemeDayLead,
    kicker,
    themeDayDisplayTitle,
  } = buildMainCardViewModel({
    celebration,
    contentPack,
    dayType: dayStatus.dayType,
    displayThemeDays,
    hasThemeDays,
    locale,
    text,
  });
  const isWeekend = selectedDateObject.getDay() === 0 || selectedDateObject.getDay() === 6;

  const aiRequest = useMemo(() => buildAiRequest({
    celebration,
    contentPack,
    dayType: dayStatus.dayType,
    dateLabel: dayStatus.dateLabel,
    displayThemeDays,
    extraDisplayThemeDays,
    fallbackKicker: kicker,
    hasThemeDays,
    isWeekend,
    locale,
    mood,
    nationalDayPanel,
    selectedDate,
    seasonalNotes,
    themeDayBlurbs,
    themeDayDisplayTitle,
    upcomingHolidayName,
    upcomingNotables,
  }), [
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
  const fikaSuggestion = useMemo(
    () =>
      getDailyFikaSuggestion({
        celebration:
          dayStatus.dayType === 'ordinary' ? null : dayStatus.dayType,
        category: engagementSnapshot.category,
        themeDays: displayThemeDays,
        locale,
        mood,
        score: engagementSnapshot.score,
      }),
    [
      dayStatus.dayType,
      displayThemeDays,
      engagementSnapshot.category,
      engagementSnapshot.score,
      locale,
      mood,
    ]
  );

  const mainTitle = celebration
    ? celebration.title
    : hasThemeDays
      ? `${themeDayDisplayTitle}. ${themeDayTitleEnding}`
      : aiRequest.title;

  function stepSelectedDate(days: number): void {
    handleDateChange(formatForInput(addDays(selectedDateObject, days)));
  }

  function handleSurpriseDate(): void {
    const surprise = pickSurpriseDate(selectedDateObject, contentPack);
    jumpToDate(formatForInput(surprise.date), mainCardRef);
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
          onDateCommit={() => handleDateCommit(mainCardRef)}
          onSurpriseDate={handleSurpriseDate}
          onToggleMobileSection={toggleMobileSection}
        />

        <AppMainColumn
          buildStamp={buildStamp}
          categoryLabel={categoryLabel}
          centerDate={centerDate}
          celebration={celebration}
          compactPrimaryMedia={compactPrimaryMedia}
          currentBlurbs={currentBlurbs}
          displayThemeDays={displayThemeDays}
          expandedSections={expandedSections}
          extraDisplayThemeDays={extraDisplayThemeDays}
          extraThemeDayLead={extraThemeDayLead}
          hasThemeDays={hasThemeDays}
          isAiBundleLoading={isAiBundleLoading}
          isAiRerolling={isAiRerolling}
          kicker={kicker}
          locale={locale}
          mainCardRef={mainCardRef}
          mainTitle={mainTitle}
          mood={mood}
          moodLabel={getMoodLabel(mood, locale)}
          fikaSuggestion={fikaSuggestion}
          nationalDayPanel={nationalDayPanel}
          onOpenImageCredits={() => setShowImageCredits(true)}
          onOpenReleaseNotes={() => setShowReleaseNotes(true)}
          onReroll={() => {
            void handleReroll();
          }}
          onStepDate={stepSelectedDate}
          onToggleMobileSection={toggleMobileSection}
          text={text}
          themeDayCardNote={themeDayCardNote}
          themeDayDisplayTitle={themeDayDisplayTitle}
          themeDayTitleEnding={themeDayTitleEnding}
          upcomingNotables={upcomingNotables}
          visibleBlurb={blurb}
          scoreLabel={scoreLabel}
        />
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

export default App;
