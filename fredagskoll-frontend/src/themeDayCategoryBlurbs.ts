import { Locale } from './locale';
import { Mood } from './mood';
import { includesAny, normalizeLabel } from './themeDayTextUtils';

function lower(value: string): string {
  return value.toLowerCase();
}

export function getThemeDayCategoryBlurbs(
  themeDay: string,
  locale: Locale = 'sv',
  displayThemeDay = themeDay,
  mood: Mood = 'dry'
): string[] {
  const normalized = normalizeLabel(themeDay);
  const shownDay = displayThemeDay;

  if (mood !== 'dry') {
    if (locale === 'en') {
      switch (mood) {
        case 'cheerful':
          return [
            `${shownDay} gives the date a welcome little pulse of personality.`,
            `It's ${lower(shownDay)} today, which is still more fun than a blank weekday.`,
            `${shownDay} makes the calendar feel a little more alive and a little less bureaucratic.`,
            `If the day wants to be about ${lower(shownDay)}, that seems harmless enough to enjoy.`,
          ];
        case 'formal':
          return [
            `${shownDay} has been designated as the day's operative theme.`,
            `It is ${lower(shownDay)} today, and the calendar is treating that as sufficient structure.`,
            `${shownDay} provides a narrow but valid framework for the date.`,
            `The schedule is now proceeding under the thematic influence of ${lower(shownDay)}.`,
          ];
        case 'warm':
          return [
            `${shownDay} gives the date a little more warmth than it would otherwise have had.`,
            `It's ${lower(shownDay)} today, which at least makes the calendar feel less cold.`,
            `${shownDay} helps the day feel less empty and a bit easier to like.`,
            `If the date gets to lean on ${lower(shownDay)}, that is not the worst arrangement.`,
          ];
        case 'chaotic':
          return [
            `${shownDay} has attached itself to the date and made the whole thing wobble a little.`,
            `It's ${lower(shownDay)} today, which explains the sudden loss of conventional discipline.`,
            `${shownDay} gives the schedule a very specific instability.`,
            `The calendar has handed the controls to ${lower(shownDay)} and then quietly backed away.`,
          ];
        default:
          return [
            `${shownDay} is so specific that the date now feels oddly curated.`,
            `It's ${lower(shownDay)} today, which means the calendar has once again acquired a costume.`,
            `${shownDay} lends the day a strangely intentional shape.`,
            `The date is currently being supervised by ${lower(shownDay)} with mixed but memorable results.`,
          ];
      }
    }

    if (locale === 'pt-BR') {
      switch (mood) {
        case 'cheerful':
          return [
            `${shownDay} da a data uma pequena e bem-vinda pulsacao de personalidade.`,
            `Hoje e ${lower(shownDay)}, o que ainda e mais divertido do que um dia vazio.`,
            `${shownDay} faz o calendario parecer um pouco mais vivo e um pouco menos burocratico.`,
            `Se o dia quer ser sobre ${lower(shownDay)}, isso parece inofensivo o bastante para aproveitar.`,
          ];
        case 'formal':
          return [
            `${shownDay} foi designado como tema operativo do dia.`,
            `Hoje e ${lower(shownDay)}, e o calendario trata isso como estrutura suficiente.`,
            `${shownDay} fornece uma moldura estreita, mas valida, para a data.`,
            `A agenda segue agora sob influencia tematica de ${lower(shownDay)}.`,
          ];
        case 'warm':
          return [
            `${shownDay} da a data um pouco mais de calor do que ela teria sozinha.`,
            `Hoje e ${lower(shownDay)}, o que pelo menos faz o calendario parecer menos frio.`,
            `${shownDay} ajuda o dia a parecer menos vazio e um pouco mais facil de gostar.`,
            `Se a data pode se apoiar em ${lower(shownDay)}, isso esta longe de ser um mau arranjo.`,
          ];
        case 'chaotic':
          return [
            `${shownDay} se prendeu a data e fez o conjunto inteiro balancar um pouco.`,
            `Hoje e ${lower(shownDay)}, o que explica a perda repentina de disciplina convencional.`,
            `${shownDay} da a agenda uma instabilidade muito especifica.`,
            `O calendario entregou os controles a ${lower(shownDay)} e depois se afastou em silencio.`,
          ];
        default:
          return [
            `${shownDay} e tao especifico que a data agora parece estranhamente curada.`,
            `Hoje e ${lower(shownDay)}, o que significa que o calendario ganhou figurino mais uma vez.`,
            `${shownDay} empresta ao dia uma forma estranhamente intencional.`,
            `A data esta atualmente sendo supervisionada por ${lower(shownDay)} com resultados mistos, mas memoraveis.`,
          ];
      }
    }

    switch (mood) {
      case 'cheerful':
        return [
          `${shownDay} ger datumet en välkommen liten puls av personlighet.`,
          `Det är ${lower(shownDay)} idag, vilket fortfarande är roligare än ren blankvardag.`,
          `${shownDay} gör kalendern lite mer levande och lite mindre byråkratisk.`,
          `Om dagen vill handla om ${lower(shownDay)} så känns det ofarligt nog att uppskatta.`,
        ];
      case 'formal':
        return [
          `${shownDay} har utsetts till dagens operativa tema.`,
          `Det är ${lower(shownDay)} idag, och kalendern behandlar det som tillräcklig struktur.`,
          `${shownDay} tillför datumet en smal men giltig ram.`,
          `Schemat fortgår nu under tematisk påverkan av ${lower(shownDay)}.`,
        ];
      case 'warm':
        return [
          `${shownDay} ger datumet lite mer värme än det annars hade haft.`,
          `Det är ${lower(shownDay)} idag, vilket åtminstone gör kalendern mindre kall i tonen.`,
          `${shownDay} hjälper dagen att kännas mindre tom och lite lättare att tycka om.`,
          `Om datumet får luta sig mot ${lower(shownDay)} så är det långt ifrån den sämsta lösningen.`,
        ];
      case 'chaotic':
        return [
          `${shownDay} har hängt sig fast i datumet och gjort hela upplägget lite mer svajigt.`,
          `Det är ${lower(shownDay)} idag, vilket förklarar den plötsliga bristen på konventionell disciplin.`,
          `${shownDay} ger schemat en väldigt specifik instabilitet.`,
          `Kalendern lämnade över kontrollerna till ${lower(shownDay)} och backade sedan långsamt ut ur rummet.`,
        ];
      default:
        return [
          `${shownDay} är så specifik att datumet nu känns märkligt kurerat.`,
          `Det är ${lower(shownDay)} idag, vilket betyder att kalendern återigen tagit på sig kostym.`,
          `${shownDay} lånar dagen en märkligt avsiktlig form.`,
          `Datumet står just nu under tillsyn av ${lower(shownDay)} med blandat men minnesvärt resultat.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} parece decisão administrativa tomada por pessoas com migalhas no teclado.`,
        `Hoje é ${lower(shownDay)}, mais uma desculpa para fingir que calorias têm valor cultural.`,
        `${shownDay} melhora o dia rebaixando padrões e elevando o açúcar no sangue.`,
        `Não precisa entender por que ${lower(shownDay)} existe. Só serve algo e segue o baile.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} quer que você se sinta culto sem esforço absurdo.`,
        `Hoje é ${lower(shownDay)}, soa melhor que mais um dia insosso.`,
        `${shownDay} dá à data uma camada fina, porém funcional, de cultura. Isso basta.`,
        `O calendário tenta te intelectualizar com ${lower(shownDay)}. Ousado, não?`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} merece mais que um olhar preguiçoso e um “tá bom” meia-boca.`,
        `Hoje é ${lower(shownDay)}, pelo menos dá à data um pouco mais de fibra que o blá-blá tema padrão.`,
        `${shownDay} empresta uma dignidade cultural ao dia que esse app nem sempre consegue.`,
        `O calendário quer subir o nível com ${lower(shownDay)} hoje. Melhor agir conforme.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} é exatamente aquele tipo de dia tema que ninguém sensato discute.`,
        `Hoje é ${lower(shownDay)}. Que bom. Pelo menos algo com perfil moral minimamente decente.`,
        `${shownDay} torna o calendário um pouco mais simpático que o normal.`,
        `Se o dia é de ${lower(shownDay)}, a resposta sensata é concordar e seguir em frente.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} soa como coisa inventada na internet que ninguém quer largar.`,
        `Hoje é ${lower(shownDay)}, em algum canto um entusiasta está se sentindo ótimo.`,
        `${shownDay} oferece à data um cheirinho leve de nerdice confiante. Não é ruim.`,
        `O calendário entregou o dia para ${lower(shownDay)}. O jeito é aceitar.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} é um lembrete direto de qual profissão quer ser vista sem precisar fazer rebelião.`,
        `Hoje é ${lower(shownDay)}. Com razão, o dia pede ao menos um reconhecimento meia-boca.`,
        `${shownDay} lembra a sociedade quem mantém essa bagunça de pé.`,
        `O calendário aposta em ${lower(shownDay)} hoje, e isso parece até merecido.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} parece o calendário tentando empurrar geral para fora, daquele jeito gentil, mas insistente.`,
        `Hoje é ${lower(shownDay)}, mais uma desculpa pra fingir que ar fresco resolve tudo.`,
        `${shownDay} deixa a data com cheirinho gostoso de romance com a natureza e culpas leves.`,
        `Se o dia insiste que é ${lower(shownDay)}, beleza. Vai dar uma caminhada e para de reclamar.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} parece um dia criado para alguém no seu círculo pedir atenção com respaldo do calendário.`,
        `Hoje é ${lower(shownDay)}, então o jeito é mostrar alguma habilidade social e torcer para o melhor.`,
        `${shownDay} deixa as relações desnecessariamente formais, mas pelo menos as expectativas são claras.`,
        `O calendário deu status quase oficial para ${lower(shownDay)}. Infelizmente, não tem discussão.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} é um belo exemplo de até onde a humanidade pode levar a ideia de que qualquer coisa merece um dia.`,
        `Hoje é ${lower(shownDay)}, informação específica demais pra ser inventada e absurda demais pra contestar.`,
        `${shownDay} concede a objetos comuns um breve, mas intenso momento de dignidade irracional.`,
        `O calendário decidiu por ${lower(shownDay)} hoje. Ninguém sabe bem o porquê, mas o mecanismo continua.`,
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
    if (locale === 'pt-BR') {
      return [
        `${shownDay} é exatamente o tipo de coisa que faz o calendário parecer ao mesmo tempo charmoso e meio doente.`,
        `Hoje é ${lower(shownDay)}, e não tem resposta digna além de um sorriso cansado.`,
        `${shownDay} lembra que dias tema geralmente surgem quando alguém com energia demais tem acesso a uma data.`,
        `O calendário foi com tudo em ${lower(shownDay)} aqui, e quase dá para respeitar a ousadia.`,
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
  if (locale === 'pt-BR') {
    return [
      `${shownDay} arranjou um jeito de entrar no calendário e aparentemente exige algum respeito.`,
      `Hoje é ${shownDay}. Motivo suficiente para abaixar um pouco as expectativas.`,
      `${shownDay} carrega a data. Ainda é melhor que um dia comum sem graça.`,
      `Alguém transformou ${lower(shownDay)} em coisa séria, e o resto de nós só pode aceitar.`,
    ];
  }

  return [
    `${themeDay} har letat sig in i kalendern och kräver tydligen någon sorts respekt.`,
    `Det är ${themeDay} idag. Det räcker som skäl att justera ambitionsnivån en aning.`,
    `${themeDay} får bära dagen. Det är ändå bättre än ren vardag utan täckning.`,
    `Någon har gjort ${themeDay.toLowerCase()} till en grej, och nu får vi andra bara acceptera läget.`,
  ];
}
