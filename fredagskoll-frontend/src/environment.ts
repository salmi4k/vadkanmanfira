export function isAiObservabilityEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_AI_OBSERVABILITY === 'true';
}
