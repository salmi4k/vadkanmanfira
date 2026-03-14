import { includesAny, normalizeLabel } from './themeDayTextUtils';

export function getThemeDayCategoryBlurbs(themeDay: string): string[] {
  const normalized = normalizeLabel(themeDay);

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
    return [
      `${themeDay} är exakt den sorts dag som får kalendern att kännas både charmig och lätt sinnessjuk.`,
      `Det är ${themeDay.toLowerCase()} idag, och det finns egentligen inget värdigt sätt att bemöta det annat än att le lite trött.`,
      `${themeDay} påminner om att temadagar ofta uppstår när någon med för mycket energi får tillgång till ett datum.`,
      `Kalendern gick all in på ${themeDay.toLowerCase()} här, och man får nästan respektera fräckheten.`,
    ];
  }

  return [
    `${themeDay} har letat sig in i kalendern och kräver tydligen någon sorts respekt.`,
    `Det är ${themeDay} idag. Det räcker som skäl att justera ambitionsnivån en aning.`,
    `${themeDay} får bära dagen. Det är ändå bättre än ren vardag utan täckning.`,
    `Någon har gjort ${themeDay.toLowerCase()} till en grej, och nu får vi andra bara acceptera läget.`,
  ];
}
