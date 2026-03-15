import carltonGif from '../../gifs/carlton.gif';
import carltonChristmasGif from '../../gifs/carltonchristmas.gif';
import {
  ContentPack,
  TeamWeekdayDayType,
  getActiveContentPack,
  isTeamWeekdayDayType,
} from '../../contentPack';
import celebrationsEn from '../../data/celebrations.en.json';
import celebrationsPtBr from '../../data/celebrations.pt-BR.json';
import { DayType } from '../../dayLogic';
import { Locale } from '../../locale';
import { Mood } from '../../mood';
export type CelebrationTheme =
  | 'ordinary'
  | 'jam'
  | 'cream'
  | 'forest'
  | 'ember'
  | 'gold'
  | 'midnight';
export type CelebrationContent = {
  title: string;
  subtitle?: string;
  kicker: string;
  alt?: string;
  blurbs: string[];
  primaryImage?: string;
  secondaryImage?: string;
  visualBadge?: string;
  visualTitle?: string;
  visualBody?: string;
  theme: CelebrationTheme;
};
type CelebrationLocalePayload = {
  ordinaryBlurb: string;
  ordinaryWeekdayBlurbs: string[];
  ordinaryWeekendBlurbs: string[];
  celebrationThemeAliases: Record<Exclude<DayType, 'ordinary'>, string[]>;
  celebrations: Record<
    Exclude<DayType, 'ordinary'>,
    Pick<
      CelebrationContent,
      | 'title'
      | 'subtitle'
      | 'kicker'
      | 'alt'
      | 'blurbs'
      | 'visualBadge'
      | 'visualTitle'
      | 'visualBody'
      | 'theme'
    >
  >;
};

const englishCelebrationContent = celebrationsEn as CelebrationLocalePayload;
const portugueseCelebrationContent = celebrationsPtBr as CelebrationLocalePayload;

const ordinaryBlurbSv =
  'Nej, idag är det inte någon svensk firardag som platsar här.';

const ordinaryWeekdayBlurbsSv = [
  'Det är en vanlig arbetsdag. Du får skapa din egen stämning, och det känns ju tveksamt.',
  'Ingen högtid har räddat den här dagen. Det är bara du, kalendern och ett stilla missnöje.',
  'Det finns ingen officiell ursäkt idag, bara den vanliga sortens vardaglig uppgivenhet.',
  'En helt vanlig veckodag har infunnit sig. Beklagar.',
  'Det här datumet bjuder inte på semlor, sill eller nationell gemenskap. Bara arbete.',
  'Ingen svensk temadag bär dig idag. Du får bära dig själv, vilket känns onödigt.',
  'Dagen är helt ordinär, som om universum aktivt valt bort underhållning.',
  'Det är inte fest, inte tradition och inte ens lite bullplikt. Bara vanlig drift.',
  'En sådan där dag som mest existerar för att hålla ihop veckan mellan de bättre datumen.',
  'Inget särskilt händer idag, vilket tyvärr inte hindrar folk från att boka möten.',
  'Det är en rak vardag utan stöd från kulturarvet. Ett ganska kallt upplägg.',
  'Allt tyder på att du får ta dig igenom den här dagen utan hjälp av någon som helst högtidsenergi.',
  'Det här är en arbetsdag utan tema, vilket innebär att allt ansvar fortfarande ligger pinsamt mycket på dig.',
  'Kalendern tittade på det här datumet och bestämde sig för att absolut inte hjälpa till.',
  'Ingen semla, ingen sill, ingen kollektiv eufori. Bara ett stilla kontorssorl och ett oinspirerat tangentbord.',
  'Det är en sådan vardag som får kaffe att kännas som den enda vuxna i rummet.',
  'Dagen saknar helt draghjälp från tradition, vilket är djärvt med tanke på hur lite annat den erbjuder.',
  'Vissa datum anländer med trumpetfanfarer. Det här kom in bakvägen med ett excelark under armen.',
  'Det är inte en dag man minns. Det är en dag man administrerar sig igenom.',
  'Allt med den här dagen signalerar "fortsätt bara", vilket inte direkt är poesi men tyvärr fungerande styrning.',
  'Ingen tradition har lagt hand på den här vardagen. Den står helt oskyddad mot statusmöten och torr luft.',
  'Det här datumet har samma energi som ett möte som kunde varit ett meddelande men nu pågår ändå.',
  'En ren standarddag. Inga flaggor, inga bakverk, bara den vanliga kampen mot klockan 14:37.',
  'Kalendern skickade fram en helt naken vardag och tyckte tydligen att det fick räcka som innehåll.',
  'Det här är dagen då man får skapa sin egen glöd trots att allt runtomkring lutar åt lysrör och uppgivenhet.',
  'Ingenting i kulturarvet tänkte ställa upp idag. Det blir du, stolen och en serie måttligt inspirerade beslut.',
  'Vanlig arbetsdag, ja. Men på ett sådant sätt att till och med skrivaren verkar ha gett upp lite i förväg.',
  'Det finns dagar man firar. Det finns dagar man uthärdar med kaffe och medborgerlig tystnad. Detta är den senare sorten.',
  'Dagen är så ordinär att den skulle kunna vara defaultinställningen för hela kvartalet.',
  'Hela upplägget luktar "vi tar det efter lunch", och sedan gör ingen något värdigt efter lunch heller.',
  'Ingen liten svensk temadag kommer att bryta fallet här. Du får landa i vardagen på egen hand.',
  'Det här är administrationens egen lilla arbetsseger: en dag som inte stör, gläder eller ursäktar något alls.',
];

const ordinaryWeekendBlurbsSv = [
  'Det är helg, men inte på det minsta glittriga sättet. Bara frihet med lätt städsmak i bakgrunden.',
  'Ingen högtid styr den här helgen. Det är du, en soffa och en vag känsla av att något borde bli gjort.',
  'Datumet erbjuder ingen officiell fest, bara den vanliga helgfriden blandad med diskret dåligt samvete.',
  'Det här är en helt vanlig helgdag, vilket betyder att ambitionerna redan börjar förhandla ner sig själva.',
  'Ingen tradition kommer och räddar stämningen. Det blir eget ansvar, vilket alltid känns onödigt på helger.',
  'Det är helg utan högtidsstöd. Man får underhålla sig med kaffe, promenader och låggradig prokrastinering.',
  'En vanlig lördag eller söndag har infunnit sig och begär egentligen bara att du inte gör något för imponerad av dig själv.',
  'Kalendern har inga stora planer för den här helgen. Den verkar mest hoppas att du löser resten själv.',
  'Det finns inga officiella fanfarer idag, bara den stilla helgkänslan av att tiden borde användas klokt men sannolikt inte kommer göra det.',
  'Det är en sådan helgdag som mest existerar för att visa att fritid också kan vara lite innehållslös.',
  'Ingen semla, ingen sill, ingen nationell ritual. Bara vanligt svenskt helglunk och ett kylskåp med oklara ambitioner.',
  'Dagen har frid, men inte riktning. Det är i och för sig ganska mycket helg i ett nötskal.',
  'Det här datumet saknar helt ceremoniell tyngd och lutar i stället tungt mot mjukisbyxor.',
  'Vanlig helg, vanlig luft, vanlig tystnad. Inte uselt, bara fullständigt ofestligt.',
  'Helgen är fri från traditioner idag, vilket låter skönt tills man inser att man måste uppfinna sin egen mening.',
  'Det finns inga historiska lager här, bara den vanliga nutida mixen av kaffe, scrollande och uppskjuten struktur.',
  'En helt neutral helgdag. Det närmaste ett firande du kommer är kanske att ingen aktivt vill ha något av dig.',
  'Det är en sådan dag då man kan göra precis vad man vill och därför mest driver runt i lätt beslutsförlamning.',
  'Ingen officiell anledning att samlas, skåla eller baka. Bara ett fritt datum med skrämmande mycket eget ansvar.',
  'Helgens stora innehåll idag är att den pågår. Man får tydligen vara tacksam för det.',
];

