import { getFettisdag } from './dayLogic';

export interface SeasonalNote {
  id: string;
  label: string;
  title: string;
  note: string;
  meta: string;
}

type SeasonalWindow = SeasonalNote & {
  start: Date;
  end: Date;
  priority: number;
};

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return toDateOnly(result);
}

function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const value = toDateOnly(date).getTime();
  return value >= toDateOnly(start).getTime() && value <= toDateOnly(end).getTime();
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const date = new Date(year, month + 1, 0);

  while (date.getDay() !== weekday) {
    date.setDate(date.getDate() - 1);
  }

  return toDateOnly(date);
}

function buildSeasonalWindows(year: number): SeasonalWindow[] {
  const fettisdag = getFettisdag(year);
  const bokreanStart = getLastWeekdayOfMonth(year, 1, 2);
  const bokreanEnd = addDays(bokreanStart, 13);
  const blackWeekStart = new Date(year, 10, 23);
  const blackWeekEnd = new Date(year, 10, 30);

  return [
    {
      id: 'semmelsasongen',
      label: 'Säsong',
      title: 'Semmelsäsongen',
      note: 'Bagerihyllorna har tappat all återhållsamhet och hela landet låtsas att grädde är en rimlig vinterstrategi.',
      meta: `${formatShortDate(new Date(year, 0, 2))}-${formatShortDate(fettisdag)}`,
      start: new Date(year, 0, 2),
      end: fettisdag,
      priority: 90,
    },
    {
      id: 'bokrean',
      label: 'Säsong',
      title: 'Bokrean',
      note: 'Papper, impulsköp och den gamla svenska drömmen om att man plötsligt ska bli en människa som läser mer.',
      meta: `${formatShortDate(bokreanStart)}-${formatShortDate(bokreanEnd)}`,
      start: bokreanStart,
      end: bokreanEnd,
      priority: 100,
    },
    {
      id: 'prideveckor',
      label: 'Säsong',
      title: 'Pride-veckor',
      note: 'Regnbågar, gemenskap och ett ovanligt välgrundat motstånd mot att vara tråkig i onödan.',
      meta: `${formatShortDate(new Date(year, 6, 20))}-${formatShortDate(new Date(year, 7, 10))}`,
      start: new Date(year, 6, 20),
      end: new Date(year, 7, 10),
      priority: 60,
    },
    {
      id: 'kraftskiva',
      label: 'Säsong',
      title: 'Kräftskivesäsong',
      note: 'Pappershattar, dill och ett kollektivt beslut att små kräftor tydligen är en fullgod plan för sensommaren.',
      meta: `${formatShortDate(new Date(year, 7, 1))}-${formatShortDate(new Date(year, 8, 15))}`,
      start: new Date(year, 7, 1),
      end: new Date(year, 8, 15),
      priority: 85,
    },
    {
      id: 'halloween',
      label: 'Säsong',
      title: 'Halloween-säsong',
      note: 'Pumpor, smågodis och ett märkligt folkligt samförstånd om att plastspindlar höjer stämningen.',
      meta: `${formatShortDate(new Date(year, 9, 24))}-${formatShortDate(new Date(year, 10, 2))}`,
      start: new Date(year, 9, 24),
      end: new Date(year, 10, 2),
      priority: 70,
    },
    {
      id: 'black-week',
      label: 'Säsong',
      title: 'Black Week',
      note: 'Kampanjmailer, tillfällig panik och hela handeln i ett tillstånd av svartprissatt intensitet.',
      meta: `${formatShortDate(blackWeekStart)}-${formatShortDate(blackWeekEnd)}`,
      start: blackWeekStart,
      end: blackWeekEnd,
      priority: 75,
    },
    {
      id: 'julbord',
      label: 'Säsong',
      title: 'Julbordssäsong',
      note: 'Sill, skinka och den årliga svenska förmågan att förvandla buffé till moralisk plikt.',
      meta: `${formatShortDate(new Date(year, 10, 15))}-${formatShortDate(new Date(year, 11, 24))}`,
      start: new Date(year, 10, 15),
      end: new Date(year, 11, 24),
      priority: 95,
    },
    {
      id: 'julmarknad',
      label: 'Säsong',
      title: 'Julmarknadssäsong',
      note: 'Glögg, granris och små trästånd som försöker sälja värdighet i stearinbelyst tappning.',
      meta: `${formatShortDate(new Date(year, 10, 20))}-${formatShortDate(new Date(year, 11, 23))}`,
      start: new Date(year, 10, 20),
      end: new Date(year, 11, 23),
      priority: 80,
    },
  ];
}

export function getSeasonalNotes(inputDate: Date, maxItems = 2): SeasonalNote[] {
  const date = toDateOnly(inputDate);
  const windows = buildSeasonalWindows(date.getFullYear())
    .filter((item) => isWithinRange(date, item.start, item.end))
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return left.start.getTime() - right.start.getTime();
    })
    .slice(0, maxItems);

  return windows.map(({ id, label, title, note, meta }) => ({
    id,
    label,
    title,
    note,
    meta,
  }));
}
