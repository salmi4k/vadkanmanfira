import nationalDaysByDate from './data/nationalDaysByDate.json';
import { Locale } from './locale';

type NationalDayRecord = {
  nation: string;
  significance: string;
  description: string;
};

export interface NationalDayItem {
  nation: string;
  significance: string;
  description: string;
}

export interface NationalDayPanel {
  items: NationalDayItem[];
  hiddenCount: number;
  summary: string;
}

const significanceTranslations: Record<string, string> = {
  'Independence Day': 'Självständighetsdagen',
  'National day': 'Nationaldagen',
  'National Day': 'Nationaldagen',
  'Republic Day': 'Republikens dag',
  'Constitution Day': 'Grundlagsdagen',
  'Statehood Day': 'Statsdagen',
  'Liberation Day': 'Befrielsedagen',
  'National Anthem and Flag Day': 'Nationalflaggans och nationalsångens dag',
  'Autonomy Day': 'Självstyrelsedagen',
  'National Acadian Day': 'Akadiens nationaldag',
  'Africa Day': 'Afrikadagen',
  'ASEAN Day': 'ASEAN-dagen',
  'Australia Day': 'Australiendagen',
  'May Revolution Day': 'Majrevolutionens dag',
  "Saint George's Day": 'Sankt Georgsdagen',
  'Homecoming Day': 'Hemkomstdagen',
  'Flag Day': 'Flaggdagen',
  'Our Lady of Meritxell Day': 'Meritxells dag',
  'Our Lady of Covadonga Day': 'Covadongas dag',
  'Day of the Balearic Islands': 'Balearernas dag',
};

const summaryTemplates: Record<Locale, string[]> = {
  sv: [
    '{lead} har uppenbarligen högre ceremoniell ambition än den här kalendern först antydde.',
    '{lead} markerar sin stora dag idag, vilket åtminstone ger datumet en lätt internationell resning.',
    'För övrigt firar {lead} idag. Det vore småaktigt att inte låta dem ta lite plats.',
    '{lead} kör nationaldagsläge idag, och det förtjänar ändå något mer än ett stelt hummande.',
    'Datumet är inte bara ditt längre. {lead} har också blåst upp fanorna och tänker tydligen bli tagna på allvar.',
    '{lead} har bestämt sig för att höja den ceremoniella ribban idag, och resten av kalendern får bara anpassa sig.',
    'Man får ge datumet detta: {lead} vägrar låta det passera utan någon form av nationell hållning.',
    '{lead} gör sitt bästa för att ge dagen internationell ryggrad. Det får man ändå uppskatta.',
  ],
  en: [
    '{lead} is clearly operating at a more ceremonial level than this calendar first suggested.',
    '{lead} marks a national day today, which gives the date at least some international posture.',
    'Elsewhere, {lead} is celebrating today. It would be petty not to let that take up a little room.',
    '{lead} is in full national-day mode today, and that deserves something more than a stiff nod.',
    'The date is not yours alone. {lead} has also hauled up the flags and apparently expects to be taken seriously.',
    '{lead} has decided to raise the ceremonial bar today, and the rest of the calendar can simply adapt.',
    'One has to give the date this much: {lead} refuses to let it pass without some national posture.',
    '{lead} is doing its best to give the day some international spine. Fair enough.',
  ],
};

function formatDateKey(date: Date): string {
  return `${date.getMonth() + 1}`.padStart(2, '0') + `-${`${date.getDate()}`.padStart(2, '0')}`;
}

function localizeSignificance(significance: string, locale: Locale): string {
  if (locale === 'en') {
    return significance;
  }

  return significanceTranslations[significance] ?? significance;
}

function pickVariant(seed: string, options: string[]): string {
  const value = seed.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return options[value % options.length];
}

function buildLead(items: NationalDayItem[], locale: Locale): string {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0].nation;
  }

  if (items.length === 2) {
    return locale === 'en'
      ? `${items[0].nation} and ${items[1].nation}`
      : `${items[0].nation} och ${items[1].nation}`;
  }

  const conjunction = locale === 'en' ? 'and' : 'och';
  return `${items[0].nation}, ${items[1].nation} ${conjunction} ${items.length - 2} till`;
}

function buildLeadWithHiddenCount(visibleLead: string, hiddenCount: number, locale: Locale): string {
  if (hiddenCount === 0) {
    return visibleLead;
  }

  return locale === 'en'
    ? `${visibleLead}, plus ${hiddenCount} more`
    : `${visibleLead}, plus ${hiddenCount} till`;
}

function buildSingleItemSummary(
  item: NationalDayItem,
  dateKey: string,
  locale: Locale
): string {
  const significance = item.significance.toLowerCase();
  const templates =
    locale === 'en'
      ? [
          `${item.nation} is marking ${significance} today, which is a fairly strong way to keep a date from looking anonymous.`,
          `${item.nation} has ${significance} today. That gives the calendar a little more backbone than usual.`,
          `Today belongs partly to ${item.nation}, with ${significance} adding some actual posture to the date.`,
          `${item.nation} is not sleepwalking through today. It is showing up with ${significance} and a fairly clear sense of itself.`,
          `${item.nation} is busy celebrating ${significance} today, which frankly adds more structure than many ordinary weekdays manage.`,
        ]
      : [
          `${item.nation} markerar ${significance} idag, vilket är ett ganska effektivt sätt att hindra datumet från att se anonymt ut.`,
          `${item.nation} har ${significance} idag. Det ger kalendern mer ryggrad än vanligt.`,
          `Idag tillhör delvis ${item.nation}, med ${significance} som tillför lite faktisk hållning till datumet.`,
          `${item.nation} släpar sig inte genom dagen. De dyker upp med ${significance} och en rätt tydlig självbild.`,
          `${item.nation} firar ${significance} idag, och det tillför ärligt talat mer struktur än många vanliga vardagar lyckas med.`,
        ];

  return pickVariant(`${dateKey}-${item.nation}-${locale}`, templates);
}

function buildSummary(items: NationalDayItem[], hiddenCount: number, dateKey: string, locale: Locale): string {
  const totalCount = items.length + hiddenCount;
  const visibleLead = buildLead(items, locale);
  const lead = buildLeadWithHiddenCount(visibleLead, hiddenCount, locale);

  if (totalCount === 1) {
    return buildSingleItemSummary(items[0], dateKey, locale);
  }

  return pickVariant(`${dateKey}-${totalCount}-${locale}`, summaryTemplates[locale]).replace(
    '{lead}',
    lead
  );
}

export function getNationalDayPanel(
  date: Date,
  locale: Locale = 'sv',
  limit = 4
): NationalDayPanel | null {
  const dateKey = formatDateKey(date);
  const rawItems = ((nationalDaysByDate as Record<string, NationalDayRecord[]>)[dateKey] ?? [])
    .filter((item) => item.nation !== 'Sweden')
    .map((item) => ({
      nation: item.nation,
      significance: localizeSignificance(item.significance, locale),
      description: item.description,
    }));

  if (rawItems.length === 0) {
    return null;
  }

  const items = rawItems.slice(0, limit);
  const hiddenCount = Math.max(0, rawItems.length - limit);

  return {
    items,
    hiddenCount,
    summary: buildSummary(items, hiddenCount, dateKey, locale),
  };
}
