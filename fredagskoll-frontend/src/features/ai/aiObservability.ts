import type { AiBlurbBundle } from './aiBlurbs';

export type AiResolvedSource = 'unknown' | 'azure-openai' | 'cache' | 'fallback';
export type AiResolvedSourceState =
  | {
      status: 'loading';
      source: 'unknown';
    }
  | {
      status: 'resolved';
      source: Exclude<AiResolvedSource, 'unknown'>;
    };

export type AiRerollOutcomeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'fresh-ai' }
  | { status: 'reused-ai' }
  | { status: 'local-fallback' };

export type AiObservabilityState = {
  resolvedSource: AiResolvedSourceState;
  rerollOutcome: AiRerollOutcomeState;
};

export function getResolvedSourceState(args: {
  aiBundle: AiBlurbBundle | null;
  isLoading: boolean;
}): AiResolvedSourceState {
  if (args.isLoading) {
    return {
      status: 'loading',
      source: 'unknown',
    };
  }

  return {
    status: 'resolved',
    source: args.aiBundle?.source ?? 'fallback',
  };
}

export function getIdleRerollOutcomeState(): AiRerollOutcomeState {
  return { status: 'idle' };
}

export function getLoadingRerollOutcomeState(): AiRerollOutcomeState {
  return { status: 'loading' };
}

export function classifyRerollOutcome(args: {
  rerolledBundle: AiBlurbBundle;
  previousAiBundle: AiBlurbBundle | null;
}): AiRerollOutcomeState {
  if (args.rerolledBundle.blurbs.length > 0) {
    return { status: 'fresh-ai' };
  }

  if (args.previousAiBundle?.blurbs.length) {
    return { status: 'reused-ai' };
  }

  return { status: 'local-fallback' };
}