function getMoodOrdinaryBlurb(locale: Locale, mood: Mood): string | null {
  if (mood === 'dry') {
    return null;
  }

  switch (mood) {
    case 'cheerful':
      return locale === 'en'
        ? 'No major Swedish celebration is carrying the date, but the day is still workable with decent snacks and a little goodwill.'
        : locale === 'pt-BR'
          ? 'Nenhuma grande celebracao sueca esta carregando a data, mas o dia ainda funciona com um lanche decente e alguma boa vontade.'
          : 'Ingen större svensk firardag bär datumet, men dagen är fortfarande fullt användbar med något gott och lite god vilja.';
    case 'formal':
      return locale === 'en'
        ? 'No Swedish celebration of sufficient weight has been identified for this date.'
        : locale === 'pt-BR'
          ? 'Nenhuma celebracao sueca de peso suficiente foi identificada para esta data.'
          : 'Ingen svensk firardag av tillräcklig dignitet har identifierats för detta datum.';
    case 'warm':
      return locale === 'en'
        ? 'No major Swedish celebration turned up here, but the date does not have to be treated harshly for that.'
        : locale === 'pt-BR'
          ? 'Nenhuma grande celebracao sueca apareceu aqui, mas a data nao precisa ser tratada com dureza por isso.'
          : 'Ingen större svensk firardag dök upp här, men datumet behöver inte behandlas hårt för det.';
    case 'chaotic':
      return locale === 'en'
        ? 'No Swedish celebration arrived to stabilize the situation. The date is basically freestyling now.'
        : locale === 'pt-BR'
          ? 'Nenhuma celebracao sueca apareceu para estabilizar a situacao. A data esta basicamente improvisando agora.'
          : 'Ingen svensk firardag kom för att stabilisera läget. Datumet frijazzar i princip nu.';
    case 'absurd':
      return locale === 'en'
        ? 'No Swedish celebration claimed the date, so it is left wandering the halls in ordinary office clothes.'
        : locale === 'pt-BR'
          ? 'Nenhuma celebracao sueca reivindicou a data, entao ela ficou vagando pelos corredores em roupa de escritorio.'
          : 'Ingen svensk firardag gjorde anspråk på datumet, så det går nu runt i korridoren klätt som en vanlig arbetsdag.';
    default:
      return null;
  }
}

