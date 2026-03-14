import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import carltonGif from './gifs/carlton.gif';
import mojoLogo from './mojo-logo.png';
import { DayType, getDayStatus, getUpcomingOfficialHolidayInWeek } from './dayLogic';
import { getThemeDaysForDate } from './temadagar';

type AppProps = {
  initialDate?: Date;
};

type CelebrationTheme =
  | 'ordinary'
  | 'jam'
  | 'cream'
  | 'forest'
  | 'ember'
  | 'gold'
  | 'midnight';

type CelebrationContent = {
  title: string;
  kicker: string;
  alt?: string;
  blurbs: string[];
  primaryImage?: string;
  secondaryImage?: string;
  theme: CelebrationTheme;
};

type NameDayState = 'loading' | 'ready' | 'error';

interface SholidayResponse {
  dagar?: Array<{
    namnsdag?: string[];
  }>;
}

const ordinaryBlurb =
  'Nej, idag är det inte någon svensk firardag som platsar här.';

const ordinaryWeekdayBlurbs = [
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

function formatForInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatForHumans(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatShortSwedishDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function getRandomItem(options: string[]): string {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

function joinWithAnd(items: string[]): string {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  if (items.length === 2) {
    return `${items[0]} och ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')} och ${items[items.length - 1]}`;
}

function formatTitle(title: string): string {
  return title.replaceAll('. ', '.\n');
}

function hasOrdinaryWeekdayExcuses(date: Date, dayType: DayType): boolean {
  if (dayType !== 'ordinary') {
    return false;
  }

  const weekday = date.getDay();
  return weekday >= 1 && weekday <= 5;
}

function normalizeLabel(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function includesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function getCelebrationThemeAliases(dayType: Exclude<DayType, 'ordinary'>): string[] {
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

function getThemeDaySpecificBlurbs(themeDay: string): string[] | null {
  const normalized = normalizeLabel(themeDay);
  const overrides: Array<[string, string[]]> = [
    [
      'matladans dag',
      [
        'Matlådans dag är i praktiken ett erkännande av kall disciplin i plastform.',
        'Det är dagen då gårdagens rester plötsligt får projektledarstatus.',
        'Matlådans dag påminner oss om att den mest stabila kollegan ofta luktar mikrad pasta.',
      ],
    ],
    [
      'internationella pizzadagen',
      [
        'Internationella pizzadagen kräver exakt noll självbehärskning och det känns väldigt rimligt.',
        'Pizzan har tagit över kommandokedjan idag. Motstånd vore bara teater.',
        'Det här är datumet då trianglar av smält ost får högre legitimitet än planering.',
      ],
    ],
    [
      'temadagens dag',
      [
        'Temadagens dag är metasamhällets sätt att applådera sin egen kalenderneuros.',
        'Vi firar alltså temadagar genom att fira temadagen som firar temadagar. Fullt normalt.',
        'Det här är dagen då kalendern tittar på sig själv i spegeln och nickar nöjt.',
      ],
    ],
    [
      'bussforarens dag',
      [
        'Bussförarens dag känns som ett rimligt tillfälle att visa respekt för folk som håller ihop morgonen åt andra.',
        'Utan bussföraren kollapsar logistiken långt före lunch, så lite vördnad är på sin plats.',
        'Det här är dagen då kollektivtrafikens tålamod borde belönas med bättre kaffe och färre idioter.',
      ],
    ],
    [
      'kvanfolkets dag',
      [
        'Kvänfolkets dag förtjänar bättre än att passera som ännu en anonym punkt i kalendern.',
        'Det är Kvänfolkets dag idag, alltså en utmärkt dag att visa lite respekt för kultur som överlevt trots omvärldens tröghet.',
        'Kvänfolkets dag påminner stillsamt om att historia inte bara tillhör majoriteten och de högljudda.',
      ],
    ],
    [
      'nordens dag',
      [
        'Nordens dag är i grunden ett hövligt sätt att fira mörker, välfärd och fungerande ytterkläder.',
        'Det är Nordens dag idag, vilket känns som rätt tillfälle att uppskatta grannländer med liknande problem men bättre dialekter.',
        'Nordens dag ger kalendern en lätt doft av gran, samförstånd och administrativ kompetens.',
      ],
    ],
    [
      'matematikens dag',
      [
        'Matematikens dag är till för folk som blir uppriktigt glada av struktur, bevisföring och ett snyggt resonemang.',
        'Det är Matematikens dag idag, alltså ett utmärkt tillfälle att låtsas att siffror också har personlighet.',
        'Matematikens dag ger kalendern en ovanligt stram hållning, vilket faktiskt klär den.',
      ],
    ],
    [
      'pi-dagen',
      [
        'Pi-dagen är den sortens nördhögtid som lyckas vara både larvig och märkligt elegant på samma gång.',
        'Det är Pi-dagen idag, vilket betyder att någon redan gjort ett skämt om cirklar och känt sig nöjd.',
        'Pi-dagen visar att människor kan bygga traditioner av decimaler om de bara vill tillräckligt mycket.',
      ],
    ],
    [
      'moldagen',
      [
        'Moldagen känns som en högtid skapad av kemister som vägrade acceptera att normal social status var nog.',
        'Det är Moldagen idag, vilket innebär att någon just nu säger Avogadro med större självkänsla än nödvändigt.',
        'Moldagen ger datumet en tydlig doft av labb, precision och väldigt riktad entusiasm.',
      ],
    ],
    [
      'varldsdagen for introverta',
      [
        'Världsdagen för introverta känns som den enda temadagen som helst hade sluppit uppmärksamhet.',
        'Det är Världsdagen för introverta idag, så håll tonen låg och mötesinbjudningarna ännu lägre.',
        'Världsdagen för introverta firas rimligen bäst genom att folk låter varandra vara i fred.',
      ],
    ],
    [
      'internationella jrr tolkien-dagen',
      [
        'Internationella JRR Tolkien-dagen är till för folk som tycker att kartor, alver och fotnoter borde få styra mer av samhället.',
        'Det är Tolkien-dag idag, vilket betyder att någon med full värdighet just sa "det räknas inte som lång bok".',
        'Internationella JRR Tolkien-dagen ger datumet en lätt doft av pipeweed, språkbygge och väldigt engagerad nördighet.',
      ],
    ],
    [
      'punktskriftens dag',
      [
        'Punktskriftens dag är faktiskt en dag med både substans och värdighet, vilket kalendern inte alltid kan skryta med.',
        'Det är Punktskriftens dag idag, alltså en påminnelse om att läsbarhet är större än folk med perfekt syn.',
        'Punktskriftens dag gör datumet mindre tramsigt och betydligt mer berättigat än vanligt.',
      ],
    ],
    [
      'mazarinens dag',
      [
        'Mazarinens dag känns som ett mycket svenskt sätt att ge mandelmassa diplomatisk immunitet.',
        'Det är Mazarinens dag idag, vilket betyder att små glansiga bakverk plötsligt fått statsbärande status.',
        'Mazarinens dag ger datumet exakt den sorts dammig konditorivärdighet man inte visste att man saknade.',
      ],
    ],
    [
      'hallongrottans dag',
      [
        'Hallongrottans dag är ett starkt argument för att småkakor bör få mer makt än de har idag.',
        'Det är Hallongrottans dag idag, alltså en dag för sylt i mitten och självrespekt i botten.',
        'Hallongrottans dag påminner om att svensk finkultur ibland bara är smulig deg med aggressivt god fyllning.',
      ],
    ],
    [
      'internationella gladjedagen',
      [
        'Internationella glädjedagen är lite väl direkt i sin ambition, men man får väl uppskatta försöket.',
        'Det är Internationella glädjedagen idag, så cynismen får åtminstone klä sig lite snyggare än vanligt.',
        'Internationella glädjedagen kräver inte extas. Ett märkbart förbättrat humör räcker långt.',
      ],
    ],
    [
      'kennethdagen',
      [
        'Kennethdagen är så specifik att det nästan vore oförskämt att inte respektera den.',
        'Det är Kennethdagen idag, vilket antyder att någon Kenneth en gång hade ett väldigt bra år.',
        'Kennethdagen ger kalendern en märkligt kommunal men ändå hemtrevlig energi.',
      ],
    ],
    [
      'tolkien reading day',
      [
        'Tolkien reading day är vad som händer när bokläsning får samma religiösa allvar som sport.',
        'Det är Tolkien reading day idag, alltså ännu en anledning att kalla återläsning för kulturarbete.',
        'Tolkien reading day påminner om att vissa människor aldrig riktigt lämnat Midgård, och ärligt talat bra för dem.',
      ],
    ],
    [
      'surdegsdagen',
      [
        'Surdegsdagen är till för folk som tycker att bakning blir bättre ju mer den liknar ett långt forskningsprojekt.',
        'Det är Surdegsdagen idag, så någon står redan och pratar om bubblor med överdriven auktoritet.',
        'Surdegsdagen ger dagen en lätt hotfull doft av mjöl, disciplin och självbelåten skorpa.',
      ],
    ],
    [
      'lakritsdagen',
      [
        'Lakritsdagen är den årliga påminnelsen om att Sverige kollektivt accepterat en mycket märklig smakprofil.',
        'Det är Lakritsdagen idag, vilket skiljer folket i två läger: de upplysta och de svaga.',
        'Lakritsdagen fungerar ungefär som all riktig övertygelse: starkt, salt och helt omöjlig att diskutera sansat.',
      ],
    ],
    [
      'sapbubblans dag',
      [
        'Såpbubblans dag är ett ovanligt elegant sätt att säga att dagens allvar är tillfälligt avstängt.',
        'Det är Såpbubblans dag idag, alltså full legitimitet för lättsinne med dålig hållbarhet.',
        'Såpbubblans dag gör världen lite dummare men betydligt trevligare för en stund.',
      ],
    ],
    [
      'polkagrisens dag',
      [
        'Polkagrisens dag känns som ett välordnat sockerangrepp i rödvitrandig form.',
        'Det är Polkagrisens dag idag, alltså ett utmärkt tillfälle att låtsas att pepparmint är personlighet.',
        'Polkagrisens dag ger datumet en märkligt strikt och samtidigt fullständigt barnslig charm.',
      ],
    ],
    [
      'varldsbokdagen',
      [
        'Världsbokdagen är en av få dagar där civilisation faktiskt känns som ett rimligt projekt.',
        'Det är Världsbokdagen idag, vilket åtminstone tillfälligt gör folk som läser till samhällets bästa människor.',
        'Världsbokdagen ger kalendern mer tyngd än nästan allt annat här, inklusive våra egna dumheter.',
      ],
    ],
    [
      'varldsskrattdagen',
      [
        'Världsskrattdagen är ett ganska transparent försök att få mänskligheten att lätta upp lite, men det är svårt att hata.',
        'Det är Världsskrattdagen idag, så åtminstone ett torrt fnys borde kunna produceras.',
        'Världsskrattdagen kräver inte att du blir tokig av glädje. Den nöjer sig med märkbart mindre dysterhet.',
      ],
    ],
    [
      'internationella kebabdagen',
      [
        'Internationella kebabdagen känns som ett beslut fattat klockan 01:13, men det gör det inte mindre giltigt.',
        'Det är Internationella kebabdagen idag, alltså ännu en chans att kalla sås för personlighet.',
        'Internationella kebabdagen ger datumet en helt rimlig doft av grillat kött och dåligt omdöme.',
      ],
    ],
    [
      'grillens dag',
      [
        'Grillens dag är bara samhällets sätt att ge eld, fett och självförtroende ett gemensamt datum.',
        'Det är Grillens dag idag, så alla får plötsligt åsikter om glöd som om de vore uråldriga sanningar.',
        'Grillens dag gör mänskligheten enklare att förstå: värme, rök och överdriven stolthet räcker långt.',
      ],
    ],
    [
      'internationella tacodagen',
      [
        'Internationella Tacodagen är en ovanligt stark kandidat till folkets verkliga statsreligion.',
        'Det är Internationella Tacodagen idag, vilket betyder att fredagsdisciplinen får mexikansk accent och bättre sås.',
        'Internationella Tacodagen lyckas vara både massproducerad och helt oemotståndlig. En sällsynt bedrift.',
      ],
    ],
    [
      'raggsockans dag',
      [
        'Raggsockans dag är ett kompetent försvarstal för värme, fulhet och fullständig trygghet.',
        'Det är Raggsockans dag idag, alltså ett legitimt tillfälle att prioritera komfort över all form av stil.',
        'Raggsockans dag ger kalendern en härligt ovårdad men mänsklig profil.',
      ],
    ],
    [
      'alla singlars dag',
      [
        'Alla singlars dag känns som ett mycket rimligt svar på romantikens överexponering.',
        'Det är Alla singlars dag idag, vilket betyder att egen fred äntligen fått kalenderstöd.',
        'Alla singlars dag är i grunden bara ett artigt sätt att säga att man klarar sig utmärkt ändå.',
      ],
    ],
    [
      'internationella vanlighetsdagen',
      [
        'Internationella vanlighetsdagen är nästan provocerande anspråkslös, vilket gör den ganska stark.',
        'Det är Internationella vanlighetsdagen idag, alltså ett sällsynt erkännande av folk som inte orkar vara varumärken.',
        'Internationella vanlighetsdagen ger den grå massan den hyllning den alltid misstänkt att den förtjänade.',
      ],
    ],
    [
      'smorgastartans dag',
      [
        'Smörgåstårtans dag är ett bevis på att Sverige ibland blandar ihop högtid och chockterapi.',
        'Det är Smörgåstårtans dag idag, alltså ett utmärkt läge att låtsas att majonnäs är festarkitektur.',
        'Smörgåstårtans dag ger datumet samma energi som ett dop, en personalfest och ett kylskåp i kris samtidigt.',
      ],
    ],
    [
      'ostkakans dag',
      [
        'Ostkakans dag känns som en högtid för folk som vägrar välja mellan efterrätt och historiskt tålamod.',
        'Det är Ostkakans dag idag, vilket innebär att det äntligen är socialt acceptabelt att vara märkligt passionerad kring mandel.',
        'Ostkakans dag har en gammal, smått hotfull värdighet som man bara får acceptera.',
      ],
    ],
    [
      'julmustens dag',
      [
        'Julmustens dag är till för folk som tar brun läsk på större allvar än geopolitik.',
        'Det är Julmustens dag idag, vilket innebär att ölkylens enklare kusin tillfälligt blivit kunglig.',
        'Julmustens dag ger datumet exakt rätt nivå av sötma, nostalgi och kolsyrad nationalism.',
      ],
    ],
    [
      'pepparkakans dag',
      [
        'Pepparkakans dag är ett mycket starkt argument för att kryddor och tunn aggression kan samexistera.',
        'Det är Pepparkakans dag idag, alltså en dag för knaprig moralisk överlägsenhet och smulor överallt.',
        'Pepparkakans dag lyckas vara både snäll och lätt hotfull, vilket känns ovanligt svenskt.',
      ],
    ],
    [
      'internationella konsumentdagen',
      [
        'Internationella konsumentdagen är ett hövligt sätt att påminna företag om att folk faktiskt märker när de beter sig som svin.',
        'Det är Internationella konsumentdagen idag, alltså en dag för kvitton, rimlighet och lågintensiv indignation.',
        'Internationella konsumentdagen ger vardagsgnället en ovanligt legitim kostym.',
      ],
    ],
    [
      'supporterns dag',
      [
        'Supporterns dag känns som rätt tillfälle att hylla människor som frivilligt bygger sin identitet kring hopp och besvikelse.',
        'Det är Supporterns dag idag, alltså ännu en chans att kalla känslomässig instabilitet för lojalitet.',
        'Supporterns dag ger dagen en vacker doft av halsduk, övertygelse och dåligt konsekvenstänk.',
      ],
    ],
    [
      'internationella dagen for nowruz',
      [
        'Internationella dagen för Nowruz för med sig betydligt mer värdighet än stora delar av resten av temadagskatalogen.',
        'Det är Nowruz idag, vilket gör datumet mindre slentrianmässigt och betydligt mer levande.',
        'Internationella dagen för Nowruz ger kalendern ny energi, vilket den uppriktigt sagt behöver ibland.',
      ],
    ],
    [
      'internationella vattendagen',
      [
        'Internationella vattendagen är en nyttig påminnelse om att civilisationen i grunden står och faller med något som kommer ur kranen.',
        'Det är Internationella vattendagen idag, så visa åtminstone lite respekt för mänsklighetens mest underskattade infrastruktur.',
        'Internationella vattendagen ger vardagen ett ovanligt klart och rimligt fokus.',
      ],
    ],
    [
      'europeiska dagen for hantverksmassigt tillverkad glass',
      [
        'Europeiska dagen för hantverksmässigt tillverkad glass är så överdrivet specifik att den nästan blir nobel.',
        'Det är dagen för hantverksglass idag, alltså en legitim ursäkt att ta kulor på större allvar än geopolitik.',
        'Europeiska dagen för hantverksmässigt tillverkad glass ger kalendern precis rätt mängd kontinentalt självförtroende.',
      ],
    ],
    [
      'arbetsplatsombudens dag',
      [
        'Arbetsplatsombudens dag är en rimlig påminnelse om vilka som faktiskt orkar ta tag i saker när andra helst bara suckar.',
        'Det är Arbetsplatsombudens dag idag, så visa lite respekt för folk som frivilligt går närmare problemen än resten av oss.',
        'Arbetsplatsombudens dag ger vardagen en ovanligt vuxen energi.',
      ],
    ],
    [
      'paskafton',
      [
        'Påskafton är den sortens dag då ägg, socker och märkliga barnkostymer får samexistera utan större protest.',
        'Det är Påskafton idag, alltså fullt legitimt att låta sill, godis och låg produktivitet ta över.',
        'Påskafton gör kalendern lite barnsligare och betydligt bättre.',
      ],
    ],
    [
      'kullerbyttans dag',
      [
        'Kullerbyttans dag känns som ett mycket självsäkert beslut från människor som vägrade släppa lektionen i gymnastiksalen.',
        'Det är Kullerbyttans dag idag, vilket ger kroppen tillfälligt företräde framför värdighet.',
        'Kullerbyttans dag påminner om att vuxenlivet hade mått bra av fler meningslösa rotationer.',
      ],
    ],
    [
      'skojardagen',
      [
        'Skojardagen är den officiella årsdagen för tvivelaktiga skämt och helt onödig listighet.',
        'Det är Skojardagen idag, så man får vara på sin vakt mot folk som ser lite för nöjda ut före lunch.',
        'Skojardagen ger datumet den exakta doft av lågklassigt bus som man kan förvänta sig av första april.',
      ],
    ],
    [
      'internationella barnboksdagen',
      [
        'Internationella barnboksdagen är till för folk som vet att civilisationen egentligen börjar i en högläsningsstund.',
        'Det är Internationella barnboksdagen idag, vilket gör fantasi till en ovanligt legitim samhällsfunktion.',
        'Internationella barnboksdagen ger dagen mer hjärta än de flesta möteskalendrar förtjänar.',
      ],
    ],
    [
      'karlekens dag',
      [
        'Kärlekens dag är modigt nog att dyka upp i kalendern utan att be om ursäkt för sin egen mjukhet.',
        'Det är Kärlekens dag idag, så även de stelaste människorna får försöka vara marginellt mindre frostiga.',
        'Kärlekens dag ger datumet en ovanlig chans att vara både uppriktig och lite generad.',
      ],
    ],
    [
      'morotens dag',
      [
        'Morotens dag är ett imponerande självsäkert drag från en rotfrukt som vet att den har range.',
        'Det är Morotens dag idag, alltså dags att visa respekt för något som klarar både kaka och gryta utan att klaga.',
        'Morotens dag ger vardagen en överraskande orange tyngdpunkt.',
      ],
    ],
    [
      'capsens dag',
      [
        'Capsens dag känns som en högtid framtagen av folk som tycker att skärmar är personlighet.',
        'Det är Capsens dag idag, vilket ger huvudbonader med tveksam estetik ett märkligt starkt mandat.',
        'Capsens dag påminner om att nästan allt kan få en dag om någon bara insisterar tillräckligt hårt.',
      ],
    ],
    [
      'internationella carbonara-dagen',
      [
        'Internationella Carbonara-dagen är till för folk som blir orimligt allvarliga av ägg, ost och pasta.',
        'Det är Carbonara-dagen idag, vilket betyder att någon redan hunnit bli kränkt av grädde i teorin.',
        'Internationella Carbonara-dagen ger datumet en varm, salt och lätt dömande italiensk aura.',
      ],
    ],
    [
      'national walking day',
      [
        'National Walking Day är ett ganska elegant sätt att säga "gå ut en stund, du ser för datormjuk ut".',
        'Det är National Walking Day idag, alltså full legitimitet för att lösa problem i låg fart med armarna hängande.',
        'National Walking Day ger vardagen lite rörelse utan att kräva full träningspersonlighet.',
      ],
    ],
    [
      'romernas internationella dag',
      [
        'Romernas internationella dag förtjänar mer än snabb konsumtion och glömska innan kaffepausen.',
        'Det är Romernas internationella dag idag, alltså ett rimligt tillfälle att visa respekt för kultur, språk och uthållighet.',
        'Romernas internationella dag höjer nivån på kalendern betydligt över dess normala median.',
      ],
    ],
    [
      'css-naked day',
      [
        'CSS-naked day är ett internetpåhitt av den sort som är så dum att det blir rätt charmigt.',
        'Det är CSS-naked day idag, alltså en dag för att låta innehållet stå där utan styling och se nervöst ut.',
        'CSS-naked day ger webben en kort, ful men pedagogisk ödmjukhetsövning.',
      ],
    ],
    [
      'bulle med bullens-dag',
      [
        'Bulle med bullens-dag känns som ett skämt som vägrade dö och därför blev tradition.',
        'Det är Bulle med bullens-dag idag, alltså korv möter bröd i en form som ingen riktigt bad om men många ändå försvarar.',
        'Bulle med bullens-dag ger datumet en märkligt varm kioskaura.',
      ],
    ],
    [
      'internationella dagen for bemannade rymdfarder',
      [
        'Internationella dagen för bemannade rymdfärder har en pondus som resten av kalendern mest kan drömma om.',
        'Det är dagen för bemannade rymdfärder idag, vilket gör marknivån lite mindre imponerande än vanligt.',
        'Internationella dagen för bemannade rymdfärder ger datumet en härlig känsla av teknik, mod och överdrivet stora ambitioner.',
      ],
    ],
    [
      'knytblusens dag',
      [
        'Knytblusens dag är exakt den sorts symbolisk detalj som blir större än plagget självt.',
        'Det är Knytblusens dag idag, alltså en dag då tyg får bära mer laddning än många debattartiklar.',
        'Knytblusens dag ger garderoben en ovanligt tydlig åsikt.',
      ],
    ],
    [
      'cultural unity day',
      [
        'Cultural Unity Day är ambitiöst nog att försöka förbättra världen och det får man ändå respektera.',
        'Det är Cultural Unity Day idag, vilket åtminstone ger datumet högre moralisk puls än normalt.',
        'Cultural Unity Day ger kalendern en ovanligt generös ton, nästan lite misstänkt generös faktiskt.',
      ],
    ],
    [
      'internationella biomedicinska analytikerdagen',
      [
        'Internationella biomedicinska analytikerdagen påminner om hur mycket av samhällets kompetens som pågår långt från strålkastarljuset.',
        'Det är biomedicinska analytikerdagen idag, så visa lite respekt för folk som jobbar i precision i stället för show.',
        'Internationella biomedicinska analytikerdagen ger dagen en ovanligt hög laboratorisk seriositet.',
      ],
    ],
    [
      'varldsrostdagen',
      [
        'Världsröstdagen är ett ganska vackert sätt att påminna folk om att deras stämband faktiskt gör en del av jobbet.',
        'Det är Världsröstdagen idag, alltså ett legitimt tillfälle att uppskatta rösten innan någon missbrukar den i ett onödigt möte.',
        'Världsröstdagen ger datumet en lätt teatral men ändå praktisk värdighet.',
      ],
    ],
    [
      'folkhogskolans dag',
      [
        'Folkhögskolans dag känns som en sund påminnelse om att bildning inte måste vara stel för att vara viktig.',
        'Det är Folkhögskolans dag idag, alltså en dag för kunskap med mer mänsklig puls än standardutbudet brukar klara.',
        'Folkhögskolans dag ger kalendern en ovanligt sympatisk ryggrad.',
      ],
    ],
    [
      'amatorradions dag',
      [
        'Amatörradions dag är en högtid för folk som vet att en antenn och envishet fortfarande kan vinna över mycket.',
        'Det är Amatörradions dag idag, alltså full legitimitet för frekvenser, signaler och nördig värdighet.',
        'Amatörradions dag ger dagen en lågmäld men mycket bestämd teknisk charm.',
      ],
    ],
    [
      'skottkarrans dag',
      [
        'Skottkärrans dag är ett ovanligt rakryggat erkännande av ett redskap som bara gör jobbet utan att gnälla.',
        'Det är Skottkärrans dag idag, alltså en dag för praktisk nytta med ett hjul och noll behov av att synas.',
        'Skottkärrans dag ger vardagen en stabil, jordig kompetens.',
      ],
    ],
    [
      'internationella sekreterardagen',
      [
        'Internationella sekreterardagen är ett rimligt försök att uppmärksamma folk som gör ordning möjlig för resten av kaoset.',
        'Det är Internationella sekreterardagen idag, så lite respekt för struktur och tålamod vore klädsamt.',
        'Internationella sekreterardagen ger datumet en ovanligt välorganiserad ryggrad.',
      ],
    ],
    [
      'jordens dag',
      [
        'Jordens dag är ett ganska brutalt exempel på hur stort ämne kalendern ibland försöker pressa in i ett litet kort.',
        'Det är Jordens dag idag, vilket gör små dumheter lite svårare att ursäkta än vanligt.',
        'Jordens dag ger datumet ett ovanligt planetärt allvar, och det kan nog vara nyttigt.',
      ],
    ],
    [
      'sankt georgsdagen',
      [
        'Sankt Georgsdagen känns som en gammal berättelse som vägrat lämna schemat, och det finns något fint i det.',
        'Det är Sankt Georgsdagen idag, så lite drakbekämpande självbild får väl vara tillåten.',
        'Sankt Georgsdagen ger dagen en lätt rustningsklädd högtidlighet.',
      ],
    ],
    [
      'alla barns dag',
      [
        'Alla barns dag är åtminstone en temadag med rimlig moralisk kompass, vilket inte alltid är fallet här inne.',
        'Det är Alla barns dag idag, alltså ett bra tillfälle att välja omtanke framför cynisk effektivitet.',
        'Alla barns dag gör kalendern mjukare utan att bli menlös.',
      ],
    ],
    [
      'lekens dag',
      [
        'Lekens dag är en ganska tydlig anklagelse mot alltför grå vuxenhet, och den har inte fel.',
        'Det är Lekens dag idag, alltså full behörighet att behandla allvar med viss misstro.',
        'Lekens dag ger datumet energi som känns friskare än ännu ett korrekt stapeldiagram.',
      ],
    ],
    [
      'varldstapirdagen',
      [
        'Världstapirdagen är precis den sortens märkliga men sympatiska högtid som gör kalendern värd att fortsätta med.',
        'Det är Världstapirdagen idag, så det klokaste är att acceptera att tapiren tillfälligt är huvudperson.',
        'Världstapirdagen gör världen lite mer specifik och därför lite bättre.',
      ],
    ],
    [
      'arbetsmiljodagen',
      [
        'Arbetsmiljödagen är till för folk som förstått att fungerande arbete börjar långt före motivationstal och slogans.',
        'Det är Arbetsmiljödagen idag, alltså en dag för stolar, ljudnivåer, ljus och annat som faktiskt avgör om folk orkar.',
        'Arbetsmiljödagen ger vardagen en ovanligt praktisk anständighet.',
      ],
    ],
    [
      'dansens dag',
      [
        'Dansens dag ger kroppen företräde framför självmedvetenheten, vilket fler dagar borde göra.',
        'Det är Dansens dag idag, så lite rytm får väl väga tyngre än social kontroll för en stund.',
        'Dansens dag ger datumet rörelse, fåfänga och märkligt välbehövlig lättnad.',
      ],
    ],
    [
      'arbetarrorelsens dag',
      [
        'Arbetarrörelsens dag är inte direkt lågmäld, men den har åtminstone historisk tyngd nog att bära upp sig själv.',
        'Det är Arbetarrörelsens dag idag, alltså en dag där arbete inte bara får vara slit utan också politik, historia och kamp.',
        'Arbetarrörelsens dag ger första maj lite ryggrad även för folk som mest kom för ledigheten.',
      ],
    ],
    [
      'harry potter-dagen',
      [
        'Harry Potter-dagen är ett bevis på att vissa fandoms vägrar åldras och i ärlighetens namn, bra för dem.',
        'Det är Harry Potter-dagen idag, alltså ännu en chans att kalla nostalgi för kulturarv.',
        'Harry Potter-dagen ger kalendern trollstavsenergi och rätt mycket självförtroende.',
      ],
    ],
    [
      'asociala dagen',
      [
        'Asociala dagen är ovanligt ärlig för att vara temadag, och det ska den ha.',
        'Det är Asociala dagen idag, alltså full legitimitet för korta svar, stängd dörr och begränsad entusiasm.',
        'Asociala dagen ger ensamheten ett ovanligt välförtjänt officiellt skyddsnät.',
      ],
    ],
    [
      'fothalsodagen',
      [
        'Fothälsodagen känns kanske inte glamorös, men fötter har burit värre civilisationer än den här.',
        'Det är Fothälsodagen idag, alltså en dag för att uppskatta det fundament man annars mest pressar ner i skor.',
        'Fothälsodagen ger kalendern en oväntat jordnära relevans.',
      ],
    ],
    [
      'internationella barnmorskedagen',
      [
        'Internationella barnmorskedagen kräver egentligen bara en sak: att folk visar respekt utan att krångla till det.',
        'Det är Internationella barnmorskedagen idag, alltså en rimlig dag att uppskatta yrken med både kompetens och ryggrad.',
        'Internationella barnmorskedagen gör dagen tydligare, tyngre och betydligt mer berättigad.',
      ],
    ],
    [
      'dragspelets dag',
      [
        'Dragspelets dag känns som en högtid framtagen av människor som vägrar låta vardagen vara rytmiskt undernärd.',
        'Det är Dragspelets dag idag, alltså full rätt att låta folkmusikalisk självsäkerhet få lite spelrum.',
        'Dragspelets dag ger datumet en glad men lite hotfull dragspelsvärdighet.',
      ],
    ],
    [
      'hantverksolets dag',
      [
        'Hantverksölets dag är en högtid för folk som tycker att beska bör beskrivas med samma allvar som klimatdata.',
        'Det är Hantverksölets dag idag, alltså en dag för små bryggerier, stora ord och lite för mycket stolthet.',
        'Hantverksölets dag ger datumet en välhumlad självkänsla.',
      ],
    ],
    [
      'europadagen',
      [
        'Europadagen känns som rätt tillfälle att uppskatta kontinenten för allt den är: briljant, besvärlig och byråkratisk.',
        'Det är Europadagen idag, alltså ännu en chans att fira fred, samarbete och dokument som är längre än nödvändigt.',
        'Europadagen ger dagen en ovanligt kontinentalt städad tyngd.',
      ],
    ],
    [
      'chokladbollens dag',
      [
        'Chokladbollens dag är ett starkt argument för att det enkla ofta vinner över det fina med rätt marginal.',
        'Det är Chokladbollens dag idag, alltså dags att visa respekt för kokos, kakao och fullständig effektivitet.',
        'Chokladbollens dag ger dagen den exakta mängd lågmäld glädje som behövs.',
      ],
    ],
    [
      'automower-dagen',
      [
        'Automower-dagen känns som framtiden sedd från en villaträdgård med för mycket eluttag.',
        'Det är Automower-dagen idag, alltså en dag då människor applåderar gräsklippning som om den vore autonom diplomati.',
        'Automower-dagen ger tekniken en ovanligt välklippt aura.',
      ],
    ],
    [
      'portrattfotots dag',
      [
        'Porträttfotots dag är ett ganska elegant tillfälle att påminna sig om att ansikten också är dokumentation.',
        'Det är Porträttfotots dag idag, alltså en dag för ljus, blick och lätt överdriven självmedvetenhet.',
        'Porträttfotots dag ger kalendern en ovanligt fokuserad yta.',
      ],
    ],
    [
      'rumpans dag',
      [
        'Rumpans dag är så burdus att man nästan måste respektera den raka linjen i det.',
        'Det är Rumpans dag idag, vilket tyder på att någon helt enkelt vägrade låta ämnet vara underrepresenterat.',
        'Rumpans dag ger kalendern ett ganska tydligt tecken på att värdighet är valfritt.',
      ],
    ],
    [
      'internationella familjedagen',
      [
        'Internationella familjedagen påminner om att familj kan vara både trygghet och fullskalig logistikstörning samtidigt.',
        'Det är Internationella familjedagen idag, alltså en dag för kärlek, tålamod och halvt fungerande gruppdynamik.',
        'Internationella familjedagen ger kalendern en mänsklig tyngd som faktiskt bär.',
      ],
    ],
    [
      'fascinerande vaxters dag',
      [
        'Fascinerande växters dag är ambitiös nog att låta klorofyll bära hela datumet, och det fungerar oväntat bra.',
        'Det är Fascinerande växters dag idag, så det är bara att ge växtriket lite välförtjänt scenljus.',
        'Fascinerande växters dag gör världen lite grönare och betydligt mindre dum för ett ögonblick.',
      ],
    ],
    [
      'halloumiostens dag',
      [
        'Halloumiostens dag är en högtid för folk som vill höra sin middag gnissla lite under tänderna.',
        'Det är Halloumiostens dag idag, alltså en dag för salt, stekyta och orimligt stark självrespekt.',
        'Halloumiostens dag ger datumet en mycket tydlig panna och ganska gott självförtroende.',
      ],
    ],
    [
      'forskolans dag',
      [
        'Förskolans dag är ett rimligt erkännande av en institution som varje vardag gör mer för samhällets funktion än många tal någonsin gör.',
        'Det är Förskolans dag idag, alltså en dag för tålamod, pedagogik och en helt osannolik energinivå.',
        'Förskolans dag ger kalendern en mycket välförtjänt praktisk värdighet.',
      ],
    ],
    [
      'internationella flytvastdagen',
      [
        'Internationella flytvästdagen är ovanligt tydlig i sin poäng, vilket är skönt för en gångs skull.',
        'Det är Internationella flytvästdagen idag, alltså en dag för klokskap med dragkedja.',
        'Internationella flytvästdagen ger säkerhet en ovanligt sympatisk silhuett.',
      ],
    ],
    [
      'internationella dagen for biologiskt mangfald',
      [
        'Internationella dagen för biologisk mångfald har den obehagliga egenskapen att vara både vacker och på riktigt viktig.',
        'Det är dagen för biologisk mångfald idag, alltså en bra dag att minnas att världen inte byggdes för bara människor och asfalt.',
        'Internationella dagen för biologisk mångfald gör kalendern mer levande än vanligt, bokstavligen.',
      ],
    ],
    [
      'internationella skoldpaddsdagen',
      [
        'Internationella sköldpaddsdagen är precis lagom specifik för att kännas både fånig och helt rimlig.',
        'Det är Internationella sköldpaddsdagen idag, så låt tempot sjunka och värdigheten öka något.',
        'Internationella sköldpaddsdagen ger datumet ett långsamt men mycket stabilt självförtroende.',
      ],
    ],
    [
      'nationalparkernas dag',
      [
        'Nationalparkernas dag är en stark påminnelse om att vissa platser förtjänar bättre än mänskligt slarv.',
        'Det är Nationalparkernas dag idag, alltså en dag för att uppskatta natur med lite mer disciplin än vanligt.',
        'Nationalparkernas dag ger kalendern en ovanligt frisk ryggrad.',
      ],
    ],
    [
      'handduksdagen',
      [
        'Handduksdagen är ett nördigt mästerstycke i hur ett helt absurt objekt kan få total kulturell tyngd.',
        'Det är Handduksdagen idag, alltså den enda dagen då handduken på allvar räknas som livsfilosofi.',
        'Handduksdagen gör världen lite märkligare och därför lite bättre.',
      ],
    ],
    [
      'fotografens dag',
      [
        'Fotografens dag är ett bra tillfälle att visa respekt för folk som både ser saker och får andra att stå still i dåligt ljus.',
        'Det är Fotografens dag idag, alltså en dag för blick, tajming och lätt påfrestande perfektionism.',
        'Fotografens dag ger vardagen skärpa där den annars mest flimrar.',
      ],
    ],
    [
      'muffinsdagen',
      [
        'Muffinsdagen är ett utmärkt exempel på hur samhället ibland väljer rätt utan att göra stor sak av det.',
        'Det är Muffinsdagen idag, alltså legitimt att ge små kupolformade bakverk större betydelse än vissa projektplaner.',
        'Muffinsdagen ger datumet precis rätt nivå av fluff och funktion.',
      ],
    ],
    [
      'den stressfria dagen',
      [
        'Den stressfria dagen är så optimistisk att den nästan känns provocerande, men man får ändå uppskatta försöket.',
        'Det är Den stressfria dagen idag, alltså ett tillfälle att åtminstone spela mindre pressad än vanligt.',
        'Den stressfria dagen ger kalendern ett ovanligt vänligt tonläge.',
      ],
    ],
    [
      'fonsterrenoveringens dag',
      [
        'Fönsterrenoveringens dag är en så detaljerad hyllning till underhåll att man nästan blir rörd.',
        'Det är Fönsterrenoveringens dag idag, alltså en dag för tålamod, trä och folk som faktiskt avslutar saker ordentligt.',
        'Fönsterrenoveringens dag ger vardagen en mycket specifik men förvånansvärt trovärdig värdighet.',
      ],
    ],
    [
      'vardagsmeteorologidagen',
      [
        'Meteorologidagen är i praktiken en högtid för folk som gissar framtiden med bättre statistik än resten av oss.',
      ],
    ],
  ];

  for (const [key, blurbs] of overrides) {
    if (normalized.includes(key)) {
      return blurbs;
    }
  }

  return null;
}

function getThemeDayCategoryBlurbs(themeDay: string): string[] {
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

function buildThemeDayBlurbs(themeDays: string[]): string[] {
  const leadDay = themeDays[0];
  const allDays = joinWithAnd(themeDays);
  const specific = getThemeDaySpecificBlurbs(leadDay);
  const leadDayBlurbs = specific ?? getThemeDayCategoryBlurbs(leadDay);

  return [
    ...leadDayBlurbs,
    `${allDays} står på schemat för datumet. Det är inte officiellt, men det är fullt tillräckligt.`,
    `Det här datumet är inte tomt. Det tillhör ${leadDay}, och det vore småaktigt att ignorera det.`,
    `Om någon undrar varför stämningen känns orimligt specifik så är svaret ${allDays}.`,
  ];
}

function getDaysUntil(date: Date, target: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - date.getTime()) / millisecondsPerDay);
}

function getUpcomingHolidayBlurb(holidayName: string, daysUntil: number): string {
  if (daysUntil <= 1) {
    return `${holidayName} väntar imorgon, så veckan är i praktiken redan perforerad.`;
  }

  if (daysUntil === 2) {
    return `${holidayName} ligger bara två dagar bort. Ambitionsnivån bör därefter justeras försiktigt nedåt.`;
  }

  if (daysUntil === 3) {
    return `${holidayName} dyker upp om tre dagar, vilket är nära nog för att sabotera seriös framförhållning.`;
  }

  return `${holidayName} ligger senare i veckan. Håll ut, det finns åtminstone en officiell lucka i systemet.`;
}

function usesCompactPrimaryMedia(dayType: DayType): boolean {
  return (
    dayType === 'kottonsdag' ||
    dayType === 'fisktorsdag' ||
    dayType === 'marmeladfredag'
  );
}

async function fetchNameDays(dateLabel: string): Promise<string[]> {
  const [year, month, day] = dateLabel.split('-');
  const response = await fetch(
    `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}/${day}`
  );

  if (!response.ok) {
    throw new Error(`Namnsdag lookup failed for ${dateLabel}`);
  }

  const payload = (await response.json()) as SholidayResponse;

  if (!Array.isArray(payload.dagar) || !Array.isArray(payload.dagar[0]?.namnsdag)) {
    return [];
  }

  return payload.dagar[0].namnsdag;
}

const celebrations: Record<Exclude<DayType, 'ordinary'>, CelebrationContent> = {
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

function App({ initialDate = new Date() }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatForInput(initialDate));
  const [nameDays, setNameDays] = useState<string[]>([]);
  const [nameDayState, setNameDayState] = useState<NameDayState>('loading');
  const [blurb, setBlurb] = useState(ordinaryBlurb);

  const selectedDateObject = useMemo(
    () => new Date(`${selectedDate}T12:00:00`),
    [selectedDate]
  );
  const dayStatus = getDayStatus(selectedDateObject);
  const celebration =
    dayStatus.dayType === 'ordinary' ? null : celebrations[dayStatus.dayType];
  const themeDays = useMemo(
    () => getThemeDaysForDate(selectedDateObject),
    [selectedDateObject]
  );
  const visibleThemeDays = useMemo(() => {
    if (!celebration || dayStatus.dayType === 'ordinary') {
      return themeDays;
    }

    const aliases = getCelebrationThemeAliases(dayStatus.dayType);
    const aliasSet = new Set(aliases.map((alias) => normalizeLabel(alias)));

    return themeDays.filter((themeDay) => !aliasSet.has(normalizeLabel(themeDay)));
  }, [celebration, dayStatus.dayType, themeDays]);
  const hasThemeDays = visibleThemeDays.length > 0;
  const humanDate = formatForHumans(selectedDateObject);
  const upcomingHoliday = getUpcomingOfficialHolidayInWeek(selectedDateObject);
  const daysUntilHoliday = upcomingHoliday
    ? getDaysUntil(selectedDateObject, upcomingHoliday.date)
    : null;
  const theme = celebration?.theme ?? 'ordinary';
  const compactPrimaryMedia = usesCompactPrimaryMedia(dayStatus.dayType);
  const themeDayBlurbs = useMemo(
    () => (!celebration && hasThemeDays ? buildThemeDayBlurbs(visibleThemeDays) : null),
    [celebration, hasThemeDays, visibleThemeDays]
  );
  const currentBlurbs = useMemo(() => {
    if (celebration) {
      return celebration.blurbs;
    }

    if (themeDayBlurbs) {
      return themeDayBlurbs;
    }

    if (hasOrdinaryWeekdayExcuses(selectedDateObject, dayStatus.dayType)) {
      return ordinaryWeekdayBlurbs;
    }

    return null;
  }, [celebration, themeDayBlurbs, dayStatus.dayType, selectedDateObject]);
  const kicker = celebration
    ? celebration.kicker
    : hasThemeDays
      ? visibleThemeDays.length > 1
        ? `Inofficiella temadagar x${visibleThemeDays.length}`
        : 'Inofficiell temadag'
      : 'Ingen officiell stordådskänsla';
  const mainTitle = celebration
    ? celebration.title
    : hasThemeDays
      ? `${visibleThemeDays[0]}. Det får väl räcka.`
      : 'En vanlig dag. Så sorgligt är det.';

  useEffect(() => {
    if (!currentBlurbs) {
      setBlurb(ordinaryBlurb);
      return;
    }

    setBlurb(getRandomItem(currentBlurbs));
  }, [selectedDate, currentBlurbs]);

  useEffect(() => {
    let isCurrent = true;

    setNameDayState('loading');

    fetchNameDays(dayStatus.dateLabel)
      .then((names) => {
        if (!isCurrent) {
          return;
        }

        setNameDays(names);
        setNameDayState('ready');
      })
      .catch(() => {
        if (!isCurrent) {
          return;
        }

        setNameDays([]);
        setNameDayState('error');
      });

    return () => {
      isCurrent = false;
    };
  }, [dayStatus.dateLabel]);

  return (
    <div className={`App ${darkMode ? 'dark' : ''} theme-${theme}`}>
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-grid">
        <header className="app-panel app-panel--intro">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
          >
            {darkMode ? 'Ljust läge' : 'Mörkt läge'}
          </button>

          <div className="brand-block">
            <img src={mojoLogo} alt="Mojo Logo" className="brand-logo" />
            <div className="brand-copy">
              <p className="eyebrow">Fredagskoll deluxe</p>
              <h1 className="brand-title">Vad firar vi idag?</h1>
              <p className="brand-lede">
                Välj ett datum och låt appen avgöra om dagen förtjänar sill,
                semla, fisk eller bara ett tyst konstaterande av tomhet.
              </p>
            </div>
          </div>

          <label htmlFor="date-picker" className="picker-label">
            Välj datum
          </label>
          <div className="picker-shell">
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="date-picker"
            />
            <div className="picker-meta">
              <span>{humanDate}</span>
              <span>{dayStatus.dateLabel}</span>
            </div>
          </div>

          <div className="nameday-card">
            <p className="eyebrow">Dagens namnsdag</p>
            {nameDayState === 'loading' ? (
              <p className="nameday-text">Laddar namnsdag från öppet API.</p>
            ) : null}
            {nameDayState === 'error' ? (
              <p className="nameday-text">
                Namnsdag gick inte att hämta just nu. Internet måste förstås
                också vilja samarbeta.
              </p>
            ) : null}
            {nameDayState === 'ready' && nameDays.length > 0 ? (
              <p className="nameday-text">{nameDays.join(' och ')}</p>
            ) : null}
            {nameDayState === 'ready' && nameDays.length === 0 ? (
              <p className="nameday-text">Ingen namnsdag registrerad för datumet.</p>
            ) : null}
          </div>

          {upcomingHoliday && daysUntilHoliday !== null ? (
            <div className="holiday-card">
              <p className="eyebrow">Veckans helgdag</p>
              <p className="holiday-title">{upcomingHoliday.name}</p>
              <p className="nameday-text">
                {getUpcomingHolidayBlurb(upcomingHoliday.name, daysUntilHoliday)}
              </p>
              <p className="holiday-meta">
                {daysUntilHoliday} dagar kvar till {formatShortSwedishDate(upcomingHoliday.date)}.
              </p>
            </div>
          ) : null}

          <footer className="intro-footer">
            <a
              className="source-link"
              href="https://temadagar.se/kalender/"
              target="_blank"
              rel="noreferrer"
            >
              Temadagar inspirerade av temadagar.se
            </a>
          </footer>
        </header>

        <main className="app-panel celebration-card">
          <p className="eyebrow">{kicker}</p>
          <h2 className="celebration-title">{formatTitle(mainTitle)}</h2>
          <div className="blurb-row">
            <p className="celebration-blurb">{blurb}</p>
            {currentBlurbs ? (
              <button
                type="button"
                className="reroll-button"
                onClick={() => setBlurb(getRandomItem(currentBlurbs))}
              >
                Ny ursäkt
              </button>
            ) : null}
          </div>

          {celebration ? (
            <>
              <div className="media-grid">
                {celebration.primaryImage ? (
                  <figure
                    className={`media-card media-card--primary${
                      compactPrimaryMedia ? ' media-card--compact' : ''
                    }`}
                  >
                    <img
                      src={celebration.primaryImage}
                      alt={celebration.alt ?? celebration.title}
                    />
                  </figure>
                ) : null}
                {celebration.secondaryImage ? (
                  <figure className="media-card">
                    <img
                      src={celebration.secondaryImage}
                      alt={`${celebration.alt ?? celebration.title} extra`}
                    />
                  </figure>
                ) : null}
                {!celebration.primaryImage && !celebration.secondaryImage ? (
                  <div className="placeholder-card">
                    <span>Ingen bild ännu</span>
                    <strong>Det här firandet får leva på text och dåliga beslut.</strong>
                  </div>
                ) : null}
              </div>

              {hasThemeDays ? (
                <div className="theme-day-panel">
                  <span className="ordinary-badge">Fler temadagar idag</span>
                  <p>
                    Som om {mainTitle.split('.')[0].toLowerCase()} inte räckte, så pågår även{' '}
                    {joinWithAnd(visibleThemeDays)} i bakgrunden.
                  </p>
                  <ul className="theme-day-list">
                    {visibleThemeDays.map((themeDay) => (
                      <li key={themeDay}>{themeDay}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <div className="ordinary-card">
              <span className="ordinary-badge">
                {hasThemeDays ? 'Dagens temadagar' : 'Ingen träff'}
              </span>
              <p>
                {hasThemeDays
                  ? `Temadagsmotorn hittade ${joinWithAnd(visibleThemeDays)}. Det är inte officiellt, men det räcker gott för att börja improvisera.`
                  : 'Datumet har kollats. Systemet fann ingen semla, ingen sill, ingen bullplikt och ingen kollektiv ursäkt för att tappa fokus.'}
              </p>
              {hasThemeDays ? (
                <ul className="theme-day-list">
                  {visibleThemeDays.map((themeDay) => (
                    <li key={themeDay}>{themeDay}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
