import { CelebrationDayType } from '../celebrations/celebrationDefinitions';

export type ShareTheme = 'ember' | 'cream' | 'forest' | 'gold' | 'midnight' | 'jam';

export type ShareCatalogEntry = {
  slug: string;
  label: string;
  badge: string;
  theme: ShareTheme;
  accentColor: string;
  highlightColor: string;
  backgroundColor: string;
};

export const shareCatalog: Record<CelebrationDayType, ShareCatalogEntry> = {
  allahjartansdag: {
    slug: 'allahjartansdag',
    label: 'Alla hjärtans dag',
    badge: 'Ömhet med budget',
    theme: 'jam',
    accentColor: '#a83f5a',
    highlightColor: '#f6d9df',
    backgroundColor: '#29151d',
  },
  fettisdag: {
    slug: 'fettisdag',
    label: 'Fettisdagen',
    badge: 'Semmelplikt',
    theme: 'cream',
    accentColor: '#9d4b17',
    highlightColor: '#f6ead5',
    backgroundColor: '#20150f',
  },
  skartorsdag: {
    slug: 'skartorsdag',
    label: 'Skärtorsdag',
    badge: 'Påskstart',
    theme: 'gold',
    accentColor: '#d98d1e',
    highlightColor: '#f8e9b8',
    backgroundColor: '#281f12',
  },
  langfredag: {
    slug: 'langfredag',
    label: 'Långfredag',
    badge: 'Stillsam tyngd',
    theme: 'midnight',
    accentColor: '#7686b7',
    highlightColor: '#dfe7ff',
    backgroundColor: '#101521',
  },
  paskafton: {
    slug: 'paskafton',
    label: 'Påskafton',
    badge: 'Godis och symbolik',
    theme: 'gold',
    accentColor: '#d98d1e',
    highlightColor: '#fff2c8',
    backgroundColor: '#241b0f',
  },
  paskdagen: {
    slug: 'paskdagen',
    label: 'Påskdagen',
    badge: 'Vårton med tyngd',
    theme: 'cream',
    accentColor: '#c79c2d',
    highlightColor: '#fff0cb',
    backgroundColor: '#221812',
  },
  annandagpask: {
    slug: 'annandagpask',
    label: 'Annandag påsk',
    badge: 'Efterklang',
    theme: 'forest',
    accentColor: '#628b57',
    highlightColor: '#dcecd4',
    backgroundColor: '#141d14',
  },
  vaffeldagen: {
    slug: 'vaffeldagen',
    label: 'Våffeldagen',
    badge: 'Frasig legitimitet',
    theme: 'cream',
    accentColor: '#d67b26',
    highlightColor: '#ffe0b2',
    backgroundColor: '#23160d',
  },
  valborg: {
    slug: 'valborg',
    label: 'Valborg',
    badge: 'Eld mot april',
    theme: 'ember',
    accentColor: '#e6642f',
    highlightColor: '#ffd2b9',
    backgroundColor: '#23120d',
  },
  nationaldagen: {
    slug: 'nationaldagen',
    label: 'Nationaldagen',
    badge: 'Flaggmässig tyngd',
    theme: 'forest',
    accentColor: '#2d689c',
    highlightColor: '#e4f0ff',
    backgroundColor: '#101923',
  },
  midsommarafton: {
    slug: 'midsommarafton',
    label: 'Midsommarafton',
    badge: 'Krans och gravitas',
    theme: 'forest',
    accentColor: '#5a8b55',
    highlightColor: '#e9f2da',
    backgroundColor: '#132018',
  },
  kanelbullensdag: {
    slug: 'kanelbullensdag',
    label: 'Kanelbullens dag',
    badge: 'Smördriven ordning',
    theme: 'jam',
    accentColor: '#9f5c2f',
    highlightColor: '#ffd9be',
    backgroundColor: '#23140f',
  },
  kladdkakansdag: {
    slug: 'kladdkakansdag',
    label: 'Kladdkakans dag',
    badge: 'Klibbig auktoritet',
    theme: 'ember',
    accentColor: '#7f4e2d',
    highlightColor: '#f4ddc5',
    backgroundColor: '#1b1310',
  },
  surstrommingspremiar: {
    slug: 'surstrommingspremiar',
    label: 'Surströmmingspremiär',
    badge: 'Ventilation krävs',
    theme: 'midnight',
    accentColor: '#8090a5',
    highlightColor: '#edf2ff',
    backgroundColor: '#0f131b',
  },
  lucia: {
    slug: 'lucia',
    label: 'Lucia',
    badge: 'Saffran i mörkret',
    theme: 'cream',
    accentColor: '#e2c25d',
    highlightColor: '#fff3ca',
    backgroundColor: '#201812',
  },
  julafton: {
    slug: 'julafton',
    label: 'Julafton',
    badge: 'Traditionstryck',
    theme: 'cream',
    accentColor: '#b2462d',
    highlightColor: '#ffe3d8',
    backgroundColor: '#211412',
  },
  nyarsafton: {
    slug: 'nyarsafton',
    label: 'Nyårsafton',
    badge: 'Tolvslagspress',
    theme: 'midnight',
    accentColor: '#b8b1ff',
    highlightColor: '#f0edff',
    backgroundColor: '#11101a',
  },
  kottonsdag: {
    slug: 'kottonsdag',
    label: 'Köttonsdag',
    badge: 'Intern disciplin',
    theme: 'ember',
    accentColor: '#b96133',
    highlightColor: '#ffd7bf',
    backgroundColor: '#22120c',
  },
  fisktorsdag: {
    slug: 'fisktorsdag',
    label: 'Fisktorsdag',
    badge: 'Institutionell rutin',
    theme: 'midnight',
    accentColor: '#7ea3b5',
    highlightColor: '#e2f4ff',
    backgroundColor: '#0f1820',
  },
  marmeladfredag: {
    slug: 'marmeladfredag',
    label: 'Marmeladfredag',
    badge: 'Söt avslutning',
    theme: 'jam',
    accentColor: '#b64d7e',
    highlightColor: '#ffd3ea',
    backgroundColor: '#26111e',
  },
};

export function getShareCatalogEntry(dayType: CelebrationDayType): ShareCatalogEntry {
  return shareCatalog[dayType];
}

export function getDayTypeFromShareSlug(slug: string): CelebrationDayType | null {
  const normalizedSlug = slug.trim().toLowerCase();
  return (
    (Object.entries(shareCatalog).find(([, entry]) => entry.slug === normalizedSlug)?.[0] as
      | CelebrationDayType
      | undefined) ?? null
  );
}