function getMoodOrdinaryDayBlurbs(
  locale: Locale,
  isWeekend: boolean,
  mood: Mood
): string[] | null {
  if (mood === 'dry') {
    return null;
  }

  if (locale === 'en') {
    if (mood === 'cheerful') {
      return isWeekend
        ? [
            'It is a plain weekend, which is still a respectable excuse to move slowly and drink something warm.',
            'No holiday is carrying the weekend, but the schedule has at least relaxed its jaw a little.',
            'The date offers no official party, only free time with decent recovery potential.',
            'Nothing ceremonial is happening, which leaves more room for snacks, air, and low-stakes plans.',
          ]
        : [
            'It is a regular workday, but the day is still salvageable with coffee and moderate competence.',
            'No celebration has rescued the date, though it remains structurally capable of becoming decent.',
            'This is an ordinary weekday, which mostly means the bar for success can stay pleasantly low.',
            'The calendar provided no fanfare, but the day still has room for one useful decision and a proper lunch.',
          ];
    }
    if (mood === 'formal') {
      return isWeekend
        ? [
            'This weekend date carries no official ceremonial burden.',
            'No holiday directive has been attached to the day. Private management is therefore advised.',
            'The weekend remains in standard operating condition, absent any larger tradition.',
            'No formal observance intervenes here; the date is proceeding under ordinary leisure rules.',
          ]
        : [
            'This is a standard workday with no sanctioned festive exception.',
            'No official observance has been assigned to the date.',
            'The weekday remains operationally ordinary and will require self-supplied motivation.',
            'No public tradition has been registered here; routine procedures remain in force.',
          ];
    }
    if (mood === 'warm') {
      return isWeekend
        ? [
            'It is only a normal weekend, but that still leaves room for gentler pacing and a little grace.',
            'No holiday is lifting the date, though the day can still be kind if people allow it.',
            'The weekend arrived without fireworks, which is not the same thing as arriving empty.',
            'Nothing official is happening, and that may be reason enough to breathe a bit.',
          ]
        : [
            'It is a regular workday, but not every decent day needs ceremonial help.',
            'No celebration came to rescue the date, though a calm lunch and a humane tone would still improve it.',
            'The day is ordinary, which is not ideal, but not a moral failure either.',
            'No holiday is carrying this weekday. People will have to be slightly nicer on their own.',
          ];
    }
    if (mood === 'chaotic') {
      return isWeekend
        ? [
            'It is technically the weekend, though the date is carrying a faint smell of abandoned plans.',
            'No holiday took command here, so the day is mostly free-range leisure with loose wiring.',
            'The weekend has no official plot today, only momentum and whatever was left in the fridge.',
            'Nothing ceremonial showed up, so the date is just roaming around in socks with poor supervision.',
          ]
        : [
            'This is a regular workday and the calendar has provided no protective equipment.',
            'No celebration has saved the date, so the day is out here making eye contact with meetings unaided.',
            'The weekday is fully ordinary and therefore exposed to all the usual operational nonsense.',
            'No tradition is carrying this date. It is just you, the clock, and a slightly unstable chain of decisions.',
          ];
    }
    return isWeekend
      ? [
          'It is an ordinary weekend, drifting around with no official costume and suspiciously little doctrine.',
          'No holiday claimed the date. It has therefore become a free-floating pocket of leisure in civilian clothes.',
          'The weekend is unsupervised by tradition today, which gives it a mildly experimental quality.',
          'Nothing formal is happening. The date is basically lying on a sofa inside the calendar.',
        ]
      : [
          'This is a standard weekday with no festival attached, a beige rectangle wearing a wristwatch.',
          'No celebration arrived, so the day has been left to walk upright under its own administrative power.',
          'The calendar submitted an unadorned weekday and expected everyone to pretend that was normal.',
          'No public excuse is available. The date is simply standing there in office shoes.',
        ];
  }

  if (locale === 'pt-BR') {
    if (mood === 'cheerful') {
      return isWeekend
        ? [
            'E um fim de semana comum, o que ainda e uma desculpa bastante respeitavel para andar devagar e beber algo quente.',
            'Nenhum feriado esta carregando o dia, mas a agenda ao menos afrouxou a gravata.',
            'A data nao oferece festa oficial, so tempo livre com algum potencial de recuperacao.',
            'Nada cerimonial esta acontecendo, o que deixa mais espaco para lanches, ar fresco e planos modestos.',
          ]
        : [
            'E um dia util comum, mas ainda perfeitamente salvavel com cafe e alguma competencia.',
            'Nenhuma celebracao salvou a data, mas ela continua estruturalmente capaz de ficar decente.',
            'E um dia de semana comum, o que tambem significa que a barra do sucesso pode continuar agradavelmente baixa.',
            'O calendario nao ofereceu fanfarra nenhuma, mas o dia ainda comporta uma boa decisao e um almoco digno.',
          ];
    }
    if (mood === 'formal') {
      return isWeekend
        ? [
            'Esta data de fim de semana nao possui carga cerimonial oficial.',
            'Nenhuma diretriz festiva foi anexada ao dia. Recomenda-se gestao privada.',
            'O fim de semana permanece em condicao operacional padrao, sem tradicao maior associada.',
            'Nenhuma observancia formal intervem aqui; a data segue em regime comum de lazer.',
          ]
        : [
            'Trata-se de um dia util padrao sem excecao festiva sancionada.',
            'Nenhuma observancia oficial foi atribuida a data.',
            'O dia util permanece operacionalmente comum e exigira motivacao fornecida pelo proprio usuario.',
            'Nenhuma tradicao publica foi registrada aqui; os procedimentos rotineiros seguem em vigor.',
          ];
    }
    if (mood === 'warm') {
      return isWeekend
        ? [
            'E apenas um fim de semana comum, mas isso ainda deixa espaco para um ritmo mais gentil.',
            'Nenhum feriado elevou a data, embora o dia ainda possa ser acolhedor se as pessoas permitirem.',
            'O fim de semana chegou sem fogos de artificio, o que nao e a mesma coisa que chegar vazio.',
            'Nada oficial esta acontecendo, e isso talvez ja seja motivo suficiente para respirar com calma.',
          ]
        : [
            'E um dia util comum, mas nem todo bom dia precisa de ajuda cerimonial.',
            'Nenhuma celebracao veio salvar a data, embora um almoco tranquilo e um tom humano ainda ajudem muito.',
            'O dia e ordinario, o que nao e ideal, mas tambem nao e uma tragedia moral.',
            'Nenhum feriado esta carregando esta quarta-feira. As pessoas vao ter de ser um pouco mais gentis por conta propria.',
          ];
    }
    if (mood === 'chaotic') {
      return isWeekend
        ? [
            'Tecnicamente e fim de semana, embora a data carregue um cheiro leve de planos abandonados.',
            'Nenhum feriado assumiu o comando aqui, entao o dia virou lazer de criacao livre com fiacao frouxa.',
            'O fim de semana nao tem enredo oficial hoje, so impulso e o que restou na geladeira.',
            'Nada cerimonial apareceu, entao a data esta andando por ai de meia e sem supervisao.',
          ]
        : [
            'Isto e um dia util comum e o calendario nao forneceu equipamento de protecao.',
            'Nenhuma celebracao salvou a data, entao o dia esta encarando reunioes sem assistencia.',
            'O dia util e completamente comum e, portanto, exposto a todo o absurdo operacional habitual.',
            'Nenhuma tradicao esta carregando esta data. E so voce, o relogio e uma cadeia meio instavel de decisoes.',
          ];
    }
    return isWeekend
      ? [
          'E um fim de semana comum, vagando por ai sem fantasia oficial e com surpreendentemente pouca doutrina.',
          'Nenhum feriado reivindicou a data. Ela virou um bolso de lazer flutuando em roupa civil.',
          'O fim de semana esta hoje sem supervisao da tradicao, o que lhe confere uma qualidade levemente experimental.',
          'Nada formal esta acontecendo. A data basicamente se deitou no sofa dentro do calendario.',
        ]
      : [
          'Isto e um dia util padrao sem festa associada, um retangulo bege de relogio no pulso.',
          'Nenhuma celebracao chegou, entao o dia foi deixado para caminhar ereto por conta propria.',
          'O calendario enviou um dia util sem adornos e esperou que todos fingissem que isso era normal.',
          'Nenhuma desculpa publica esta disponivel. A data esta apenas ali, em sapatos sociais.',
        ];
  }

  if (mood === 'cheerful') {
    return isWeekend
      ? [
          'Det är en vanlig helg, vilket fortfarande är en fullt respektabel ursäkt att ta det lugnt och dricka något varmt.',
          'Ingen högtid bär datumet, men schemat har åtminstone släppt käkarna lite.',
          'Datumet erbjuder ingen officiell fest, bara ledig tid med hygglig återhämtningspotential.',
          'Inget ceremoniellt pågår, vilket lämnar mer utrymme för fika, luft och rimliga småplaner.',
        ]
      : [
          'Det är en vanlig arbetsdag, men dagen är fortfarande räddningsbar med kaffe och måttlig kompetens.',
          'Ingen högtid kom och räddade datumet, men det är fortfarande strukturellt kapabelt att bli helt okej.',
          'Det här är en vanlig vardag, vilket också betyder att ribban för framgång får vara behagligt låg.',
          'Kalendern bjöd inte på fanfarer, men dagen rymmer fortfarande ett klokt beslut och en vettig lunch.',
        ];
  }

  if (mood === 'formal') {
    return isWeekend
      ? [
          'Denna helgdag saknar officiell ceremoniell belastning.',
          'Ingen högtidsanvisning har knutits till datumet. Privat hantering rekommenderas.',
          'Helgen befinner sig i standardläge, utan större traditionellt ingrepp.',
          'Ingen formell observans intervenerar här; datumet fortgår under ordinarie fritidsregim.',
        ]
      : [
          'Detta är en standardarbetsdag utan sanktionerat festundantag.',
          'Ingen officiell observans har tilldelats datumet.',
          'Vardagen förblir operativt ordinär och kräver självförsörjd motivation.',
          'Ingen offentlig tradition har registrerats här; rutinmässiga förfaranden gäller fortsatt.',
        ];
  }

  if (mood === 'warm') {
    return isWeekend
      ? [
          'Det är bara en vanlig helg, men det lämnar ändå plats för ett lite vänligare tempo.',
          'Ingen högtid lyfter datumet, men dagen kan fortfarande bli mild om folk tillåter det.',
          'Helgen kom utan fanfarer, vilket inte är samma sak som att den kom tomhänt.',
          'Inget officiellt pågår, och det kan faktiskt räcka långt för en stunds återhämtning.',
        ]
      : [
          'Det är en vanlig arbetsdag, men inte varje hygglig dag behöver ceremoniell hjälp.',
          'Ingen högtid kom och bar datumet, men lugn lunch och mänskligt tonfall hjälper fortfarande.',
          'Dagen är ordinär, vilket inte är idealiskt men heller inte ett moraliskt misslyckande.',
          'Ingen tradition bär den här vardagen. Folk får vara lite trevligare på eget initiativ.',
        ];
  }

  if (mood === 'chaotic') {
    return isWeekend
      ? [
          'Det är tekniskt sett helg, även om datumet luktar svagt av övergivna planer.',
          'Ingen högtid tog kommandot här, så dagen blev frilansfritid med lös kabeldragning.',
          'Helgen har ingen officiell intrig idag, bara momentum och det som låg kvar i kylen.',
          'Inget ceremoniellt dök upp, så datumet går mest runt i strumplästen utan vuxenstöd.',
        ]
      : [
          'Det här är en vanlig arbetsdag och kalendern har inte tillhandahållit skyddsutrustning.',
          'Ingen högtid räddade datumet, så dagen får ta ögonkontakt med möten helt oskyddad.',
          'Vardagen är fullt ordinär och därmed utsatt för all den vanliga operativa dårskapen.',
          'Ingen tradition bär det här datumet. Det är bara du, klockan och en lätt instabil kedja av beslut.',
        ];
  }

  return isWeekend
    ? [
        'Det är en vanlig helg som glider runt utan officiell kostym och med misstänkt lite doktrin.',
        'Ingen högtid gjorde anspråk på datumet. Det blev alltså ett fritt flytande fritidsfack i civila kläder.',
        'Helgen saknar idag tillsyn från traditionen, vilket ger den en lätt experimentell kvalitet.',
        'Inget formellt pågår. Datumet ligger i princip på en soffa inne i kalendern.',
      ]
    : [
        'Det här är en standardvardag utan fest kopplad till sig, en beige rektangel med armbandsur.',
        'Ingen högtid anlände, så dagen lämnades åt att gå upprätt under egen administrativ kraft.',
        'Kalendern skickade fram en osmyckad vardag och väntade sig att alla skulle låtsas att det var normalt.',
        'Ingen offentlig ursäkt står till buds. Datumet står bara där i kontorsskor.',
      ];
}

