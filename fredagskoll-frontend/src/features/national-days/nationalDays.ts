import nationalDaysByDate from '../../data/nationalDaysByDate.json';
import nationalDayNationsSv from '../../data/nationalDayNations.sv.json';
import nationalDayNationsPtBr from '../../data/nationalDayNations.pt-BR.json';
import nationalDaySignificancesPtBr from '../../data/nationalDaySignificances.pt-BR.json';
import { Locale } from '../../locale';

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

const significanceTranslations: Record<string, Partial<Record<Locale, string>>> = {
  'Independence Day': {
    sv: 'Självständighetsdagen',
    'pt-BR': 'Dia da Independência',
  },
  'National day': {
    sv: 'Nationaldagen',
    'pt-BR': 'Dia Nacional',
  },
  'National Day': {
    sv: 'Nationaldagen',
    'pt-BR': 'Dia Nacional',
  },
  'Republic Day': {
    sv: 'Republikens dag',
    'pt-BR': 'Dia da República',
  },
  'Constitution Day': {
    sv: 'Grundlagsdagen',
    'pt-BR': 'Dia da Constituição',
  },
  'Statehood Day': {
    sv: 'Statsdagen',
    'pt-BR': 'Dia do Estatuto',
  },
  'Liberation Day': {
    sv: 'Befrielsedagen',
    'pt-BR': 'Dia da Libertação',
  },
  'National Anthem and Flag Day': {
    sv: 'Nationalflaggans och nationalsångens dag',
    'pt-BR': 'Dia do Hino Nacional e da Bandeira',
  },
  'Autonomy Day': {
    sv: 'Självstyrelsedagen',
    'pt-BR': 'Dia da Autonomia',
  },
  'National Acadian Day': {
    sv: 'Akadiens nationaldag',
    'pt-BR': 'Dia Nacional Acadiano',
  },
  'Africa Day': {
    sv: 'Afrikadagen',
    'pt-BR': 'Dia da África',
  },
  'ASEAN Day': {
    sv: 'ASEAN-dagen',
    'pt-BR': 'Dia da ASEAN',
  },
  'Australia Day': {
    sv: 'Australiendagen',
    'pt-BR': 'Dia da Austrália',
  },
  'May Revolution Day': {
    sv: 'Majrevolutionens dag',
    'pt-BR': 'Dia da Revolução de Maio',
  },
  "Saint George's Day": {
    sv: 'Sankt Georgsdagen',
    'pt-BR': 'Dia de São Jorge',
  },
  'Homecoming Day': {
    sv: 'Hemkomstdagen',
    'pt-BR': 'Dia do Retorno',
  },
  'Flag Day': {
    sv: 'Flaggdagen',
    'pt-BR': 'Dia da Bandeira',
  },
  'Our Lady of Meritxell Day': {
    sv: 'Meritxells dag',
    'pt-BR': 'Dia de Nossa Senhora de Meritxell',
  },
  'Our Lady of Covadonga Day': {
    sv: 'Covadongas dag',
    'pt-BR': 'Dia de Nossa Senhora de Covadonga',
  },
  'Day of the Balearic Islands': {
    sv: 'Balearernas dag',
    'pt-BR': 'Dia das Ilhas Baleares',
  },
};

const swedishNationTranslations = nationalDayNationsSv as Record<string, string>;
const portugueseNationTranslations = nationalDayNationsPtBr as Record<string, string>;
const portugueseSignificanceTranslations = nationalDaySignificancesPtBr as Record<string, string>;

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
  'pt-BR': [
    '{lead} está claramente operando em um nível cerimonial mais elevado do que este calendário inicialmente sugeriu.',
    '{lead} festeja seu dia nacional hoje, o que dá à data pelo menos um pouco de postura internacional.',
    'Enquanto isso, {lead} está comemorando hoje. Seria mesquinho não dar um espaço para isso.',
    '{lead} está em modo nacional hoje, e isso merece mais do que um simples aceno formal.',
    'A data não é só sua. {lead} também levantou as bandeiras e aparentemente espera ser levado a sério.',
    '{lead} decidiu elevar o nível cerimonial hoje, e o resto do calendário que se adapte.',
    'Tem que se reconhecer: {lead} se recusa a deixar a data passar sem um pouco de postura nacional.',
    '{lead} está fazendo o possível para dar à data uma espinha dorsal internacional. Justo.',
  ],
};

