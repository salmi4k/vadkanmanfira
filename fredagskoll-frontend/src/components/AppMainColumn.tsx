import React from 'react';
import { MainCelebrationCard } from './MainCelebrationCard';
import { MainFooterMeta } from './MainFooterMeta';
import { Locale } from '../locale';
import { Mood } from '../mood';
import { appText } from '../appText';
import { CelebrationContent } from '../features/celebrations/celebrations';
import { MobileSectionKey } from '../appTypes';
import { NationalDayPanel } from '../features/national-days/nationalDays';
import { UpcomingNotable } from '../features/upcoming/upcomingNotables';

type AppMainColumnProps = {
  buildStamp: string;
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
};

export function AppMainColumn({
  buildStamp,
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
}: AppMainColumnProps) {
  return (
    <div className="app-main-column">
      <MainCelebrationCard
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

      <MainFooterMeta
        buildStamp={buildStamp}
        locale={locale}
        onOpenImageCredits={onOpenImageCredits}
        onOpenReleaseNotes={onOpenReleaseNotes}
      />
    </div>
  );
}
