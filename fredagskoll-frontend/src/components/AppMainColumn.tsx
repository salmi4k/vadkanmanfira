import React from 'react';
import { MainCelebrationCard } from './MainCelebrationCard';
import { MainFooterMeta } from './MainFooterMeta';
import { EngagementPanel } from './EngagementPanel';
import { Locale } from '../locale';
import { Mood } from '../mood';
import { appText } from '../appText';
import { CelebrationContent } from '../features/celebrations/celebrations';
import { MobileSectionKey } from '../appTypes';
import { NationalDayPanel } from '../features/national-days/nationalDays';
import { UpcomingNotable } from '../features/upcoming/upcomingNotables';
import { FikaSuggestion } from '../features/engagement/engagement';

type AppMainColumnProps = {
  buildStamp: string;
  categoryLabel: string | null;
  centerDate: string;
  celebration: CelebrationContent | null;
  compactPrimaryMedia: boolean;
  currentBlurbs: string[] | null;
  displayThemeDays: string[];
  expandedSections: Record<MobileSectionKey, boolean>;
  extraDisplayThemeDays: string[];
  extraThemeDayLead: string | null;
  hasThemeDays: boolean;
  isAiBundleLoading: boolean;
  isAiRerolling: boolean;
  kicker: string;
  locale: Locale;
  mainCardRef: React.RefObject<HTMLElement | null>;
  mainTitle: string;
  mood: Mood;
  moodLabel: string;
  fikaSuggestion: FikaSuggestion;
  nationalDayPanel: NationalDayPanel | null;
  onOpenImageCredits: () => void;
  onOpenReleaseNotes: () => void;
  onReroll: () => void;
  onStepDate: (days: number) => void;
  onToggleMobileSection: (section: MobileSectionKey) => void;
  text: (typeof appText)[Locale];
  themeDayCardNote: string;
  themeDayDisplayTitle: string | null;
  themeDayTitleEnding: string;
  upcomingNotables: UpcomingNotable[];
  visibleBlurb: string;
  scoreLabel: string;
};

export function AppMainColumn({
  buildStamp,
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
  fikaSuggestion,
  nationalDayPanel,
  onOpenImageCredits,
  onOpenReleaseNotes,
  onReroll,
  onStepDate,
  onToggleMobileSection,
  text,
  themeDayCardNote,
  themeDayDisplayTitle,
  themeDayTitleEnding,
  upcomingNotables,
  visibleBlurb,
  scoreLabel,
}: AppMainColumnProps) {
  return (
    <div className="app-main-column">
      <MainCelebrationCard
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
        moodLabel={moodLabel}
        scoreLabel={scoreLabel}
        nationalDayPanel={nationalDayPanel}
        onReroll={onReroll}
        onStepDate={onStepDate}
        onToggleMobileSection={onToggleMobileSection}
        text={text}
        themeDayCardNote={themeDayCardNote}
        themeDayDisplayTitle={themeDayDisplayTitle}
        themeDayTitleEnding={themeDayTitleEnding}
        upcomingNotables={upcomingNotables}
        visibleBlurb={visibleBlurb}
      />

      <EngagementPanel
        categoryLabel={categoryLabel}
        fikaSuggestion={fikaSuggestion}
        scoreLabel={scoreLabel}
      />

      <MainFooterMeta
        buildStamp={buildStamp}
        locale={locale}
        onOpenImageCredits={onOpenImageCredits}
        onOpenReleaseNotes={onOpenReleaseNotes}
      />
    </div>
  );
}
