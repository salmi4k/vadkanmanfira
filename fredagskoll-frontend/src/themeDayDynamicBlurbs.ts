import { Locale } from './locale';
import { Mood } from './mood';
import { includesAny, joinWithAnd, normalizeLabel } from './themeDayTextUtils';

function lowerFirst(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function pickSingularOrPlural(
  themeDayCount: number,
  singularLine: string,
  pluralLine: string
): string {
  return themeDayCount > 1 ? pluralLine : singularLine;
}

function buildFoodBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} is hanging over the date as a perfectly legitimate excuse to take food and drink more seriously than work.`,
      `If the day feels a little more flavor-driven than usual, that is only because ${lead} has already occupied the calendar and refuses to leave.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} alone is enough to mark the point where self-control first gave way.`,
        `${allDays} share the date, but ${lead} still feels like the point where self-control first gave way.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} paira sobre a data como uma desculpa perfeitamente legítima para levar comida e bebida mais a sério do que o trabalho.`,
      `Se o dia parece com um sabor um pouco mais evidente do que o normal, é só porque ${lead} já invadiu o calendário e não pretende sair.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já marca o ponto em que o bom senso resolveu se aposentar.`,
        `${allDays} dividem a data, mas ${lead} ainda parece o ponto onde o bom senso desistiu.`
      ),
    ];
  }

  return [
    `${leadDay} ligger över datumet som en fullt legitim ursäkt att ta mat och dryck på större allvar än arbetsuppgifter.`,
    `Om dagen känns lite mer smakstyrd än vanligt är det bara för att ${lead} redan tagit plats i kalendern och vägrar flytta på sig.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} räcker på egen hand för att markera exakt var självkontrollen började ge vika.`,
      `${allDays} delar datumet, men ${lead} känns ändå som den punkt där självkontrollen först började ge vika.`
    ),
  ];
}

function buildCultureBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} gives the date a very thin but fully usable layer of culture.`,
      `It becomes harder to treat the day as banal when ${lead} is already sitting there demanding a little dignity.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} is enough on its own to give the calendar more substance than an ordinary meeting block.`,
        `${allDays} are all crowding onto the same date, which at least gives the calendar more substance than an ordinary meeting block.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} adiciona à data uma camada fina, mas bem utilizável, de cultura.`,
      `Fica mais difícil tratar o dia como banal quando ${lead} já está ali, exigindo um pouco de dignidade.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já dá ao calendário mais conteúdo do que uma reunião chata qualquer.`,
        `${allDays} amontoam-se na mesma data, o que ao menos dá mais conteúdo ao calendário do que uma reunião chata qualquer.`
      ),
    ];
  }

  return [
    `${leadDay} ger datumet ett ovanligt tunt men fullt användbart lager av bildning.`,
    `Det är svårt att behandla dagen som banal när ${lead} redan sitter där och kräver lite kulturell värdighet.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} räcker faktiskt på egen hand för att ge kalendern mer innehåll än ett vanligt mötesblock.`,
      `${allDays} trängs på samma datum, vilket åtminstone ger kalendern mer innehåll än ett vanligt mötesblock.`
    ),
  ];
}

function buildCommunityBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} lifts the date slightly above raw daily operations, which it honestly needed.`,
      `Once ${lead} lands first in the calendar, the rest of the day has to accept being a little less self-important than usual.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} is enough by itself to give the date more backbone than it usually has.`,
        `${allDays} are sharing the same date, which at least gives the day more backbone than it usually has.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} eleva a data um pouco acima da correria diária, coisa que ela precisava, sejamos sinceros.`,
      `Quando ${lead} chega primeiro no calendário, o resto do dia tem que aceitar ser um pouco menos cheio de si do que o normal.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já dá ao dia mais coluna vertebral do que ele normalmente tem.`,
        `${allDays} dividem a mesma data, o que dá mais coluna vertebral ao dia do que ele normalmente tem.`
      ),
    ];
  }

  return [
    `${leadDay} höjer ribban något över ren vardagsdrift, vilket datumet uppriktigt sagt behövde.`,
    `När ${lead} ligger först i kalendern får resten av dagen finna sig i att vara lite mindre självtillräcklig än vanligt.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} räcker faktiskt ensam för att ge dagen mer ryggrad än den brukar ha.`,
      `${allDays} samsas på samma datum, och det ger åtminstone dagen en tydligare ryggrad än den brukar ha.`
    ),
  ];
}

function buildNatureBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} makes it harder than usual to pretend office lighting is the whole world.`,
      `You can tell ${lead} is hanging over the date, because the day suddenly feels a little less humanly self-satisfied.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} alone is enough to give nature temporary interpretive priority over the schedule.`,
        `${allDays} are sharing the slot today, which in practice means nature has been granted interpretive priority over the schedule for a while.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} dificulta mais do que o normal fingir que a luz do escritório é o mundo todo.`,
      `Dá para perceber que ${lead} domina a data, porque o dia de repente parece menos convencido como ser humano.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já basta para dar à natureza prioridade temporária sobre o horário.`,
        `${allDays} dividem a vaga hoje, o que na prática significa que a natureza tem prioridade para interpretar o horário por um tempo.`
      ),
    ];
  }

  return [
    `${leadDay} gör det svårare än vanligt att låtsas att kontorsljus är hela verkligheten.`,
    `Det märks att ${lead} ligger över datumet, för dagen känns plötsligt lite mindre mänskligt självtillräcklig.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} räcker ensam för att ge naturen tillfälligt tolkningsföreträde över schemat.`,
      `${allDays} samsas här idag, vilket i praktiken betyder att naturen fått tolkningsföreträde över schemat en stund.`
    ),
  ];
}

function buildAnimalBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} gives the date a significantly better moral profile than many other theme days manage.`,
      `It becomes very difficult to object to ${lead} without immediately looking worse than necessary.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} is already the kind of theme people are simply expected to accept with humility.`,
        `${allDays} may share the date, but ${lead} is still the kind of theme people are simply expected to accept with humility.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} dá à data um perfil moral muito melhor do que muitos outros temas conseguem.`,
      `Fica muito difícil contestar ${lead} sem parecer pior do que o necessário.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} já é aquele tema que as pessoas simplesmente devem aceitar com alguma humildade.`,
        `${allDays} podem dividir a data, mas ${lead} continua sendo aquele tema que o pessoal espera que você aceite com humildade.`
      ),
    ];
  }

  return [
    `${leadDay} ger datumet en klart trevligare moralisk profil än många andra temadagar lyckas med.`,
    `Det är svårt att invända mot ${lead} utan att omedelbart framstå som en sämre människa än nödvändigt.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} är redan precis den sortens tema folk bara får acceptera med viss ödmjukhet.`,
      `${allDays} råkar dela datum, men ${lead} är fortfarande den sortens tema folk bara får acceptera med viss ödmjukhet.`
    ),
  ];
}

function buildTechBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} gives the date a clear smell of enthusiasts who absolutely do not intend to be normal today either.`,
      `Once ${lead} sits at the top of the calendar, the rest of the day just has to accept that nerdiness temporarily counts as leadership.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} is enough on its own to explain why the date suddenly became strangely specific.`,
        `${allDays} share the space, but ${lead} still feels like the main reason the date became strangely specific.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} dá à data aquele cheirinho claro de entusiastas que não vão se contentar em ser normais hoje também.`,
      `Quando ${lead} domina o calendário, o resto do dia tem que aceitar que nerdice conta como liderança, pelo menos por enquanto.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já explica por que a data ficou estranhamente específica.`,
        `${allDays} compartilham o espaço, mas ${lead} ainda parece a principal razão da data ter virado algo estranhamente específico.`
      ),
    ];
  }

  return [
    `${leadDay} ger datumet en tydlig doft av entusiaster som absolut inte tänker nöja sig med att vara normala idag heller.`,
    `När ${lead} ligger överst i kalendern får resten av dagen bara acceptera att nörderi tillfälligt räknas som ledarskap.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} räcker på egen hand för att förklara varför dagen plötsligt blivit märkligt specifik.`,
      `${allDays} delar utrymmet, men ${lead} känns ändå som huvudorsaken till att dagen blivit märkligt specifik.`
    ),
  ];
}

function buildProfessionBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} is a fairly direct way of reminding everyone which people actually keep daily life stitched together for the rest of us.`,
      `If the date feels unusually functional today, that is only because ${lead} has already given it some structure.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} alone carries the kind of weight that makes the rest of the day fall into line.`,
        `${allDays} are on the schedule, but ${lead} still carries the sort of weight that makes the rest fall into line.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} é um jeito bem direto de lembrar quem realmente mantém a vida diária costurada para o resto de nós.`,
      `Se a data parece especialmente funcional hoje, é só porque ${lead} já deu uma estrutura para ela.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já tem aquele peso que faz o resto do dia se alinhar sem reclamar.`,
        `${allDays} estão na agenda, mas ${lead} tem aquele peso que faz o resto se alinhar sem reclamar.`
      ),
    ];
  }

  return [
    `${leadDay} är ett ganska tydligt sätt att påminna om vilka människor som faktiskt håller ihop vardagen åt resten av oss.`,
    `Om datumet känns ovanligt funktionellt idag är det bara för att ${lead} redan hunnit ge det lite struktur.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} bär ensam den sortens tyngd som gör att resten av dagen får rätta sig i ledet.`,
      `${allDays} står på schemat, men ${lead} bär ändå den sortens tyngd som gör att resten får rätta sig i ledet.`
    ),
  ];
}

function buildObjectBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} is so specific that the date immediately stops feeling neutral and starts feeling faintly possessed.`,
      `It is hard to argue with ${lead} once the calendar has already chosen to give it full stage lighting.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} alone is exactly the kind of detail that makes the rest of the date feel like background noise.`,
        `${allDays} share the day, but ${lead} is still exactly the kind of detail that makes the rest feel like extras.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} é tão específico que a data deixa de parecer neutra e começa a parecer meio possuída.`,
      `É difícil discutir com ${lead} quando o calendário já decidiu dar todo o holofote para ele.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já é o detalhe exato que faz o resto da data parecer mera decoração.`,
        `${allDays} dividem o dia, mas ${lead} ainda é justamente aquele detalhe que faz o resto parecer figurante.`
      ),
    ];
  }

  return [
    `${leadDay} är så specifik att datumet omedelbart slutar kännas neutralt och börjar kännas lätt besatt.`,
    `Det är svårt att argumentera mot ${lead} när kalendern redan valt att ge ämnet full scenbelysning.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} är ensam exakt den sortens detalj som får resten av datumet att kännas som bakgrundsbrus.`,
      `${allDays} delar dagen, men ${lead} är fortfarande exakt den sortens detalj som får resten att kännas som statistroller.`
    ),
  ];
}

function buildFallbackBlurbs(
  leadDay: string,
  allDays: string,
  locale: Locale,
  themeDayCount: number
): string[] {
  const lead = lowerFirst(leadDay);
  if (locale === 'en') {
    return [
      `${leadDay} has already taken possession of the date, so there is no point pretending this is a neutral weekday anymore.`,
      `Once ${lead} is in the calendar, the rest of the day mostly exists to adapt to its oddly specific energy.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} on its own is enough to make the date feel less like routine and more like a deliberate decision someone now has to defend.`,
        `${allDays} are sharing the same date, which feels less like order and more like a committee that refused to choose.`
      ),
    ];
  }

  if (locale === 'pt-BR') {
    return [
      `${leadDay} já tomou posse da data, então não adianta fingir que é um dia comum de semana.`,
      `Depois que ${lead} aparece no calendário, o resto do dia serve principalmente para se adaptar àquela energia estranhamente específica.`,
      pickSingularOrPlural(
        themeDayCount,
        `${leadDay} sozinho já basta para fazer a data parecer menos rotina e mais uma decisão específica que alguém agora vai ter de justificar.`,
        `${allDays} dividem a mesma data, o que parece menos ordem e mais uma reunião que não quis decidir.`
      ),
    ];
  }

  return [
    `${leadDay} har redan tagit datumet i besittning, så det är bara att sluta låtsas att det här är en neutral vardag.`,
    `När ${lead} väl står i kalendern är resten av dagen mest till för att anpassa sig till den märkligt specifika energin.`,
    pickSingularOrPlural(
      themeDayCount,
      `${leadDay} räcker ensam för att få datumet att kännas mindre som rutin och mer som ett märkligt specifikt beslut någon nu måste stå för.`,
      `${allDays} samsas på samma datum, vilket känns mindre som ordning och mer som en kommitté som vägrade välja.`
    ),
  ];
}

