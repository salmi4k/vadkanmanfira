import { Locale } from './locale';
import { includesAny, normalizeLabel } from './themeDayTextUtils';

function lower(value: string): string {
  return value.toLowerCase();
}

export function getThemeDayCategoryBlurbs(
  themeDay: string,
  locale: Locale = 'sv',
  displayThemeDay = themeDay
): string[] {
  const normalized = normalizeLabel(themeDay);
  const shownDay = displayThemeDay;

  if (
    includesAny(normalized, [
      'kaka',
      'bulle',
      'pizza',
      'semla',
      'mazarin',
      'pasta',
      'glass',
      'salad',
      'korv',
      'bull',
      'choklad',
      'ost',
      'mat',
      'soppa',
      'bakelse',
      'munk',
      'potatis',
      'frukt',
      'sill',
      'kebab',
      'carbonara',
      'lakrits',
      'linssoppa',
      'raggmunk',
      'wienerbrod',
      'julmust',
      'glogg',
      'pepparkaka',
      'ol',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} feels like an administrative decision made by people with crumbs on their keyboards.`,
        `It's ${lower(shownDay)} today, which means yet another opportunity to pretend calories count as culture.`,
        `${shownDay} improves the day by lowering standards and raising blood sugar.`,
        `You do not need to understand why ${lower(shownDay)} exists. You just need to serve something and move on.`,
      ];
    }

    return [
      `${themeDay} känns som ett administrativt beslut fattat av folk med smulor på tangentbordet.`,
      `Det är ${themeDay.toLowerCase()} idag, alltså ännu en chans att låtsas att kalorier är kultur.`,
      `${themeDay} gör jobbet lättare genom att sänka ambitionsnivån och höja blodsockret.`,
      `Man behöver inte förstå varför ${themeDay.toLowerCase()} finns. Det räcker att servera något och gå vidare.`,
    ];
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
      'berattar',
      'dans',
      'jazz',
      'poesi',
      'teater',
      'tango',
      'moldagen',
      'matematik',
      'pi-',
      'pi ',
      'arkiv',
      'animation',
      'georg',
      'filosofi',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} wants you to feel cultivated without having to work unreasonably hard for it.`,
        `It's ${lower(shownDay)} today, which still sounds better than another blank weekday.`,
        `${shownDay} gives the date a thin but serviceable coat of culture, and that will have to do.`,
        `The calendar is trying to intellectualize you via ${lower(shownDay)}. Fairly bold, really.`,
      ];
    }

    return [
      `${themeDay} vill att du ska känna dig bildad utan att behöva anstränga dig orimligt mycket.`,
      `Det är ${themeDay.toLowerCase()} idag, vilket åtminstone låter bättre än ännu en blank vardag.`,
      `${themeDay} ger dagen en tunn fernissa av kultur och det får vi vara tacksamma för.`,
      `Kalendern försöker göra dig intellektuell via ${themeDay.toLowerCase()}. Ganska fräckt egentligen.`,
    ];
  }

  if (
    includesAny(normalized, [
      'folkets',
      'nordens',
      'samernas',
      'kultur',
      'sprak',
      'minoritet',
      'nowruz',
      'religionsfrihet',
      'solidaritet',
      'elev',
      'barnboks',
      'barns',
      'syskon',
      'vanner',
      'kvinno',
      'manliga',
      'singlars',
      'karlekens',
      'filantrop',
      'tolerans',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} frankly deserves better than a lazy glance and a half-hearted "right then."`,
        `It's ${lower(shownDay)} today, which at least gives the date more backbone than standard theme-day fluff.`,
        `${shownDay} lends the day some cultural dignity, which this app cannot always claim elsewhere.`,
        `The calendar is trying to raise the level with ${lower(shownDay)} today. We should probably act accordingly.`,
      ];
    }

    return [
      `${themeDay} förtjänar faktiskt mer än ett slött ögonkast och ett halvdant "jaha".`,
      `Det är ${themeDay.toLowerCase()} idag, alltså en dag med lite mer ryggrad än den vanliga temadagsfluffet.`,
      `${themeDay} ger datumet lite kulturell värdighet, vilket appen i övrigt inte alltid kan skryta med.`,
      `Kalendern försöker höja nivån med ${themeDay.toLowerCase()} idag. Vi får försöka bete oss därefter.`,
    ];
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
      'scout',
      'djurhelgon',
      'apan',
      'ap-dagen',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} is exactly the sort of theme day no normal person needs to argue against.`,
        `It's ${lower(shownDay)} today. Good. At last, something with a reasonably sound moral profile.`,
        `${shownDay} makes the calendar marginally more sympathetic than usual.`,
        `If the day belongs to ${lower(shownDay)}, the sensible response is to nod and accept it.`,
      ];
    }

    return [
      `${themeDay} är den sortens temadag ingen normal människa behöver argumentera emot.`,
      `Det är ${themeDay.toLowerCase()} idag. Bra. Äntligen något med rimlig moralisk profil.`,
      `${themeDay} gör kalendern marginellt mer sympatisk än vanligt.`,
      `Om dagen tillhör ${themeDay.toLowerCase()} så är det klokast att bara nicka och acceptera saken.`,
    ];
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
      'moldagen',
      'it',
      'digital',
      'dackcheck',
      'internet',
      'e-bok',
      'elens',
      'elmotorns',
      'automower',
      'dataskydd',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} feels exactly like something the internet would invent and then stubbornly refuse to let go of.`,
        `It's ${lower(shownDay)} today, so somewhere an enthusiast is feeling extremely good about themselves.`,
        `${shownDay} gives the date a faint smell of nerdy self-confidence, which is not the worst thing.`,
        `The calendar has handed the day over to ${lower(shownDay)}. Best just live with it.`,
      ];
    }

    return [
      `${themeDay} känns exakt som något internet skulle uppfinna och sedan vägra släppa.`,
      `Det är ${themeDay.toLowerCase()} idag, så någonstans sitter en entusiast och mår väldigt bra.`,
      `${themeDay} ger dagen en lätt doft av nördigt självförtroende, vilket inte är det sämsta.`,
      `Kalendern har överlämnat dagen till ${themeDay.toLowerCase()}. Det är bara att leva med det.`,
    ];
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
      'frisor',
      'chauffor',
      'terapeut',
      'radions',
      'logoped',
      'montessorilarar',
      'underskoterske',
      'lakarsekreterar',
      'stadar',
      'guldsmed',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} is a fairly direct reminder of which profession would like to be seen without having to start a riot.`,
        `It's ${lower(shownDay)} today. Reasonably enough, the day requires at least a half-hearted acknowledgement.`,
        `${shownDay} reminds the rest of society who actually keeps the whole thing from collapsing.`,
        `The calendar is leaning on ${lower(shownDay)} today, and it feels surprisingly deserved.`,
      ];
    }

    return [
      `${themeDay} är en ganska tydlig signal om att någon yrkesgrupp vill bli sedd utan att behöva starta upplopp.`,
      `Det är ${themeDay.toLowerCase()} idag. Rimligt nog kräver dagen minst ett halvhjärtat erkännande.`,
      `${themeDay} påminner resten av samhället om vem som faktiskt håller ihop skiten.`,
      `Kalendern lutar sig mot ${themeDay.toLowerCase()} idag, och det känns förvånansvärt berättigat.`,
    ];
  }

  if (
    includesAny(normalized, [
      'friluft',
      'skog',
      'jord',
      'vatten',
      'promenad',
      'barfota',
      'allemansratt',
      'tradgard',
      'var',
      'solstand',
      'var',
      'host',
      'farskpotatis',
      'grill',
      'blom',
      'lupin',
      'meteorologi',
      'frukt',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} feels like the calendar trying to push people outside using a soft but insistent tone.`,
        `It's ${lower(shownDay)} today, which means yet another excuse to pretend fresh air solves everything.`,
        `${shownDay} gives the date a pleasant scent of nature-romance and low-grade guilt.`,
        `If the day insists on being ${lower(shownDay)}, then fine. Take a walk and stop complaining.`,
      ];
    }

    return [
      `${themeDay} känns som kalenderns försök att få ut folk ur huset med mjuk tvångston.`,
      `Det är ${themeDay.toLowerCase()} idag, alltså ännu en chans att låtsas att frisk luft löser allt.`,
      `${themeDay} ger datumet en behaglig doft av naturromantik och lätt skuld.`,
      `Om dagen vill vara ${themeDay.toLowerCase()} så får man väl gå med på det och eventuellt ta en promenad.`,
    ];
  }

  if (
    includesAny(normalized, [
      'chef',
      'svarmor',
      'van',
      'singlar',
      'pojkvan',
      'flickvan',
      'syskon',
      'mors dag',
      'fars dag',
      'kenneth',
      'annadagen',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} feels like a day designed so someone in your orbit can demand attention with calendar support.`,
        `It's ${lower(shownDay)} today, so the only move is to display some social competence and hope for the best.`,
        `${shownDay} makes relationships unnecessarily formal, but at least the expectations are clear.`,
        `The calendar has granted ${lower(shownDay)} quasi-official status. Unfortunately, you can't really argue with that.`,
      ];
    }

    return [
      `${themeDay} känns som en dag skapad för att någon i din närhet ska kunna kräva uppmärksamhet med kalenderstöd.`,
      `Det är ${themeDay.toLowerCase()} idag, så det är väl bara att visa lite social kompetens och hoppas på det bästa.`,
      `${themeDay} gör relationer onödigt formella, men det är åtminstone tydligt vad som förväntas.`,
      `Kalendern har gett ${themeDay.toLowerCase()} officiell-ish status. Tyvärr kan man inte riktigt argumentera emot det.`,
    ];
  }

  if (
    includesAny(normalized, [
      'hatt',
      'raggsock',
      'armbandsklock',
      'bilens',
      'cykel',
      'matlada',
      'skottkarr',
      'terrakottakruk',
      'veckopeng',
      'vinylskiv',
      'caps lock',
      'raggsock',
      'klock',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} is a beautiful example of how far humanity can push the idea that literally anything can get a day.`,
        `It's ${lower(shownDay)} today, which is too specific to be made up and too absurd to challenge.`,
        `${shownDay} grants everyday objects a short but intense spell of unreasonable dignity.`,
        `The calendar has decided on ${lower(shownDay)} today. No one really knows why, but the machinery rolls on.`,
      ];
    }

    return [
      `${themeDay} är ett vackert exempel på hur långt människan kan driva idén "allt kan få en dag".`,
      `Det är ${themeDay.toLowerCase()} idag, vilket är för specifikt för att vara påhittat men för dumt för att ifrågasätta.`,
      `${themeDay} ger vardagsföremål en kort men intensiv period av orimlig värdighet.`,
      `Kalendern har bestämt sig för ${themeDay.toLowerCase()} idag. Ingen vet riktigt varför, men maskineriet rullar vidare.`,
    ];
  }

  if (
    includesAny(normalized, [
      'skojar',
      'magi',
      'hallongrott',
      'tacodag',
      'taco',
      'alien',
      'star wars',
      'harry potter',
      'pizza',
      'css-naked',
      'earth hour',
      'expect a better tomorrow',
    ])
  ) {
    if (locale === 'en') {
      return [
        `${shownDay} is exactly the kind of thing that makes the calendar feel both charming and slightly unwell.`,
        `It's ${lower(shownDay)} today, and there is no dignified response except a tired little smile.`,
        `${shownDay} is a reminder that theme days usually happen when someone with too much energy gains access to a date.`,
        `The calendar went all in on ${lower(shownDay)} here, and you almost have to respect the nerve.`,
      ];
    }

    return [
      `${themeDay} är exakt den sorts dag som får kalendern att kännas både charmig och lätt sinnessjuk.`,
      `Det är ${themeDay.toLowerCase()} idag, och det finns egentligen inget värdigt sätt att bemöta det annat än att le lite trött.`,
      `${themeDay} påminner om att temadagar ofta uppstår när någon med för mycket energi får tillgång till ett datum.`,
      `Kalendern gick all in på ${themeDay.toLowerCase()} här, och man får nästan respektera fräckheten.`,
    ];
  }

  if (locale === 'en') {
    return [
      `${shownDay} has found its way into the calendar and is apparently demanding some degree of respect.`,
      `It's ${shownDay} today. That is sufficient reason to lower expectations slightly.`,
      `${shownDay} gets to carry the date. That is still better than a plain unsupported weekday.`,
      `Someone turned ${lower(shownDay)} into a thing, and the rest of us are now simply expected to accept the situation.`,
    ];
  }

  return [
    `${themeDay} har letat sig in i kalendern och kräver tydligen någon sorts respekt.`,
    `Det är ${themeDay} idag. Det räcker som skäl att justera ambitionsnivån en aning.`,
    `${themeDay} får bära dagen. Det är ändå bättre än ren vardag utan täckning.`,
    `Någon har gjort ${themeDay.toLowerCase()} till en grej, och nu får vi andra bara acceptera läget.`,
  ];
}
