import { getFettisdag } from './dayLogic';
import { getIntlLocale, Locale } from './locale';

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

function formatShortDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
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

function buildSeasonalWindows(year: number, locale: Locale): SeasonalWindow[] {
  const fettisdag = getFettisdag(year);
  const bokreanStart = getLastWeekdayOfMonth(year, 1, 2);
  const bokreanEnd = addDays(bokreanStart, 13);
  const blackWeekStart = new Date(year, 10, 23);
  const blackWeekEnd = new Date(year, 10, 30);

  return [
    {
      id: 'semmelsasongen',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: locale === 'en' ? 'Semla season' : 'Semmelsäsongen',
      note:
        locale === 'en'
          ? 'The bakery shelves have abandoned restraint and the whole country is pretending whipped cream is a valid winter strategy.'
          : 'Bagerihyllorna har tappat all återhållsamhet och hela landet låtsas att grädde är en rimlig vinterstrategi.',
      meta: `${formatShortDate(new Date(year, 0, 2), locale)}-${formatShortDate(fettisdag, locale)}`,
      start: new Date(year, 0, 2),
      end: fettisdag,
      priority: 90,
    },
    {
      id: 'bokrean',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: locale === 'en' ? 'The Book Sale' : 'Bokrean',
      note:
        locale === 'en'
          ? 'Paper, impulse buying, and the old Swedish dream that one might suddenly become a person who reads more.'
          : 'Papper, impulsköp och den gamla svenska drömmen om att man plötsligt ska bli en människa som läser mer.',
      meta: `${formatShortDate(bokreanStart, locale)}-${formatShortDate(bokreanEnd, locale)}`,
      start: bokreanStart,
      end: bokreanEnd,
      priority: 100,
    },
    {
      id: 'prideveckor',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: 'Pride-veckor',
      note:
        locale === 'en'
          ? 'Rainbows, solidarity, and an unusually well-founded resistance to being boring for no reason.'
          : 'Regnbågar, gemenskap och ett ovanligt välgrundat motstånd mot att vara tråkig i onödan.',
      meta: `${formatShortDate(new Date(year, 6, 20), locale)}-${formatShortDate(new Date(year, 7, 10), locale)}`,
      start: new Date(year, 6, 20),
      end: new Date(year, 7, 10),
      priority: 60,
    },
    {
      id: 'kraftskiva',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: locale === 'en' ? 'Crayfish party season' : 'Kräftskivesäsong',
      note:
        locale === 'en'
          ? 'Paper hats, dill, and a collective decision that small crayfish apparently constitute a complete plan for late summer.'
          : 'Pappershattar, dill och ett kollektivt beslut att små kräftor tydligen är en fullgod plan för sensommaren.',
      meta: `${formatShortDate(new Date(year, 7, 1), locale)}-${formatShortDate(new Date(year, 8, 15), locale)}`,
      start: new Date(year, 7, 1),
      end: new Date(year, 8, 15),
      priority: 85,
    },
    {
      id: 'halloween',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: locale === 'en' ? 'Halloween season' : 'Halloween-säsong',
      note:
        locale === 'en'
          ? 'Pumpkins, pick-and-mix, and a strangely broad social consensus that plastic spiders improve the atmosphere.'
          : 'Pumpor, smågodis och ett märkligt folkligt samförstånd om att plastspindlar höjer stämningen.',
      meta: `${formatShortDate(new Date(year, 9, 24), locale)}-${formatShortDate(new Date(year, 10, 2), locale)}`,
      start: new Date(year, 9, 24),
      end: new Date(year, 10, 2),
      priority: 70,
    },
    {
      id: 'black-week',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: 'Black Week',
      note:
        locale === 'en'
          ? 'Campaign emails, temporary panic, and retail in a state of black-priced intensity.'
          : 'Kampanjmailer, tillfällig panik och hela handeln i ett tillstånd av svartprissatt intensitet.',
      meta: `${formatShortDate(blackWeekStart, locale)}-${formatShortDate(blackWeekEnd, locale)}`,
      start: blackWeekStart,
      end: blackWeekEnd,
      priority: 75,
    },
    {
      id: 'julbord',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: locale === 'en' ? 'Christmas buffet season' : 'Julbordssäsong',
      note:
        locale === 'en'
          ? 'Herring, ham, and the annual Swedish ability to turn buffet food into a moral obligation.'
          : 'Sill, skinka och den årliga svenska förmågan att förvandla buffé till moralisk plikt.',
      meta: `${formatShortDate(new Date(year, 10, 15), locale)}-${formatShortDate(new Date(year, 11, 24), locale)}`,
      start: new Date(year, 10, 15),
      end: new Date(year, 11, 24),
      priority: 95,
    },
    {
      id: 'julmarknad',
      label: locale === 'en' ? 'Season' : 'Säsong',
      title: locale === 'en' ? 'Christmas market season' : 'Julmarknadssäsong',
      note:
        locale === 'en'
          ? 'Mulled wine, spruce branches, and small wooden stalls trying to sell dignity by candlelight.'
          : 'Glögg, granris och små trästånd som försöker sälja värdighet i stearinbelyst tappning.',
      meta: `${formatShortDate(new Date(year, 10, 20), locale)}-${formatShortDate(new Date(year, 11, 23), locale)}`,
      start: new Date(year, 10, 20),
      end: new Date(year, 11, 23),
      priority: 80,
    },
  ];
}

export function getSeasonalNotes(
  inputDate: Date,
  locale: Locale = 'sv',
  maxItems = 2
): SeasonalNote[] {
  const date = toDateOnly(inputDate);
  const windows = buildSeasonalWindows(date.getFullYear(), locale)
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
