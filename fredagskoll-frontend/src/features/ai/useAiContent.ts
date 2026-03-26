import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiBlurbBundle, AiBlurbRequest, fetchAiBlurbBundle } from './aiBlurbs';
import { getOrdinaryDayBlurbs } from '../celebrations/celebrations';
import {
  getOrdinaryThemeDayCardNotes,
  getOrdinaryThemeDayTitleEndings,
} from '../../editorialText';
import { Locale } from '../../locale';
import { Mood } from '../../mood';
import { getRandomItem } from '../../appHelpers';

type AiBundleState = 'loading' | 'ready' | 'fallback';

type CelebrationLike = {
  blurbs: string[];
};

function hasUsableBlurbs(bundle: AiBlurbBundle | null): bundle is AiBlurbBundle {
  return Boolean(bundle?.blurbs.length);
}

type UseAiContentArgs = {
  aiRequest: AiBlurbRequest;
  ordinaryBlurb: string;
  locale: Locale;
  mood: Mood;
  selectedDate: string;
  celebration: CelebrationLike | null;
  themeDayBlurbs: string[] | null;
  dayType: string;
  isWeekend: boolean;
  hasThemeDays: boolean;
  themeDayDisplayTitle: string | null;
};

export function useAiContent({
  aiRequest,
  ordinaryBlurb,
  locale,
  mood,
  selectedDate,
  celebration,
  themeDayBlurbs,
  dayType,
  isWeekend,
  hasThemeDays,
  themeDayDisplayTitle,
}: UseAiContentArgs) {
  const [aiBundle, setAiBundle] = useState<AiBlurbBundle | null>(null);
  const [aiBundleState, setAiBundleState] = useState<AiBundleState>('loading');
  const [resolvedAiRequestKey, setResolvedAiRequestKey] = useState<string | null>(null);
  const [isAiRerolling, setIsAiRerolling] = useState(false);
  const [blurb, setBlurb] = useState(ordinaryBlurb);
  const [themeDayTitleEnding, setThemeDayTitleEnding] = useState(
    getOrdinaryThemeDayTitleEndings(locale, mood)[0]
  );
  const [themeDayCardNote, setThemeDayCardNote] = useState(
    getOrdinaryThemeDayCardNotes(locale, mood)[0]
  );

  const aiRequestKey = useMemo(() => JSON.stringify(aiRequest), [aiRequest]);
  const isAiBundleLoading =
    aiBundleState === 'loading' || resolvedAiRequestKey !== aiRequestKey;
  const canReroll =
    aiBundle !== null &&
    resolvedAiRequestKey === aiRequestKey &&
    aiBundleState === 'ready';

  const currentBlurbs = useMemo(() => {
    if (resolvedAiRequestKey === aiRequestKey && hasUsableBlurbs(aiBundle)) {
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

    if (dayType !== 'ordinary') {
      return null;
    }

    return getOrdinaryDayBlurbs(locale, isWeekend, mood);
  }, [
    aiBundle,
    aiRequestKey,
    celebration,
    dayType,
    isAiBundleLoading,
    isWeekend,
    locale,
    mood,
    resolvedAiRequestKey,
    themeDayBlurbs,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    setAiBundle(null);
    setAiBundleState('loading');
    setResolvedAiRequestKey(null);

    Promise.resolve(fetchAiBlurbBundle(aiRequest, controller.signal))
      .then((bundle) => {
        if (bundle === null) {
          setAiBundle(null);
          setResolvedAiRequestKey(aiRequestKey);
          setAiBundleState('fallback');
          return;
        }

        setAiBundle(bundle);
        setResolvedAiRequestKey(aiRequestKey);
        setAiBundleState('ready');
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setAiBundle(null);
        setResolvedAiRequestKey(aiRequestKey);
        setAiBundleState('fallback');
      });

    return () => {
      controller.abort();
    };
  }, [aiRequest, aiRequestKey]);

  useEffect(() => {
    if (isAiBundleLoading) {
      return;
    }

    if (!currentBlurbs) {
      setBlurb(ordinaryBlurb);
      return;
    }

    setBlurb(getRandomItem(currentBlurbs, ordinaryBlurb));
  }, [currentBlurbs, isAiBundleLoading, ordinaryBlurb, selectedDate]);

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
  }, [aiBundle, celebration, locale, mood, selectedDate, themeDayDisplayTitle]);

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
  }, [aiBundle, celebration, hasThemeDays, locale, mood, selectedDate]);

  const handleReroll = useCallback(async () => {
    if (!currentBlurbs) {
      return;
    }

    if (!canReroll) {
      setBlurb((currentBlurb) => getRandomItem(currentBlurbs, ordinaryBlurb, currentBlurb));
      return;
    }

    setIsAiRerolling(true);

    try {
      const rerolledBundle = await fetchAiBlurbBundle(
        {
          ...aiRequest,
          requestMode: 'reroll',
        },
        undefined
      );

      if (rerolledBundle) {
        const nextBlurbs = hasUsableBlurbs(rerolledBundle)
          ? rerolledBundle.blurbs
          : hasUsableBlurbs(aiBundle)
            ? aiBundle.blurbs
            : currentBlurbs;
        const nextBundle = nextBlurbs
          ? {
              ...rerolledBundle,
              blurbs: nextBlurbs,
            }
          : rerolledBundle;

        setAiBundle(nextBundle);
        setResolvedAiRequestKey(aiRequestKey);
        setAiBundleState('ready');
        if (nextBlurbs) {
          setBlurb((currentBlurb) => getRandomItem(nextBlurbs, ordinaryBlurb, currentBlurb));
        }
        return;
      }
    } catch {
      // Fall back to a local reroll when the extra AI fetch is unavailable.
    } finally {
      setIsAiRerolling(false);
    }

    setBlurb((currentBlurb) => getRandomItem(currentBlurbs, ordinaryBlurb, currentBlurb));
  }, [
    aiBundle,
    aiBundleState,
    aiRequest,
    aiRequestKey,
    canReroll,
    currentBlurbs,
    ordinaryBlurb,
    resolvedAiRequestKey,
  ]);

  return {
    blurb,
    canReroll,
    currentBlurbs,
    handleReroll,
    isAiBundleLoading,
    isAiRerolling,
    themeDayCardNote,
    themeDayTitleEnding,
  };
}
