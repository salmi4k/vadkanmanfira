import React from 'react';
import { MainCelebrationCard } from './MainCelebrationCard';
import { MainFooterMeta } from './MainFooterMeta';
import { SharePanel } from './SharePanel';
import { Locale } from '../locale';
import { appText } from '../appText';
import { CelebrationContent } from '../features/celebrations/celebrations';
import { MobileSectionKey } from '../appTypes';
import { NationalDayPanel } from '../features/national-days/nationalDays';
import { UpcomingNotable } from '../features/upcoming/upcomingNotables';
import { ShareableCelebration } from '../features/shareability/shareability';

type AppMainColumnProps = {
  centerDate: string;
  celebration: CelebrationContent | null;
  canReroll: boolean;
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
  shareable: ShareableCelebration | null;
};

export function AppMainColumn({
  centerDate,
  celebration,
  canReroll,
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
  shareable,
}: AppMainColumnProps) {
  return (
    <div className="app-main-column">
      <MainCelebrationCard
        key={centerDate}
        centerDate={centerDate}
        celebration={celebration}
        canReroll={canReroll}
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

      <SharePanel locale={locale} shareable={shareable} />

      <MainFooterMeta
        locale={locale}
        onOpenImageCredits={onOpenImageCredits}
        onOpenReleaseNotes={onOpenReleaseNotes}
      />
    </div>
  );
}
