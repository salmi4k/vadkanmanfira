import carltonGif from './gifs/carlton.gif';
import { DayType } from './dayLogic';
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
  kicker: string;
  alt?: string;
  blurbs: string[];
  primaryImage?: string;
  secondaryImage?: string;
  theme: CelebrationTheme;
};
export const ordinaryBlurb =
  'Nej, idag är det inte någon svensk firardag som platsar här.';

export const ordinaryWeekdayBlurbs = [
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
];

export function getCelebrationThemeAliases(dayType: Exclude<DayType, 'ordinary'>): string[] {
  switch (dayType) {
    case 'allahjartansdag':
      return ['Alla hjärtans dag'];
    case 'fettisdag':
      return ['Fettisdagen', 'Semmeldagen'];
    case 'vaffeldagen':
      return ['Våffeldagen'];
    case 'valborg':
      return ['Valborg', 'Valborgsmässoafton'];
    case 'nationaldagen':
      return ['Nationaldagen'];
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

export const celebrations: Record<Exclude<DayType, 'ordinary'>, CelebrationContent> = {
  allahjartansdag: {
    title: 'Alla hjärtans dag, för fan',
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
    ],
    theme: 'jam',
  },
  fettisdag: {
    title: 'Fettisdag. Nu släpper vi taget.',
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
    ],
    primaryImage: '/semla-1.webp',
    secondaryImage: '/520321381_10234349504453830_7039877959207209298_n.jpg',
    theme: 'cream',
  },
  vaffeldagen: {
    title: 'Våffeldagen har tagit över',
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
    ],
    theme: 'gold',
  },
  valborg: {
    title: 'Valborg, alltså vår med dåligt omdöme',
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
    ],
    theme: 'ember',
  },
  nationaldagen: {
    title: 'Nationaldagen får väl firas då',
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
    ],
    theme: 'forest',
  },
  midsommarafton: {
    title: 'Midsommarafton. Ingen jobbar på riktigt.',
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
    ],
    theme: 'forest',
  },
  kanelbullensdag: {
    title: 'Kanelbullens dag bär upp nationen',
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
    ],
    theme: 'gold',
  },
  kladdkakansdag: {
    title: 'Kladdkakans dag, som strukturen hatar',
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
    ],
    theme: 'jam',
  },
  surstrommingspremiar: {
    title: 'Surströmmingspremiär. Beklagar.',
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
    ],
    theme: 'midnight',
  },
  lucia: {
    title: 'Lucia i kontorsbelysningens skärseld',
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
    ],
    theme: 'cream',
  },
  kottonsdag: {
    title: 'Köttonsdag. Inga frågor.',
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
    ],
    primaryImage: '/meatwednesday.gif',
    theme: 'ember',
  },
  fisktorsdag: {
    title: 'Fisktorsdag håller ihop civilisationen',
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
    ],
    primaryImage: '/fisktorsdag.gif',
    theme: 'midnight',
  },
  marmeladfredag: {
    title: 'Marmeladfredag. Veckan gav upp först.',
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
    ],
    primaryImage: carltonGif,
    theme: 'jam',
  },
};