export function buildThemeDayDynamicBlurbs(
  themeDays: string[],
  locale: Locale = 'sv',
  displayThemeDays = themeDays,
  mood: Mood = 'dry'
): string[] {
  const leadDay = displayThemeDays[0];
  const allDays = joinWithAnd(displayThemeDays, locale);
  const themeDayCount = displayThemeDays.length;
  const normalized = normalizeLabel(themeDays[0]);

  if (mood !== 'dry') {
    if (locale === 'en') {
      switch (mood) {
        case 'cheerful':
          return [
            `${leadDay} gives the date a welcome little lift all by itself.`,
            `${allDays} share the slot today, which at least means the calendar did not arrive empty-handed.`,
            `The date is carrying ${leadDay.toLowerCase()} with more enthusiasm than usual, and that is probably good for morale.`,
          ];
        case 'formal':
          return [
            `${leadDay} has been entered as the lead thematic item for the date.`,
            `${allDays} are concurrently attached to the day in supporting roles.`,
            `The calendar is presently operating under a clearly non-neutral thematic brief.`,
          ];
        case 'warm':
          return [
            `${leadDay} makes the date feel less bare than it otherwise might have.`,
            `${allDays} are sharing the day, which gives it at least some human texture.`,
            `It is easier to like the calendar when ${leadDay.toLowerCase()} shows up and softens the edges.`,
          ];
        case 'chaotic':
          return [
            `${leadDay} has clearly taken the wheel, and the rest of the date is just trying not to spill.`,
            `${allDays} are piled onto the same slot, which is not exactly helping the schedule breathe evenly.`,
            `The day now has the energy of a committee that refused to pick one strange thing and go home.`,
          ];
        default:
          return [
            `${leadDay} sits on the date like a very specific hat.`,
            `${allDays} are all crowding onto the same calendar square with notable confidence.`,
            `The day now looks less like a date and more like a themed waiting room.`,
          ];
      }
    }

    if (locale === 'pt-BR') {
      switch (mood) {
        case 'cheerful':
          return [
            `${leadDay} ja da a data uma elevacao bem-vinda por conta propria.`,
            `${allDays} dividem o espaco hoje, o que ao menos significa que o calendario nao chegou de maos vazias.`,
            `A data esta carregando ${leadDay.toLowerCase()} com mais entusiasmo do que o normal, e isso provavelmente ajuda o moral.`,
          ];
        case 'formal':
          return [
            `${leadDay} foi registrado como item tematico principal da data.`,
            `${allDays} estao associados ao dia em papeis de apoio.`,
            `O calendario opera neste momento sob uma diretriz tematica claramente nao neutra.`,
          ];
        case 'warm':
          return [
            `${leadDay} faz a data parecer menos vazia do que pareceria sozinha.`,
            `${allDays} dividem o dia, o que lhe da alguma textura humana.`,
            `Fica mais facil gostar do calendario quando ${leadDay.toLowerCase()} aparece e amacia as quinas.`,
          ];
        case 'chaotic':
          return [
            `${leadDay} claramente tomou o volante, e o resto da data esta so tentando nao derramar nada.`,
            `${allDays} foram empilhados no mesmo espaco, o que nao ajuda a agenda a respirar com calma.`,
            `O dia agora tem a energia de um comite que se recusou a escolher uma coisa esquisita so e ir para casa.`,
          ];
        default:
          return [
            `${leadDay} pousou na data como um chapeu muito especifico.`,
            `${allDays} estao todos amontoados no mesmo quadrado do calendario com notavel confianca.`,
            `O dia agora parece menos uma data e mais uma sala de espera tematica.`,
          ];
      }
    }

    switch (mood) {
      case 'cheerful':
        return [
          `${leadDay} ger datumet ett välkommet litet lyft alldeles på egen hand.`,
          `${allDays} samsas här idag, vilket åtminstone betyder att kalendern inte dök upp tomhänt.`,
          `Datumet bär ${leadDay.toLowerCase()} med mer entusiasm än vanligt, och det är sannolikt bra för moralen.`,
        ];
      case 'formal':
        return [
          `${leadDay} har registrerats som datumets ledande tematiska inslag.`,
          `${allDays} är samtidigt knutna till dagen i understödjande roller.`,
          `Kalendern arbetar för närvarande under ett tydligt icke-neutralt tematiskt uppdrag.`,
        ];
      case 'warm':
        return [
          `${leadDay} gör datumet mindre kalt än det annars hade varit.`,
          `${allDays} delar dagen, vilket ger den åtminstone lite mänsklig struktur.`,
          `Det blir lättare att tycka om kalendern när ${leadDay.toLowerCase()} dyker upp och rundar av kanterna.`,
        ];
      case 'chaotic':
        return [
          `${leadDay} har tydligt tagit ratten och resten av datumet försöker mest att inte spilla.`,
          `${allDays} har staplats på samma ruta, vilket inte direkt hjälper schemat att andas jämnt.`,
          `Dagen har nu energin hos en kommitté som vägrade välja en märklig sak och gå hem.`,
        ];
      default:
        return [
          `${leadDay} sitter på datumet som en väldigt specifik hatt.`,
          `${allDays} trängs alla i samma kalenderfyrkant med anmärkningsvärd självklarhet.`,
          `Dagen ser nu mindre ut som ett datum och mer som ett tematiserat väntrum.`,
        ];
    }
  }

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
    return buildFoodBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildCultureBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildCommunityBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildNatureBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildAnimalBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildTechBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildProfessionBlurbs(leadDay, allDays, locale, themeDayCount);
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
    return buildObjectBlurbs(leadDay, allDays, locale, themeDayCount);
  }

  return buildFallbackBlurbs(leadDay, allDays, locale, themeDayCount);
}