function getMoodCelebrationBlurbs(
  content: CelebrationContent,
  locale: Locale,
  mood: Mood
): string[] | null {
  if (mood === 'dry') {
    return null;
  }

  const subject = content.alt ?? content.title;

  if (locale === 'en') {
    switch (mood) {
      case 'cheerful':
        return [
          `${subject} is in charge today, which is honestly a decent reason to lighten up a little.`,
          `The date has handed itself over to ${content.kicker.toLowerCase()}, and the atmosphere is better for it.`,
          `If ${subject} gets to run the day, the sensible response is snacks, generosity, and lower shoulders.`,
          `${subject} gives the calendar enough energy to make even routine look slightly more forgivable.`,
        ];
      case 'formal':
        return [
          `${subject} has been granted temporary ceremonial priority.`,
          `Today's operational mood is best summarized as ${content.kicker.toLowerCase()}.`,
          `${subject} carries sufficient symbolic weight to justify a modest change in posture.`,
          `The date is now proceeding under the influence of ${subject}.`,
        ];
      case 'warm':
        return [
          `${subject} is steering the date today, and the day is probably better for being treated a little more gently.`,
          `There are harsher ways to spend a date than under the influence of ${content.kicker.toLowerCase()}.`,
          `${subject} makes the day feel less mechanical and a bit more human.`,
          `If the calendar insists on ${subject}, we may as well meet it with some grace.`,
        ];
      case 'chaotic':
        return [
          `${subject} has clearly seized the controls, and the schedule is not recovering elegantly.`,
          `Today's official energy is ${content.kicker.toLowerCase()}, which explains quite a lot.`,
          `${subject} is now running the room with more confidence than the adults present.`,
          `The date has tilted hard toward ${subject}, and normal procedure can only wave from the shore.`,
        ];
      default:
        return [
          `${subject} has slipped into the date and started rearranging the furniture.`,
          `Today's atmosphere can only be described as ${content.kicker.toLowerCase()} wearing a borrowed badge.`,
          `${subject} gives the calendar a strangely specific face and expects everyone to accept it.`,
          `The day is now under the decorative authority of ${subject}. Resistance would be theatrical.`,
        ];
    }
  }

  if (locale === 'pt-BR') {
    switch (mood) {
      case 'cheerful':
        return [
          `${subject} esta no comando hoje, o que honestamente ja e um bom motivo para relaxar um pouco.`,
          `A data se entregou a ${content.kicker.toLowerCase()}, e o clima ficou melhor por isso.`,
          `Se ${subject} vai conduzir o dia, a resposta sensata e lanches, generosidade e ombros menos tensos.`,
          `${subject} da ao calendario energia suficiente para tornar a rotina um pouco mais perdoavel.`,
        ];
      case 'formal':
        return [
          `${subject} recebeu prioridade cerimonial temporaria.`,
          `O estado operacional de hoje pode ser resumido como ${content.kicker.toLowerCase()}.`,
          `${subject} carrega peso simbolico suficiente para justificar uma pequena mudanca de postura.`,
          `A data prossegue agora sob influencia de ${subject}.`,
        ];
      case 'warm':
        return [
          `${subject} esta conduzindo a data hoje, e o dia provavelmente melhora se for tratado com um pouco mais de gentileza.`,
          `Existem maneiras bem mais duras de passar uma data do que sob a influencia de ${content.kicker.toLowerCase()}.`,
          `${subject} faz o dia parecer menos mecanico e um pouco mais humano.`,
          `Se o calendario insiste em ${subject}, o minimo e responder com alguma graca.`,
        ];
      case 'chaotic':
        return [
          `${subject} claramente tomou os controles, e a agenda nao vai se recuperar com elegancia.`,
          `A energia oficial de hoje e ${content.kicker.toLowerCase()}, o que explica muita coisa.`,
          `${subject} esta comandando o ambiente com mais confianca do que os adultos presentes.`,
          `A data tombou forte na direcao de ${subject}, e o procedimento normal so consegue acenar de longe.`,
        ];
      default:
        return [
          `${subject} entrou na data e comecou a rearranjar os moveis.`,
          `A atmosfera de hoje so pode ser descrita como ${content.kicker.toLowerCase()} usando um cracha emprestado.`,
          `${subject} deu ao calendario um rosto estranhamente especifico e espera que todo mundo aceite.`,
          `O dia agora opera sob a autoridade decorativa de ${subject}. Resistir seria puro teatro.`,
        ];
    }
  }

  switch (mood) {
    case 'cheerful':
      return [
        `${subject} håller i taktpinnen idag, vilket faktiskt är en rätt hygglig anledning att lätta lite på axlarna.`,
        `Datumet har överlämnat sig till ${content.kicker.toLowerCase()}, och stämningen mår märkbart bättre av det.`,
        `Om ${subject} får styra dagen är det klokast att svara med fika, generositet och lägre axelparti.`,
        `${subject} ger kalendern precis nog energi för att till och med rutinen ska kännas lite mer förlåtlig.`,
      ];
    case 'formal':
      return [
        `${subject} har tilldelats tillfällig ceremoniell prioritet.`,
        `Dagens operativa läge kan sammanfattas som ${content.kicker.toLowerCase()}.`,
        `${subject} bär tillräcklig symbolisk tyngd för att motivera viss hållningsförändring.`,
        `Datumet fortgår nu under påverkan av ${subject}.`,
      ];
    case 'warm':
      return [
        `${subject} styr datumet idag, och dagen blir sannolikt bättre om den behandlas lite vänligare än vanligt.`,
        `Det finns betydligt hårdare sätt att tillbringa ett datum än under inflytande av ${content.kicker.toLowerCase()}.`,
        `${subject} gör dagen mindre mekanisk och något mer mänsklig.`,
        `Om kalendern nu insisterar på ${subject}, kan vi åtminstone möta det med viss grace.`,
      ];
    case 'chaotic':
      return [
        `${subject} har tydligt tagit kontrollerna och schemat återhämtar sig inte särskilt värdigt.`,
        `Dagens officiella energi är ${content.kicker.toLowerCase()}, vilket förklarar en hel del.`,
        `${subject} driver nu rummet med större självförtroende än de vuxna som råkar vara där.`,
        `Datumet har lutat hårt åt ${subject}, och normalförfarandet får mest stå vid strandlinjen och vinka.`,
      ];
    default:
      return [
        `${subject} har glidit in i datumet och börjat möblera om.`,
        `Dagens atmosfär kan bara beskrivas som ${content.kicker.toLowerCase()} med lånat tjänstekort.`,
        `${subject} ger kalendern ett märkligt specifikt ansikte och förväntar sig att alla accepterar läget.`,
        `Dagen står nu under dekorativ auktoritet från ${subject}. Motstånd vore mest teater.`,
      ];
  }
}

function getCelebrationThemeAliasesSv(dayType: Exclude<DayType, 'ordinary'>): string[] {
  switch (dayType) {
    case 'allahjartansdag':
      return ['Alla hjärtans dag'];
    case 'fettisdag':
      return ['Fettisdagen', 'Semmeldagen'];
    case 'paskafton':
      return ['Påskafton'];
    case 'vaffeldagen':
      return ['Våffeldagen'];
    case 'valborg':
      return ['Valborg', 'Valborgsmässoafton'];
    case 'nationaldagen':
      return ['Nationaldagen', 'Sveriges nationaldag'];
    case 'midsommarafton':
      return ['Midsommarafton'];
    case 'kanelbullensdag':
      return ['Kanelbullens dag'];
    case 'kladdkakansdag':
      return ['Kladdkakans dag'];
    case 'surstrommingspremiar':
      return ['Surströmmingspremiär'];
    case 'lucia':
      return ['Lucia', 'Luciadagen'];
    case 'julafton':
      return ['Julafton'];
    case 'nyarsafton':
      return ['Nyårsafton'];
    case 'kottonsdag':
      return ['Köttonsdag'];
    case 'fisktorsdag':
      return ['Fisktorsdag'];
    case 'marmeladfredag':
      return ['Marmeladfredag'];
    default:
      return [];
  }
}

