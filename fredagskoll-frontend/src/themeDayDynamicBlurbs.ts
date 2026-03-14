import { includesAny, joinWithAnd, normalizeLabel } from './themeDayTextUtils';

function lowerFirst(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function buildFoodBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} ligger över datumet som en fullt legitim ursäkt att ta mat och dryck på större allvar än arbetsuppgifter.`,
    `Om dagen känns lite mer smakstyrd än vanligt är det bara för att ${lead} redan tagit plats i kalendern och vägrar flytta på sig.`,
    `${allDays} delar datumet, men ${lead} känns ändå som den punkt där självkontrollen först började ge vika.`,
  ];
}

function buildCultureBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} ger datumet ett ovanligt tunt men fullt användbart lager av bildning.`,
    `Det är svårt att behandla dagen som banal när ${lead} redan sitter där och kräver lite kulturell värdighet.`,
    `${allDays} trängs på samma datum, vilket åtminstone ger kalendern mer innehåll än ett vanligt mötesblock.`,
  ];
}

function buildCommunityBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} höjer ribban något över ren vardagsdrift, vilket datumet uppriktigt sagt behövde.`,
    `När ${lead} ligger först i kalendern får resten av dagen finna sig i att vara lite mindre självtillräcklig än vanligt.`,
    `${allDays} samsas på samma datum, och det ger åtminstone dagen en tydligare ryggrad än den brukar ha.`,
  ];
}

function buildNatureBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} gör det svårare än vanligt att låtsas att kontorsljus är hela verkligheten.`,
    `Det märks att ${lead} ligger över datumet, för dagen känns plötsligt lite mindre mänskligt självtillräcklig.`,
    `${allDays} samsas här idag, vilket i praktiken betyder att naturen fått tolkningsföreträde över schemat en stund.`,
  ];
}

function buildAnimalBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} ger datumet en klart trevligare moralisk profil än många andra temadagar lyckas med.`,
    `Det är svårt att invända mot ${lead} utan att omedelbart framstå som en sämre människa än nödvändigt.`,
    `${allDays} råkar dela datum, men ${lead} är fortfarande den sortens tema folk bara får acceptera med viss ödmjukhet.`,
  ];
}

function buildTechBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} ger datumet en tydlig doft av entusiaster som absolut inte tänker nöja sig med att vara normala idag heller.`,
    `När ${lead} ligger överst i kalendern får resten av dagen bara acceptera att nörderi tillfälligt räknas som ledarskap.`,
    `${allDays} delar utrymmet, men ${lead} känns ändå som huvudorsaken till att dagen blivit märkligt specifik.`,
  ];
}

function buildProfessionBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} är ett ganska tydligt sätt att påminna om vilka människor som faktiskt håller ihop vardagen åt resten av oss.`,
    `Om datumet känns ovanligt funktionellt idag är det bara för att ${lead} redan hunnit ge det lite struktur.`,
    `${allDays} står på schemat, men ${lead} bär ändå den sortens tyngd som gör att resten får rätta sig i ledet.`,
  ];
}

function buildObjectBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} är så specifik att datumet omedelbart slutar kännas neutralt och börjar kännas lätt besatt.`,
    `Det är svårt att argumentera mot ${lead} när kalendern redan valt att ge ämnet full scenbelysning.`,
    `${allDays} delar dagen, men ${lead} är fortfarande exakt den sortens detalj som får resten att kännas som statistroller.`,
  ];
}

function buildFallbackBlurbs(leadDay: string, allDays: string): string[] {
  const lead = lowerFirst(leadDay);
  return [
    `${leadDay} har redan tagit datumet i besittning, så det är bara att sluta låtsas att det här är en neutral vardag.`,
    `När ${lead} väl står i kalendern är resten av dagen mest till för att anpassa sig till den märkligt specifika energin.`,
    `${allDays} samsas på samma datum, vilket känns mindre som ordning och mer som en kommitté som vägrade välja.`,
  ];
}

export function buildThemeDayDynamicBlurbs(themeDays: string[]): string[] {
  const leadDay = themeDays[0];
  const allDays = joinWithAnd(themeDays);
  const normalized = normalizeLabel(leadDay);

  if (
    includesAny(normalized, [
      'kaka',
      'bulle',
      'pizza',
      'semla',
      'mazarin',
      'pasta',
      'glass',
      'korv',
      'choklad',
      'ost',
      'mat',
      'bakelse',
      'frukt',
      'kebab',
      'carbonara',
      'lakrits',
      'julmust',
      'glogg',
      'pepparkaka',
      'ol',
    ])
  ) {
    return buildFoodBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'bok',
      'poesi',
      'teater',
      'konst',
      'musik',
      'film',
      'sprak',
      'tolkien',
      'dans',
      'matematik',
      'pi-',
      'pi ',
      'filosofi',
      'kultur',
    ])
  ) {
    return buildCultureBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'folkets',
      'nordens',
      'samernas',
      'minoritet',
      'nowruz',
      'solidaritet',
      'barns',
      'singlars',
      'karlekens',
      'filantrop',
      'tolerans',
      'familje',
      'romernas',
      'kvan',
    ])
  ) {
    return buildCommunityBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'skog',
      'jord',
      'vatten',
      'promenad',
      'barfota',
      'allemansratt',
      'tradgard',
      'solstand',
      'host',
      'grill',
      'blom',
      'meteorologi',
      'biologisk mangfald',
      'nationalpark',
      'vaxter',
    ])
  ) {
    return buildNatureBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'hund',
      'katt',
      'djur',
      'tapir',
      'rav',
      'nalle',
      'ledarhund',
      'apan',
      'skoldpadd',
    ])
  ) {
    return buildAnimalBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'teknik',
      'internet',
      'backup',
      'gis',
      'css',
      'dataskydd',
      'anvandbarhet',
      'digital',
      'e-bok',
      'automower',
      'rymdfarder',
    ])
  ) {
    return buildTechBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'chef',
      'sekreterar',
      'bussforar',
      'brandman',
      'student',
      'barnmorske',
      'arbetsplats',
      'support',
      'veterinar',
      'larar',
      'chauffor',
      'terapeut',
      'logoped',
      'underskoterske',
      'stadar',
      'fotograf',
      'biomedicinska analytiker',
    ])
  ) {
    return buildProfessionBlurbs(leadDay, allDays);
  }

  if (
    includesAny(normalized, [
      'hatt',
      'raggsock',
      'armbandsklock',
      'cykel',
      'matlada',
      'skottkarr',
      'terrakottakruk',
      'vinylskiv',
      'caps',
      'klock',
      'handduk',
      'fonsterrenovering',
    ])
  ) {
    return buildObjectBlurbs(leadDay, allDays);
  }

  return buildFallbackBlurbs(leadDay, allDays);
}