function formatDateKey(date: Date): string {
  return `${date.getMonth() + 1}`.padStart(2, '0') + `-${`${date.getDate()}`.padStart(2, '0')}`;
}

function localizeSignificance(significance: string, locale: Locale): string {
  if (locale === 'en') {
    return significance;
  }

  if (locale === 'pt-BR') {
    return portugueseSignificanceTranslations[significance] ?? significance;
  }

  return significanceTranslations[significance]?.[locale] ?? significanceTranslations[significance]?.sv ?? significance;
}

function localizeNation(nation: string, locale: Locale): string {
  if (locale === 'sv') {
    return swedishNationTranslations[nation] ?? nation;
  }

  if (locale === 'pt-BR') {
    return portugueseNationTranslations[nation] ?? nation;
  }

  return nation;
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
    if (locale === 'en') {
      return `${items[0].nation} and ${items[1].nation}`;
    }
    if (locale === 'pt-BR') {
      return `${items[0].nation} e ${items[1].nation}`;
    }
    return `${items[0].nation} och ${items[1].nation}`;
  }

  const conjunction = locale === 'en'
    ? 'and'
    : locale === 'pt-BR'
    ? 'e'
    : 'och';

  if (locale === 'pt-BR') {
    return `${items[0].nation}, ${items[1].nation} e mais ${items.length - 2}`;
  }

  return `${items[0].nation}, ${items[1].nation} ${conjunction} ${items.length - 2} till`;
}

function buildLeadWithHiddenCount(visibleLead: string, hiddenCount: number, locale: Locale): string {
  if (hiddenCount === 0) {
    return visibleLead;
  }

  if (locale === 'en') {
    return `${visibleLead}, plus ${hiddenCount} more`;
  }

  if (locale === 'pt-BR') {
    return `${visibleLead}, mais ${hiddenCount}`;
  }

  return `${visibleLead}, plus ${hiddenCount} till`;
}

function buildSingleItemSummary(
  item: NationalDayItem,
  dateKey: string,
  locale: Locale
): string {
  const significance = item.significance.toLowerCase();

  if (locale === 'en') {
    const templates = [
      `${item.nation} is marking ${significance} today, which is a fairly strong way to keep a date from looking anonymous.`,
      `${item.nation} has ${significance} today. That gives the calendar a little more backbone than usual.`,
      `Today belongs partly to ${item.nation}, with ${significance} adding some actual posture to the date.`,
      `${item.nation} is not sleepwalking through today. It is showing up with ${significance} and a fairly clear sense of itself.`,
      `${item.nation} is busy celebrating ${significance} today, which frankly adds more structure than many ordinary weekdays manage.`,
    ];
    return pickVariant(`${dateKey}-${item.nation}-${locale}`, templates);
  }

  if (locale === 'pt-BR') {
    const templates = [
      `${item.nation} marca ${significance} hoje, um jeito bastante eficiente de evitar que a data pareça anônima.`,
      `${item.nation} tem ${significance} hoje. Isso dá ao calendário um pouco mais de firmeza que o usual.`,
      `Hoje pertence em parte a ${item.nation}, com ${significance} adicionando uma postura real à data.`,
      `${item.nation} não está passando o dia sem perceber. Aparece com ${significance} e uma noção bem clara de si mesmo.`,
      `${item.nation} está ocupado comemorando ${significance} hoje, o que honestamente traz mais estrutura que muitos dias comuns.`,
    ];
    return pickVariant(`${dateKey}-${item.nation}-${locale}`, templates);
  }

  // Default Swedish
  const templates = [
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
      nation: localizeNation(item.nation, locale),
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