const celebrationsSv: Record<Exclude<DayType, 'ordinary'>, CelebrationContent> = {
  allahjartansdag: {
    title: 'Alla hjärtans dag, för fan',
    subtitle: 'Minimal frostskada i tonen är fullt tillräckligt.',
    kicker: 'Kontorsromantik',
    blurbs: [
      'Helt rimlig dag för socker, pinsam Teams-flirt och hjärtan i fikarummet.',
      'Sprid lite värme, skriv något snällt och låtsas inte som att du inte också vill ha choklad.',
      'Kärlek i arbetslivet betyder ofta fika, vänlighet och att ingen bokar ett möte klockan 16:30.',
      'Det är dagen då ett halvdant "trevlig helg" byts mot något med två procent mer känsloliv.',
      'Ingen begär stordåd. En blomma, en bulle eller ett hyfsat tonfall räcker längre än vanligt.',
      'Alla hjärtans dag på jobbet är mest en fråga om att vara marginellt mindre kylig än normalt.',
      'Det här är inte romantikens OS. Det är bara en påminnelse om att du kan vara trevlig en stund.',
      'Dagen ställer låga krav: lite socker, lite omtanke och ingen cynism före lunch.',
      'Det är en perfekt dag att svara ovanligt varmt på ett meddelande och sedan känna sig färdig som människa.',
      'Alla hjärtans dag på kontor handlar mest om att låta ironin sitta still i ett mötesblock eller två.',
      'Om någon ställer fram choklad idag så räknas det plötsligt som emotionell intelligens.',
      'Det här är datumet då även den stelaste kollegan får försöka se en aning mänsklig ut.',
      'Dagen är till för lågmäld charm, socker i strategiska mängder och absolut noll passiv aggressivitet.',
    ],
    theme: 'jam',
  },
  fettisdag: {
    title: 'Fettisdag. Nu släpper vi taget.',
    subtitle: 'Bullen har tagit över och HR kan inte stoppa det.',
    kicker: 'Mandelmassa och sammanbrott',
    alt: 'Fettisdag',
    blurbs: [
      'Semlor är tillåtna. Att ta bara en är i praktiken ett karaktärsfel.',
      'Grädde i ansiktet, mandelmassa i själen och produktivitet på glid. Som det ska vara.',
      'Det här är dagen då lunch ersätts av bulle och ingen vågar låtsas att det är märkligt.',
      'Varje kalenderpunkt efter klockan 13 borde egentligen ersättas av semelrelaterad passivitet.',
      'Det finns dagar för disciplin. Fettisdag är inte en av dem.',
      'Mandelmassa är nu en arbetsmiljöfråga och jag tänker inte debattera saken.',
      'Semlan har tagit kommandot. Vi andra får bara följa med och nicka instämmande.',
      'Ingen kommer minnas vad som sades på mötet, men de kommer minnas vem som tog sista semlan.',
      'Det mest professionella du kan göra idag är att acceptera att dagen tillhör bullen.',
      'Fettisdag är en sällsynt dag då överdriven grädde faktiskt stärker verksamheten.',
      'All disciplin som fortfarande existerar idag är ren teater och bör behandlas därefter.',
      'Om någon försöker föreslå fruktfika på Fettisdag ska det dokumenteras som en värderingsavvikelse.',
      'Det är svårt att ta ansvar på allvar när mandelmassan redan tagit över styrningen.',
      'Dagen har bara två realistiska utfall: semla nu eller semla snart.',
    ],
    primaryImage: '/semla-1.webp',
    secondaryImage: '/520321381_10234349504453830_7039877959207209298_n.jpg',
    theme: 'cream',
  },
  paskafton: {
    title: 'Påskafton. Sill, godis och fri disciplin.',
    subtitle: 'Ingen vuxenstyrning överlever ägg och smågodis.',
    kicker: 'Äggdriven vapenvila',
    blurbs: [
      'Påskafton är dagen då ägg, godis och märkliga små fjädrar får bära hela samhällsbygget en stund.',
      'Det här är en högtid för sill, färg och låg ambitionsnivå, vilket faktiskt känns väldigt sunt.',
      'Påskafton låter vuxna människor legitimera godisberg genom att nämna tradition och sedan gå vidare.',
      'Det är fullt rimligt att låta helgen dofta ägg, kaffe och mild social förvirring idag.',
      'Påskafton är kalenderns sätt att säga att struktur är överskattat när choklad och ledighet samarbetar.',
      'Ingen tror på effektivitet här. Det är bara ägg, socker och ett stilla accepterande av läget.',
      'Påskafton är en högtid byggd på att vuxna människor accepterar fjädrar som inredningsstrategi.',
      'Dagen känns som om någon lät godisskålen ta över projektledningen och ärligt talat fungerar det.',
      'Det här är ett datum för långbord, felprioriterad chokladkonsumtion och komplett brist på nykter struktur.',
      'Påskafton gör ingen stark sak av värdighet. Den nöjer sig med sill och sockerchock.',
    ],
    visualBadge: 'Påskläge',
    visualTitle: 'Ägg, fjädrar och taktisk frånvaro',
    visualBody:
      'Det finns dagar med högre stringens. Påskafton nöjer sig med färg, socker och att ingen försöker låta vuxen i onödan.',
    primaryImage: '/images/paskafton.jpg',
    theme: 'gold',
  },
  vaffeldagen: {
    title: 'Våffeldagen har tagit över',
    subtitle: 'Fraset vann över självkontrollen ganska tidigt.',
    kicker: 'Fras före fokus',
    blurbs: [
      'Det är den sortens dag då vispgrädde plötsligt låter som planering.',
      'Frasigt, varmt och helt oförenligt med torra möten. Vackert.',
      'Om någon säger att våfflor bara är dessert så saknar de vision.',
      'Det här är en dag för sylt, grädde och en fullständig brist på skam.',
      'Våffeljärnet har mer ledarskap i sig än många styrgrupper.',
      'Konsistensen är viktigare än KPI:erna just nu, och det får vi bara leva med.',
      'Det knastrar lite, kladdar lite och förbättrar stämningen mer än någon kickoff.',
      'Våffeldagen visar återigen att smör och disciplin inte går att prioritera samtidigt.',
      'Det här är dagen då sylt får större trovärdighet än de flesta statusuppdateringar.',
      'Om våfflorna dyker upp före lunch är det bara ett tecken på starkt operativt omdöme.',
      'Våffeldagen är så tydligt rätt att man nästan blir misstänksam.',
      'Fraset gör mer för arbetsmoralen än ytterligare en pratig strategi-PowerPoint någonsin kunde.',
    ],
    visualBadge: 'Frasläge',
    visualTitle: 'Grädde före gravallvar',
    visualBody:
      'När våffeljärnet väl fått mandatet finns det ingen poäng i att låtsas som att dagen handlar om något annat.',
    primaryImage: '/images/vaffeldagen.jpg',
    theme: 'gold',
  },
  valborg: {
    title: 'Valborg, alltså vår med dåligt omdöme',
    subtitle: 'Brasan är varm. Planeringen är det inte.',
    kicker: 'Sista april',
    blurbs: [
      'Det luktar vår, brasor och ett kollektivt beslut att produktivitet kan vänta till imorgon.',
      'Sista april är till för vårkänslor, tunn jacka i för tidigt väder och ett lätt skamligt schema.',
      'Man jobbar tekniskt sett fortfarande, men själen står redan vid en brasa med kaffe i handen.',
      'Allt efter lunch är mest en logistisk kamp mellan kalendern och vårkänslorna.',
      'Det är en dag då ingen riktigt tror på arbete, men alla fortsätter skriva i Slack som om de gör det.',
      'Brasan kallar, pollen anfaller och ansvarskänslan tappar mark minut för minut.',
      'Valborg är i praktiken ett nationellt medgivande om att april inte kan avslutas nyktert i själen.',
      'Det här är sista april. Schemat finns kvar, men respekten för det är borta.',
      'Valborg är när hela landet kollektivt bestämmer att en brasa är tillräcklig projektplan.',
      'Ingen vuxen människa ser helt rimlig ut på Valborg och det är en del av charmen.',
      'Vårkänslan är stark, omdömet svajigt och det känns märkligt nog helt korrekt.',
      'All logik efter arbetsdagens mitt bör behandlas som rådgivande snarare än bindande.',
    ],
    primaryImage: '/images/valborg.jpg',
    theme: 'ember',
  },
  nationaldagen: {
    title: 'Nationaldagen får väl firas då',
    subtitle: 'Blågul värdighet med tydlig fikapotential.',
    kicker: 'Flagga och fika',
    blurbs: [
      'Lite blått, lite gult och mycket halvhjärtad patriotism över en kopp kaffe.',
      'Det här är dagen då en flagga i hörnet plötsligt räknas som stämning.',
      'Man firar Sverige ungefär som man firar en stabil kollega: lågmält men ändå med viss respekt.',
      'Det är inte den mest vilda högtiden, men den bjuder på flaggor och en rimlig ursäkt att luta sig tillbaka.',
      'Nationaldagen är som landet självt: ganska ordnad, lite stel och bättre med fika.',
      'Alla spelar inte nationalsången, men alla accepterar att tempot får sjunka något.',
      'Dagen kräver inte mycket. Bara lite värdighet, något blågult och ett minimum av gnäll.',
      'Det är en bra dag att uppskatta fungerande kollektivtrafik, skaplig välfärd och kaffebröd.',
      'Nationaldagen är aldrig vild, men den är pålitlig och det är mer svenskt än man först tror.',
      'Det är ett datum som ber om flagga, kaffe och lågmält självförtroende. Inte mer, inte mindre.',
      'Blågult tyg får plötsligt en märkligt hög auktoritet över stämningen idag.',
      'Ingen behöver bli patriotisk på heltid. Det räcker att vara tillfälligt välvillig mot landet en stund.',
    ],
    primaryImage: '/images/nationaldagen.jpg',
    theme: 'forest',
  },
  midsommarafton: {
    title: 'Midsommarafton. Ingen jobbar på riktigt.',
    subtitle: 'Autosvaret är mentalt aktiverat redan före lunch.',
    kicker: 'Sill-driven frånvaro',
    blurbs: [
      'Allt efter lunch är kosmetika. Alla vet det. Ingen säger det högt.',
      'Det här är fredagen då autosvaret i själen aktiveras långt innan datorn stängs.',
      'Sill, jordgubbar och en kalender fylld av lögner om tillgänglighet. Svensk perfektion.',
      'Det finns ingen meningsfull produktivitet kvar här. Bara blomsterkransar i mentalt förstadium.',
      'Midsommarafton är dagen då till och med tangentbordet vill stänga ner tidigt.',
      'Excel är formellt öppet, men nationen är redan ute på gräsmattan.',
      'Man kan kalla det arbetsdag om man vill, men det blir inte sant för det.',
      'Sillen är planerad, jordgubbarna kylda och samtliga ambitioner parkerade.',
      'Den enda realistiska leveransen idag är att folk tar sig ut genom dörren i tid.',
      'Midsommarafton har samma relation till arbete som regn har till pappersdekorationer: formellt möjlig, praktiskt hopplös.',
      'Det här är dagen då kalendrar hålls öppna av ren vidskepelse.',
      'Ingen vill vara den som låtsas vara tillgänglig efter lunch och faktiskt menar det.',
      'Samhället fortsätter tekniskt sett, men allt viktigt står redan i en kylväska någonstans.',
    ],
    primaryImage: '/images/midsommarafton.jpg',
    theme: 'forest',
  },
  kanelbullensdag: {
    title: 'Kanelbullens dag bär upp nationen',
    subtitle: 'Kardemumma, skuld och kollegial press i fin balans.',
    kicker: 'Fika som plikt',
    blurbs: [
      'Det mest kontorskompatibla firandet Sverige någonsin uppfunnit. Fika är i princip tvingande.',
      'Låt ingen lura dig: kanelbullen är inte ett bakverk idag, den är ett ansvar.',
      'Den som dyker upp utan bulle idag får leva med blickarna. Hårt men rättvist.',
      'Det här är arbetslivets högsta liturgi: kaffe, bulle, smulor i tangentbordet.',
      'Om det finns en svensk statsreligion så luktar den kardemumma idag.',
      'Kanelbullens dag förenar folket genom smör, socker och diskret moralisk press.',
      'Det finns inget starkare verksamhetsstöd än en ljummen bulle på rätt sida lunch.',
      'Ingen vill vara personen som "inte är så mycket för bullar" idag. Det vore socialt självmord.',
      'Dagen mäts inte i timmar utan i antal bullar som mystiskt försvinner från köket.',
      'Kanelbullens dag är den enda högtid där smulor i tangentbordet känns som patriotisk plikt.',
      'Man behöver inte ens vara hungrig. Det räcker att förstå läget och ta en bulle ändå.',
      'Det finns få starkare sociala signaler än att dyka upp med nybakta bullar just idag.',
      'Kanelbullens dag gör hela landet lite mjukare i kanterna och märkbart mer smörbaserat.',
    ],
    primaryImage: '/images/kanelbullensdag.jpg',
    theme: 'gold',
  },
  kladdkakansdag: {
    title: 'Kladdkakans dag, som strukturen hatar',
    subtitle: 'Mitten ska ge upp. Det är hela poängen.',
    kicker: 'Klibbigt men rätt',
    blurbs: [
      'Om någon tar med torr kaka idag får de faktiskt skämmas lite.',
      'Kladdkakan är ett bevis på att struktur inte alltid är det högsta goda.',
      'Det ska vara kladdigt, lite för mycket grädde och noll självhat. Punkt.',
      'En fast kaka idag vore ett karaktärsmisslyckande och möjligen en HR-fråga.',
      'Kladdkakans dag är ett argument mot perfektionism serverat med vispgrädde.',
      'Mitten ska ge upp. Kanterna ska bara hålla ihop det hela precis tillräckligt. Som vi andra.',
      'Det här är dagen då undergräddat blir en dygd och ingen orkar låtsas något annat.',
      'Kakan ska vara kladdig, portionsstorleken orimlig och skuldkänslan uppskjuten.',
      'Kladdkakans dag bevisar ännu en gång att kontroll är överskattat när choklad får tala fritt.',
      'Om kakan håller formen för bra har någon missförstått uppdraget på en nästan filosofisk nivå.',
      'Det här är efterrättens motsvarighet till att säga "good enough" med full övertygelse.',
      'Kladdkakan har den sällsynta egenskapen att bli bättre ju mindre disciplin som lagts i slutet.',
    ],
    primaryImage: '/images/kladdkakansdag.jpg',
    theme: 'jam',
  },
  surstrommingspremiar: {
    title: 'Surströmmingspremiär. Beklagar.',
    subtitle: 'Ventilationen får bära mer ansvar än vanligt.',
    kicker: 'Tredje torsdagen i augusti',
    blurbs: [
      'Det här är traditionen som luktar mer beslutsamhet än god smak.',
      'Någonstans öppnas en burk och arbetsmoralen tar fysisk skada.',
      'Surströmming är vad som händer när kulturarv vägrar ta emot kritik.',
      'Det är en dag då ventilation plötsligt blir samhällsbärande infrastruktur.',
      'Ingen tycker att lukten är bra. Vissa tycker bara att plikten är större.',
      'Surströmmingspremiären är ett lackmustest för vänskaper, verandor och närliggande grannar.',
      'Det här firandet bygger på tre saker: tradition, envishet och en helt orimlig lukttröskel.',
      'Man behöver inte förstå det. Det räcker att acceptera att någon i landet öppnar en burk med avsikt.',
      'Dagen luktar kraftigt av historia, salt och människans förmåga att romantisera dåliga idéer.',
      'Surströmmingspremiären är ett slags nationell övning i att försvara det oförsvarliga med rak rygg.',
      'Det här är datumet då "det är en förvärvad smak" får arbeta så hårt att det nästan kollapsar.',
      'Ingen öppnar en burk surströmming av misstag. Det är alltid en viljehandling och ofta en varning.',
      'Traditionen är så stark att lukten tydligen fått finna sig i att vara sekundär information.',
    ],
    primaryImage: '/images/surstrommingspremiar.jpg',
    theme: 'midnight',
  },
  lucia: {
    title: 'Lucia i kontorsbelysningens skärseld',
    subtitle: 'Saffran, sömnbrist och starkt behov av kaffe.',
    kicker: 'Saffran mot mörker',
    blurbs: [
      'Pepparkakor, kaffe och ett svagt morgonmörker som ingen bad om men alla känner igen.',
      'Det är dagen då levande ljus känns som arbetsmiljöåtgärd snarare än stämning.',
      'Lite saffran, lite sömnbrist och ett desperat hopp om att julledigheten snart är här.',
      'Lucia är mörkrets sista gaslighting innan julen tar över helt.',
      'Det bjuds på lussekatter, stilla sång och ett kollektivt behov av koffein.',
      'Alla spelar lugna och andaktsfulla tills någon ställer fram kaffe och hela kontoret vaknar till liv.',
      'Det är inte bara en tradition. Det är ett sätt att överleva december med något slags värdighet.',
      'Ljusen fladdrar, saffranet jobbar och mörkret får tillfälligt backa undan.',
      'Lucia är den enda morgonen på året då folk accepterar stearin som strategi.',
      'Det här är en högtid där sång, saffran och sömnbrist bildar en ovanligt stabil allians.',
      'Kontoret känns märkligt vördnadsfullt fram till första kaffetermosen öppnas och allt blir normalt igen.',
      'Lucia gör december mindre brutal i exakt den utsträckning som kaffe och bakverk tillåter.',
    ],
    primaryImage: '/images/lucia.jpg',
    theme: 'cream',
  },
  julafton: {
    title: 'Julafton. Nu spelar ingen normal längre.',
    subtitle: 'Traditioner, stress och glögglogik i perfekt oreda.',
    kicker: 'Kalle, kaffe och kollektiv regression',
    blurbs: [
      'Julafton är den sorts dag där tidtabellerna ersätts av glögglogik och ingen har kraft att invända.',
      'Det är fullt normalt att hela dagen styrs av kaffe, julbord och exakt när någon tycker att Kalle måste börja.',
      'Julafton förvandlar annars sansade människor till traditionsoperatörer med starka åsikter om skinka och stearin.',
      'Det här är datumet då soffor, paketpapper och lätt spänd släktsamverkan bär nationen.',
      'Julafton fungerar eftersom alla accepterar att logik, punktlighet och självinsikt får ta ledigt.',
      'Man kan kalla det högtid. Man kan också kalla det ett välorganiserat sammanbrott med saffran i periferin.',
      'Inget är särskilt effektivt, men allt är mycket laddat, vilket i praktiken räcker som juldefinition.',
      'Julafton är när schemat ersätts av traditioner som ingen riktigt minns ursprunget till men alla ändå fruktar att bryta.',
      'Det finns inte en enda lugn människa på Julafton, bara olika grader av välklädd stress.',
      'Det här är datumet då kaffe, kökslogistik och släktdiplomati får bära hela samhällskontraktet.',
      'Julen fungerar genom en blandning av nostalgi, socker och människor som bestämt sig för att inte kommentera allt de tänker.',
    ],
    primaryImage: carltonChristmasGif,
    visualBadge: 'Juldrift',
    visualTitle: 'Soffläge med hög symbolisk densitet',
    visualBody:
      'Julafton behöver inte bilder för att kännas full. Den är redan överbelamrad av ritualer, dofter och människor som försöker bete sig rimligt.',
    theme: 'cream',
  },
  nyarsafton: {
    title: 'Nyårsafton. Ambition möter fyrverkerier.',
    subtitle: 'Övertro, bubbel och ett dyrt förhållande till midnatt.',
    kicker: 'Tolvslaget som projekt',
    blurbs: [
      'Nyårsafton är den årliga ritualen där folk låtsas att tolvslaget automatiskt förbättrar karaktären.',
      'Det här är kvällen då bubbel, löften och lätt överskattad framtidstro ska samsas i samma rum.',
      'Nyårsafton fungerar bäst om ingen ställer för många frågor om planering, skor eller morgondagen.',
      'Allt kulminerar i några minuter av ljud, ljus och kollektivt beslut att nästa år nog ändå blir bättre.',
      'Nyårsafton är kalenderns dyraste sätt att säga att tiden går vidare oavsett om du är redo.',
      'Man ska helst vara festlig, hoppfull och aningen frusen på samma gång. Ett märkligt men etablerat upplägg.',
      'Nyårsafton är kvällen då alla låtsas att bubbel automatiskt förvandlar osäkerhet till vision.',
      'Det här är ett datum som kräver nedräkning, övertro och skor som ingen egentligen kan stå i.',
      'Man får gärna kalla det nystart. Kalendern kommer ändå märka att du är samma person imorgon.',
      'Nyårsafton lever på kombinationen av dyra ambitioner och mycket korta fyrverkerier.',
    ],
    visualBadge: 'Tolvslag',
    visualTitle: 'Glitter, löften och kontrollerad övertro',
    visualBody:
      'Nyårsafton bär sin egen scenografi. Det enda som egentligen krävs är att någon räknar ner och att ingen tappar fattningen för tidigt.',
    primaryImage: '/images/nyarsafton.jpg',
    theme: 'midnight',
  },
  kottonsdag: {
    title: 'Köttonsdag',
    subtitle: 'Inga frågor. Bara protein och avstängd finess.',
    kicker: 'Protein mot veckan',
    alt: 'Köttonsdag',
    blurbs: [
      'Mitt-i-veckan-köttrus. Fint blir det inte, men det blir något.',
      'Onsdagen kräver protein, trots och ett minimum av finkänslighet.',
      'Det här är inte elegant. Det är bara rejält, och ibland räcker det långt.',
      'Veckan har tappat finessen nu. Det som återstår är kött och ren uthållighet.',
      'Köttonsdag är ingen filosofi. Det är ett tillstånd man går in i för att överleva onsdagen.',
      'Ingen bad om grace. Det här handlar om energi, salt och ett stumt accepterande av läget.',
      'Mittveckan måste mötas med något robust. Idag blev svaret uppenbarligen kött.',
      'Det är rakt, flottigt och funktionellt. Så ungefär som en kompetent onsdag borde vara.',
      'Kött är kanske inte lösningen på allt, men det är lösningen på just den här dagen.',
      'Det här är onsdagens sätt att säga att sallad var en naiv idé från början.',
      'Köttonsdag har aldrig påstått sig vara nyanserad och just därför inger den viss trygghet.',
      'Mitt i veckan behövs något som tuggar tillbaka. Idag blev det tydligen kött.',
      'Köttonsdag får allt annat på tallriken att framstå som dekorativt sidomaterial.',
      'Det här är inte en dag för milda beslut eller luftiga proteinkällor.',
      'Onsdagen har slutat be om ursäkt och börjat beställa mer stekyta.',
      'Mittveckan känns mindre som en idé och mer som en grillpanna idag.',
      'Det enda raffinerade med Köttonsdag är hur lite den försöker vara raffinerad.',
    ],
    primaryImage: '/meatwednesday.gif',
    theme: 'ember',
  },
  fisktorsdag: {
    title: 'Fisktorsdag',
    subtitle: 'Håller ihop civilisationen med dill och institutionell envishet.',
    kicker: 'Rutinen segrar igen',
    alt: 'Fisktorsdag',
    blurbs: [
      'Torsdagar vill tydligen smaka skolmatsal och tradition. Man får respektera hantverket.',
      'Fisk idag. Förnuft imorgon. Så har nationer hållits ihop i århundraden.',
      'Det är lite citron, lite dill och väldigt mycket kollektivt accepterad rutin.',
      'Det finns något tryggt i att torsdagen fortfarande tror på fisk som samhällsmodell.',
      'Fisktorsdag är traditionens sätt att säga att variation är överskattat.',
      'Man kan protestera, men innerst inne vet alla att torsdagen redan bestämt menyn.',
      'Det luktar lite hav, lite skolminne och ganska mycket svensk vardagsstruktur.',
      'Fisk är kanske inte sexigt, men det är pålitligt, och torsdagar uppskattar det.',
      'Torsdagen vill inte överraska. Den vill servera fisk och gå vidare med livet.',
      'Fisktorsdag är inte här för att imponera. Den är här för att skapa ordning med hjälp av torsk.',
      'Det här är dagen då panering och samhällskontrakt plötsligt känns som nära släktingar.',
      'Fisk på torsdag är inte innovation. Det är infrastruktur.',
      'Torsdagen litar mer på panerad fisk än på de flesta moderna idéer och man får nästan respektera det.',
      'Det här är svensk vardag i sin renaste form: lite blek, lite salt och märkligt trygg.',
      'Fisktorsdag bär upp veckan genom att aldrig låtsas vara roligare än den är.',
      'Det finns en särskild sorts stabilitet i att torsdagen fortfarande tycker att fisk löser mycket.',
      'Citronklyftan står där som om den faktiskt tänker göra hela upplägget elegant. Modigt.',
    ],
    primaryImage: '/fisktorsdag-fixed-composite.png',
    theme: 'midnight',
  },
  marmeladfredag: {
    title: 'Marmeladfredag',
    subtitle: 'Veckan gav upp först, men sötman håller masken.',
    kicker: 'Socker med värdighet',
    alt: 'Carlton',
    blurbs: [
      'Veckan är över. Nu återstår bara att låtsas vara klar med allt.',
      'Fredagen bärs av socker, lätt panik och ett professionellt tonfall i sista stund.',
      'Det är dags att stänga datorn med värdighet och öppna helgen med marmelad i blicken.',
      'Allt som inte blev klart får nu omvandlas till något som låter avslutat i chatten.',
      'Marmeladfredag är kulören på den tunna linjen mellan ansvar och flykt.',
      'Det här är fredagen då man summerar veckan med sött på utsidan och kaos på insidan.',
      'Helgen står i dörren. Datorn surrar. Marmeladen viskar att det nog löser sig på måndag.',
      'Du behöver inte vara klar. Du behöver bara se ut som någon som snart är klar.',
      'Det finns en sorts fredagsvärdighet som bara uppstår när man ger upp med stil.',
      'Nu gäller det att avrunda veckan med samma energi som en sliten men välfungerande efterrätt.',
      'Marmeladfredag är när professionalismen kommer till jobbet med kladdig skjorta och ändå klarar sig.',
      'Allt är lite för sött, lite för sent och precis tillräckligt övertygande för att bära en fredag.',
      'Veckan dog inte heroisk. Den dog klibbig och med god ton.',
      'Marmeladfredag är fredagens sätt att be om nåd med sockret redan framdukat.',
      'Det här är dagen då du får runda av veckan med samma integritet som en halvöppen syltburk.',
      'Allt som återstår nu är att låta sött språkbruk dölja hur lite som faktiskt blev klart.',
      'Fredagen vill bli avslutad med stil men får nöja sig med marmelad och rimlig ton.',
      'Marmeladfredag är när helgen syns i dörren och samvetet försöker hålla ihop med hjälp av socker.',
    ],
    primaryImage: carltonGif,
    theme: 'jam',
  },
};

