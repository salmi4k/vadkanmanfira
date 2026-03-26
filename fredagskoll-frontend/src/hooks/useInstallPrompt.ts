import { useEffect, useState } from 'react';

type BeforeInstallPromptEventLike = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

export function useInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEventLike | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEventLike);
    };

    const handleAppInstalled = () => {
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!installEvent) {
      return false;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (!choice || choice.outcome !== 'accepted') {
      return false;
    }

    setInstallEvent(null);
    return true;
  }

  return {
    canInstall: installEvent !== null,
    promptInstall,
  };
}
