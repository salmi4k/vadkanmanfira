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
    'För övrigt firar {lead} idag. Det vore småaktigt att inte ge det en liten nick.',
    '{lead} kör nationaldagsläge idag, och det förtjänar ändå viss respekt.',
  ],
  en: [
    '{lead} is clearly operating at a more ceremonial level than this calendar first suggested.',
    '{lead} marks a national day today, which gives the date at least some international posture.',
    'Elsewhere, {lead} is celebrating today. One should at least acknowledge that much.',
    '{lead} is in full national-day mode today, and that deserves a measured nod.',
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

function buildSummary(items: NationalDayItem[], hiddenCount: number, dateKey: string, locale: Locale): string {
  const totalCount = items.length + hiddenCount;
  const visibleLead = buildLead(items, locale);
  const lead =
    hiddenCount > 0
      ? locale === 'en'
        ? `${visibleLead}, plus ${hiddenCount} more`
        : `${visibleLead}, plus ${hiddenCount} till`
      : visibleLead;

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