const celebrationsEnLocalized = Object.fromEntries(
  (Object.keys(celebrationsSv) as Array<Exclude<DayType, 'ordinary'>>).map((dayType) => [
    dayType,
    {
      ...celebrationsSv[dayType],
      ...englishCelebrationContent.celebrations[dayType],
      primaryImage: celebrationsSv[dayType].primaryImage,
      secondaryImage: celebrationsSv[dayType].secondaryImage,
      theme: celebrationsSv[dayType].theme,
    },
  ])
) as Record<Exclude<DayType, 'ordinary'>, CelebrationContent>;

const celebrationsPtBrLocalized = Object.fromEntries(
  (Object.keys(celebrationsSv) as Array<Exclude<DayType, 'ordinary'>>).map((dayType) => [
    dayType,
    {
      ...celebrationsSv[dayType],
      ...portugueseCelebrationContent.celebrations[dayType],
      primaryImage: celebrationsSv[dayType].primaryImage,
      secondaryImage: celebrationsSv[dayType].secondaryImage,
      theme: celebrationsSv[dayType].theme,
    },
  ])
) as Record<Exclude<DayType, 'ordinary'>, CelebrationContent>;

function splitCelebrationsByPack<T extends Record<Exclude<DayType, 'ordinary'>, unknown>>(
  celebrations: T
): {
  shared: Omit<T, TeamWeekdayDayType>;
  teamOnly: Pick<T, TeamWeekdayDayType>;
} {
  const entries = Object.entries(celebrations) as Array<[Exclude<DayType, 'ordinary'>, T[keyof T]]>;
  const sharedEntries = entries.filter(([dayType]) => !isTeamWeekdayDayType(dayType));
  const teamEntries = entries.filter(([dayType]) => isTeamWeekdayDayType(dayType));

  return {
    shared: Object.fromEntries(sharedEntries) as Omit<T, TeamWeekdayDayType>,
    teamOnly: Object.fromEntries(teamEntries) as Pick<T, TeamWeekdayDayType>,
  };
}

