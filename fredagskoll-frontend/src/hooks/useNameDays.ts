import { useEffect, useState } from 'react';
import { fetchNameDays } from '../nameDays';

export type NameDayState = 'loading' | 'ready' | 'error';

export function useNameDays(dateLabel: string) {
  const [nameDays, setNameDays] = useState<string[]>([]);
  const [nameDayState, setNameDayState] = useState<NameDayState>('loading');

  useEffect(() => {
    let isCurrent = true;

    setNameDayState('loading');

    fetchNameDays(dateLabel)
      .then((names) => {
        if (!isCurrent) {
          return;
        }

        setNameDays(names);
        setNameDayState('ready');
      })
      .catch(() => {
        if (!isCurrent) {
          return;
        }

        setNameDays([]);
        setNameDayState('error');
      });

    return () => {
      isCurrent = false;
    };
  }, [dateLabel]);

  return { nameDays, nameDayState };
}
