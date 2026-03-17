import { RefObject, useEffect, useRef, useState } from 'react';
import { formatForInput } from '../dateUtils';
import { getInitialMobileLayout } from '../appHelpers';
import { getInitialLocale, Locale, persistLocale } from '../locale';
import { MobileSectionKey } from '../appTypes';

const initialExpandedSections: Record<MobileSectionKey, boolean> = {
  holiday: false,
  season: false,
  upcoming: true,
  themeDays: true,
  extraThemeDays: true,
  worldNationalDays: true,
};

type UseAppShellStateArgs = {
  initialDate: Date;
};

export function useAppShellState({ initialDate }: UseAppShellStateArgs) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showImageCredits, setShowImageCredits] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(getInitialMobileLayout);
  const [expandedSections, setExpandedSections] = useState(initialExpandedSections);
  const [selectedDate, setSelectedDate] = useState(formatForInput(initialDate));
  const shouldScrollAfterDateCommitRef = useRef(false);

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
    setShowLanguageMenu(false);
  }, [locale]);

  function handleDateChange(nextDate: string): void {
    setSelectedDate(nextDate);
    shouldScrollAfterDateCommitRef.current = isMobileLayout;
  }

  function jumpToDate(
    nextDate: string,
    mainCardRef?: RefObject<HTMLElement | null>
  ): void {
    setSelectedDate(nextDate);
    shouldScrollAfterDateCommitRef.current = false;

    if (!isMobileLayout || !mainCardRef || typeof window === 'undefined') {
      return;
    }

    window.setTimeout(() => {
      mainCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);
  }

  function handleDateCommit(mainCardRef: RefObject<HTMLElement | null>): void {
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

  return {
    expandedSections,
    isMobileLayout,
    locale,
    selectedDate,
    setLocale,
    showImageCredits,
    setShowImageCredits,
    showLanguageMenu,
    setShowLanguageMenu,
    showReleaseNotes,
    setShowReleaseNotes,
    handleDateChange,
    handleDateCommit,
    jumpToDate,
    toggleMobileSection,
  };
}