const celebrationAliasesSv = Object.fromEntries(
  (
    Object.keys(celebrationsSv) as Array<Exclude<DayType, 'ordinary'>>
  ).map((dayType) => [dayType, getCelebrationThemeAliasesSv(dayType)])
) as Record<Exclude<DayType, 'ordinary'>, string[]>;

const { shared: sharedCelebrationsSv, teamOnly: teamCelebrationsSv } =
  splitCelebrationsByPack(celebrationsSv);
const { shared: sharedCelebrationsEn, teamOnly: teamCelebrationsEn } =
  splitCelebrationsByPack(celebrationsEnLocalized);
const { shared: sharedCelebrationsPtBr, teamOnly: teamCelebrationsPtBr } =
  splitCelebrationsByPack(celebrationsPtBrLocalized);
const { shared: sharedAliasesSv, teamOnly: teamAliasesSv } =
  splitCelebrationsByPack(celebrationAliasesSv);
const { shared: sharedAliasesEn, teamOnly: teamAliasesEn } =
  splitCelebrationsByPack(englishCelebrationContent.celebrationThemeAliases);
const { shared: sharedAliasesPtBr, teamOnly: teamAliasesPtBr } =
  splitCelebrationsByPack(portugueseCelebrationContent.celebrationThemeAliases);

