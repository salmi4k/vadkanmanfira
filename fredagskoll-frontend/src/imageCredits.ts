export interface ImageCredit {
  slug: string;
  label: string;
  creator: string;
  creatorUrl?: string;
  sourceUrl: string;
  licenseName: string;
  licenseUrl?: string;
  note?: string;
}

export const imageCredits: ImageCredit[] = [
  {
    slug: 'vaffeldagen',
    label: 'Våffeldagen',
    creator: 'Flixtey',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Flixtey',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Waffles.jpg',
    licenseName: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'valborg',
    label: 'Valborg',
    creator: 'Nordelch',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Nordelch',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Valborgsbrasa-1.jpg',
    licenseName: 'Public domain',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'paskafton',
    label: 'Påskafton',
    creator: 'Tanzania',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Tanzania',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Easter_egg_with_candy.jpg',
    licenseName: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'nationaldagen',
    label: 'Nationaldagen',
    creator: 'Bengt Nyman',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Bengt_Nyman',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:National_Day_of_Sweden_2015_8032.jpg',
    licenseName: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'midsommarafton',
    label: 'Midsommarafton',
    creator: '01tonythomas',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:01tonythomas',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Midsommar_Pole_-_Maypole_in_Sweden.jpg',
    licenseName: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'kanelbullensdag',
    label: 'Kanelbullens dag',
    creator: 'Kritzolina',
    creatorUrl: 'https://commons.wikimedia.org/wiki/File:Cinnamon_roll_in_Stockholm.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cinnamon_roll_in_Stockholm.jpg',
    licenseName: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'kladdkakansdag',
    label: 'Kladdkakans dag',
    creator: 'Stolpskott',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Stolpskott',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kladdkaka.JPG',
    licenseName: 'Public domain',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'surstrommingspremiar',
    label: 'Surströmmingspremiär',
    creator: 'Wrote',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Serving_Surstr%C3%B6mming.jpg',
    licenseName: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'lucia',
    label: 'Lucia',
    creator: 'Fredrik Magnusson',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lucia_procession.jpg',
    licenseName: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
  {
    slug: 'nyarsafton',
    label: 'Nyårsafton',
    creator: 'Frankie Fouganthin',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:FFswe',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:-_A_New_Year%27s_fireworks_in_central_Stockholm,_Sweden.jpg',
    licenseName: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: 'Nedskalad från Wikimedia Commons-originalet.',
  },
];
