import { Locale } from './locale';
import { includesAny, joinWithAnd, normalizeLabel } from './themeDayTextUtils';

function lowerFirst(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function buildFoodBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} is hanging over the date as a perfectly legitimate excuse to take food and drink more seriously than work.`,
      `If the day feels a little more flavor-driven than usual, that is only because ${lead} has already occupied the calendar and refuses to leave.`,
      `${allDays} share the date, but ${lead} still feels like the point where self-control first gave way.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} paira sobre a data como uma desculpa perfeitamente legítima para levar comida e bebida mais a sério do que o trabalho.`,
      `Se o dia parece com um sabor um pouco mais evidente do que o normal, é só porque ${lead} já invadiu o calendário e não pretende sair.`,
      `${allDays} dividem a data, mas ${lead} ainda parece o ponto onde o bom senso desistiu.`,
    ];
  }

  return [
    `${leadDay} ligger över datumet som en fullt legitim ursäkt att ta mat och dryck på större allvar än arbetsuppgifter.`,
    `Om dagen känns lite mer smakstyrd än vanligt är det bara för att ${lead} redan tagit plats i kalendern och vägrar flytta på sig.`,
    `${allDays} delar datumet, men ${lead} känns ändå som den punkt där självkontrollen först började ge vika.`,
  ];
}

function buildCultureBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} gives the date a very thin but fully usable layer of culture.`,
      `It becomes harder to treat the day as banal when ${lead} is already sitting there demanding a little dignity.`,
      `${allDays} are all crowding onto the same date, which at least gives the calendar more substance than an ordinary meeting block.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} adiciona à data uma camada fina, mas bem utilizável, de cultura.`,
      `Fica mais difícil tratar o dia como banal quando ${lead} já está ali, exigindo um pouco de dignidade.`,
      `${allDays} amontoam-se na mesma data, o que ao menos dá mais conteúdo ao calendário do que uma reunião chata qualquer.`,
    ];
  }

  return [
    `${leadDay} ger datumet ett ovanligt tunt men fullt användbart lager av bildning.`,
    `Det är svårt att behandla dagen som banal när ${lead} redan sitter där och kräver lite kulturell värdighet.`,
    `${allDays} trängs på samma datum, vilket åtminstone ger kalendern mer innehåll än ett vanligt mötesblock.`,
  ];
}

function buildCommunityBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} lifts the date slightly above raw daily operations, which it honestly needed.`,
      `Once ${lead} lands first in the calendar, the rest of the day has to accept being a little less self-important than usual.`,
      `${allDays} are sharing the same date, which at least gives the day more backbone than it usually has.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} eleva a data um pouco acima da correria diária, coisa que ela precisava, sejamos sinceros.`,
      `Quando ${lead} chega primeiro no calendário, o resto do dia tem que aceitar ser um pouco menos cheio de si do que o normal.`,
      `${allDays} dividem a mesma data, o que dá mais coluna vertebral ao dia do que ele normalmente tem.`,
    ];
  }

  return [
    `${leadDay} höjer ribban något över ren vardagsdrift, vilket datumet uppriktigt sagt behövde.`,
    `När ${lead} ligger först i kalendern får resten av dagen finna sig i att vara lite mindre självtillräcklig än vanligt.`,
    `${allDays} samsas på samma datum, och det ger åtminstone dagen en tydligare ryggrad än den brukar ha.`,
  ];
}

function buildNatureBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} makes it harder than usual to pretend office lighting is the whole world.`,
      `You can tell ${lead} is hanging over the date, because the day suddenly feels a little less humanly self-satisfied.`,
      `${allDays} are sharing the slot today, which in practice means nature has been granted interpretive priority over the schedule for a while.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} dificulta do que o normal fingir que a luz do escritório é o mundo todo.`,
      `Dá para perceber que ${lead} domina a data, porque o dia de repente parece menos convencido como ser humano.`,
      `${allDays} dividem a vaga hoje, o que na prática significa que a natureza tem prioridade para interpretar o horário por um tempo.`,
    ];
  }

  return [
    `${leadDay} gör det svårare än vanligt att låtsas att kontorsljus är hela verkligheten.`,
    `Det märks att ${lead} ligger över datumet, för dagen känns plötsligt lite mindre mänskligt självtillräcklig.`,
    `${allDays} samsas här idag, vilket i praktiken betyder att naturen fått tolkningsföreträde över schemat en stund.`,
  ];
}

function buildAnimalBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} gives the date a significantly better moral profile than many other theme days manage.`,
      `It becomes very difficult to object to ${lead} without immediately looking worse than necessary.`,
      `${allDays} may share the date, but ${lead} is still the kind of theme people are simply expected to accept with humility.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} dá à data um perfil moral muito mais legal do que muitos outros temas conseguem.`,
      `Fica muito difícil contestar ${lead} sem parecer pior do que o necessário.`,
      `${allDays} podem dividir a data, mas ${lead} continua sendo aquele tema que o pessoal espera que você aceite com humildade.`,
    ];
  }

  return [
    `${leadDay} ger datumet en klart trevligare moralisk profil än många andra temadagar lyckas med.`,
    `Det är svårt att invända mot ${lead} utan att omedelbart framstå som en sämre människa än nödvändigt.`,
    `${allDays} råkar dela datum, men ${lead} är fortfarande den sortens tema folk bara får acceptera med viss ödmjukhet.`,
  ];
}

function buildTechBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} gives the date a clear smell of enthusiasts who absolutely do not intend to be normal today either.`,
      `Once ${lead} sits at the top of the calendar, the rest of the day just has to accept that nerdiness temporarily counts as leadership.`,
      `${allDays} share the space, but ${lead} still feels like the main reason the date became strangely specific.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} dá à data aquele cheirinho claro de entusiastas que não vão se contentar em ser normais hoje também.`,
      `Quando ${lead} domina o calendário, o resto do dia tem que aceitar que nerdice conta como liderança – pelo menos por enquanto.`,
      `${allDays} compartilham o espaço, mas ${lead} ainda parece a principal razão da data ter virado algo estranhamente específico.`,
    ];
  }

  return [
    `${leadDay} ger datumet en tydlig doft av entusiaster som absolut inte tänker nöja sig med att vara normala idag heller.`,
    `När ${lead} ligger överst i kalendern får resten av dagen bara acceptera att nörderi tillfälligt räknas som ledarskap.`,
    `${allDays} delar utrymmet, men ${lead} känns ändå som huvudorsaken till att dagen blivit märkligt specifik.`,
  ];
}

function buildProfessionBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} is a fairly direct way of reminding everyone which people actually keep daily life stitched together for the rest of us.`,
      `If the date feels unusually functional today, that is only because ${lead} has already given it some structure.`,
      `${allDays} are on the schedule, but ${lead} still carries the sort of weight that makes the rest fall into line.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} é um jeito bem direto de lembrar quem realmente mantém a vida diária costurada para o resto de nós.`,
      `Se a data parece especialmente funcional hoje, é só porque ${lead} já deu uma estrutura para ela.`,
      `${allDays} estão na agenda, mas ${lead} tem aquele peso que faz o resto se alinhar sem reclamar.`,
    ];
  }

  return [
    `${leadDay} är ett ganska tydligt sätt att påminna om vilka människor som faktiskt håller ihop vardagen åt resten av oss.`,
    `Om datumet känns ovanligt funktionellt idag är det bara för att ${lead} redan hunnit ge det lite struktur.`,
    `${allDays} står på schemat, men ${lead} bär ändå den sortens tyngd som gör att resten får rätta sig i ledet.`,
  ];
}

function buildObjectBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} is so specific that the date immediately stops feeling neutral and starts feeling faintly possessed.`,
      `It is hard to argue with ${lead} once the calendar has already chosen to give it full stage lighting.`,
      `${allDays} share the day, but ${lead} is still exactly the kind of detail that makes the rest feel like extras.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} é tão específico que a data deixa de parecer neutra e começa a parecer meio possuída.`,
      `É difícil discutir com ${lead} quando o calendário já decidiu dar todo o holofote pra ele.`,
      `${allDays} dividem o dia, mas ${lead} ainda é justamente aquele detalhe que faz o resto parecer figurante.`,
    ];
  }

  return [
    `${leadDay} är så specifik att datumet omedelbart slutar kännas neutralt och börjar kännas lätt besatt.`,
    `Det är svårt att argumentera mot ${lead} när kalendern redan valt att ge ämnet full scenbelysning.`,
    `${allDays} delar dagen, men ${lead} är fortfarande exakt den sortens detalj som får resten att kännas som statistroller.`,
  ];
}

function buildFallbackBlurbs(leadDay: string, allDays: string, locale: Locale): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} has already taken possession of the date, so there is no point pretending this is a neutral weekday anymore.`,
      `Once ${lead} is in the calendar, the rest of the day mostly exists to adapt to its oddly specific energy.`,
      `${allDays} are sharing the same date, which feels less like order and more like a committee that refused to choose.`,
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} já tomou posse da data, então não adianta fingir que é um dia comum de semana.`,
      `Depois que ${lead} aparece no calendário, o resto do dia serve principalmente para se adaptar àquela energia estranhamente específica.`,
      `${allDays} dividem a mesma data, o que parece menos ordem e mais uma reunião que não quis decidir.`,
    ];
  }

  return [
    `${leadDay} har redan tagit datumet i besittning, så det är bara att sluta låtsas att det här är en neutral vardag.`,
    `När ${lead} väl står i kalendern är resten av dagen mest till för att anpassa sig till den märkligt specifika energin.`,
    `${allDays} samsas på samma datum, vilket känns mindre som ordning och mer som en kommitté som vägrade välja.`,
  ];
}

export function buildThemeDayDynamicBlurbs(
  themeDays: string[],
  locale: Locale = 'sv',
  displayThemeDays = themeDays
): string[] {
  const leadDay = displayThemeDays[0];
  const allDays = joinWithAnd(displayThemeDays, locale);
  const normalized = normalizeLabel(themeDays[0]);

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
    return buildFoodBlurbs(leadDay, allDays, locale);
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
    return buildCultureBlurbs(leadDay, allDays, locale);
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
    return buildCommunityBlurbs(leadDay, allDays, locale);
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
    return buildNatureBlurbs(leadDay, allDays, locale);
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
    return buildAnimalBlurbs(leadDay, allDays, locale);
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
    return buildTechBlurbs(leadDay, allDays, locale);
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
    return buildProfessionBlurbs(leadDay, allDays, locale);
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
    return buildObjectBlurbs(leadDay, allDays, locale);
  }

  return buildFallbackBlurbs(leadDay, allDays, locale);
}