export function getOrdinaryBlurb(locale: Locale, mood: Mood = 'dry'): string {
  const moodSpecific = getMoodOrdinaryBlurb(locale, mood);
  if (moodSpecific) {
    return moodSpecific;
  }

  if (locale === 'en') {
    return englishCelebrationContent.ordinaryBlurb;
  }

  if (locale === 'pt-BR') {
    return portugueseCelebrationContent.ordinaryBlurb;
  }

  return ordinaryBlurbSv;
}

export function getOrdinaryDayBlurbs(
  locale: Locale,
  isWeekend: boolean,
  mood: Mood = 'dry'
): string[] {
  const moodSpecific = getMoodOrdinaryDayBlurbs(locale, isWeekend, mood);
  if (moodSpecific) {
    return moodSpecific;
  }

  if (locale === 'en') {
    return isWeekend
      ? englishCelebrationContent.ordinaryWeekendBlurbs
      : englishCelebrationContent.ordinaryWeekdayBlurbs;
  }

  if (locale === 'pt-BR') {
    return isWeekend
      ? portugueseCelebrationContent.ordinaryWeekendBlurbs
      : portugueseCelebrationContent.ordinaryWeekdayBlurbs;
  }

  return isWeekend ? ordinaryWeekendBlurbsSv : ordinaryWeekdayBlurbsSv;
}

export function getCelebrationThemeAliases(
  dayType: Exclude<DayType, 'ordinary'>,
  locale: Locale = 'sv',
  contentPack: ContentPack = getActiveContentPack()
): string[] {
  if (isTeamWeekdayDayType(dayType) && contentPack !== 'team') {
    return [];
  }

  const aliases = (
    locale === 'en'
      ? contentPack === 'team'
        ? { ...sharedAliasesEn, ...teamAliasesEn }
        : sharedAliasesEn
      : locale === 'pt-BR'
        ? contentPack === 'team'
          ? { ...sharedAliasesPtBr, ...teamAliasesPtBr }
          : sharedAliasesPtBr
        : contentPack === 'team'
          ? { ...sharedAliasesSv, ...teamAliasesSv }
          : sharedAliasesSv
  ) as Partial<Record<Exclude<DayType, 'ordinary'>, string[]>>;

  return aliases[dayType] ?? [];
}

export function getCelebrations(
  locale: Locale,
  contentPack: ContentPack = getActiveContentPack(),
  mood: Mood = 'dry'
): Record<Exclude<DayType, 'ordinary'>, CelebrationContent> {
  const base = (() => {
  if (locale === 'en') {
    return (contentPack === 'team'
      ? { ...sharedCelebrationsEn, ...teamCelebrationsEn }
      : sharedCelebrationsEn) as Record<Exclude<DayType, 'ordinary'>, CelebrationContent>;
  }

  if (locale === 'pt-BR') {
    return (contentPack === 'team'
      ? { ...sharedCelebrationsPtBr, ...teamCelebrationsPtBr }
      : sharedCelebrationsPtBr) as Record<Exclude<DayType, 'ordinary'>, CelebrationContent>;
  }

  return (contentPack === 'team'
    ? { ...sharedCelebrationsSv, ...teamCelebrationsSv }
    : sharedCelebrationsSv) as Record<Exclude<DayType, 'ordinary'>, CelebrationContent>;
  })();

  if (mood === 'dry') {
    return base;
  }

  return Object.fromEntries(
    Object.entries(base).map(([dayType, content]) => [
      dayType,
      {
        ...content,
        blurbs: getMoodCelebrationBlurbs(content, locale, mood) ?? content.blurbs,
      },
    ])
  ) as Record<Exclude<DayType, 'ordinary'>, CelebrationContent>;
}
