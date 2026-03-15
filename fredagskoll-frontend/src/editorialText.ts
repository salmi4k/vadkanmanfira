import { Locale } from './locale';
import { Mood } from './mood';

function byLocale(locale: Locale, values: Record<Locale, string>): string {
  return values[locale];
}

export function getOrdinaryTitle(locale: Locale, mood: Mood): string {
  switch (mood) {
    case 'cheerful':
      return byLocale(locale, {
        sv: 'En vanlig dag. Ovant nog fullt brukbar.',
        en: 'Just an ordinary day. Surprisingly serviceable.',
        'pt-BR': 'So um dia comum. Estranhamente aproveitavel.',
      });
    case 'formal':
      return byLocale(locale, {
        sv: 'En ordinär dag. Administrationen fortgår.',
        en: 'An ordinary day. Operations proceed.',
        'pt-BR': 'Um dia ordinario. A operacao prossegue.',
      });
    case 'warm':
      return byLocale(locale, {
        sv: 'En vanlig dag. Den får väl behandlas hyggligt ändå.',
        en: 'Just an ordinary day. It still deserves decent treatment.',
        'pt-BR': 'So um dia comum. Ainda merece um pouco de decencia.',
      });
    case 'chaotic':
      return byLocale(locale, {
        sv: 'En vanlig dag. Ingen styr den här skutan särskilt snyggt.',
        en: 'Just an ordinary day. Nobody is steering this ship elegantly.',
        'pt-BR': 'So um dia comum. Ninguem esta conduzindo isso com elegancia.',
      });
    case 'absurd':
      return byLocale(locale, {
        sv: 'En vanlig dag. Kalendern har återigen valt beige dramatik.',
        en: 'Just an ordinary day. The calendar chose beige drama again.',
        'pt-BR': 'So um dia comum. O calendario escolheu um drama bege de novo.',
      });
    default:
      return byLocale(locale, {
        sv: 'En vanlig dag. Så sorgligt är det.',
        en: 'Just an ordinary day. Grim stuff.',
        'pt-BR': 'Só um dia comum. Triste, mas é isso.',
      });
  }
}

export function getOrdinaryNoHitBody(locale: Locale, mood: Mood): string {
  switch (mood) {
    case 'cheerful':
      return byLocale(locale, {
        sv: 'Datumet är kontrollerat. Ingen officiell fest dök upp, men dagen är åtminstone fortfarande användbar för kaffe, luft och rimliga ambitioner.',
        en: 'The date has been checked. No official celebration turned up, but the day remains perfectly usable for coffee, air, and modest ambition.',
        'pt-BR': 'A data foi verificada. Nao apareceu nenhuma celebracao oficial, mas o dia ainda serve muito bem para cafe, ar fresco e ambicoes modestas.',
      });
    case 'formal':
      return byLocale(locale, {
        sv: 'Datumet har granskats. Ingen semla, ingen sill och ingen officiell ursäkt kunde konstateras.',
        en: 'The date has been reviewed. No semla, no herring, and no official excuse could be established.',
        'pt-BR': 'A data foi analisada. Nao se constatou semla, arenque nem desculpa oficial.',
      });
    case 'warm':
      return byLocale(locale, {
        sv: 'Datumet har kollats. Ingen tradition kom och lyfte det, men dagen klarar sig nog med lite tålamod och hyggligt tonfall.',
        en: 'The date has been checked. No tradition came to lift it, but the day will probably manage with a little patience and a decent tone.',
        'pt-BR': 'A data foi verificada. Nenhuma tradicao veio salvar o dia, mas ele provavelmente se aguenta com um pouco de paciencia e um tom decente.',
      });
    case 'chaotic':
      return byLocale(locale, {
        sv: 'Datumet är genomsökt. Ingen semla, ingen sill, ingen bullplikt. Bara ren operativ friktion och vad det nu är vi håller på med här.',
        en: 'The date has been searched. No semla, no herring, no bun obligation. Just raw operational friction and whatever it is we are doing here.',
        'pt-BR': 'A data foi vasculhada. Nada de semla, nada de arenque, nada de obrigacao de bolo. So friccao operacional e seja la o que estamos fazendo aqui.',
      });
    case 'absurd':
      return byLocale(locale, {
        sv: 'Datumet har undersökts och visade sig sakna både högtid och användbar mytologi. Bara en frigående vardag i slips.',
        en: 'The date was examined and proved to contain neither celebration nor useful mythology. Just a free-range weekday in a tie.',
        'pt-BR': 'A data foi examinada e revelou nao conter nem celebracao nem mitologia util. So um dia util de gravata andando solto.',
      });
    default:
      return byLocale(locale, {
        sv: 'Datumet har kollats. Systemet fann ingen semla, ingen sill, ingen bullplikt och ingen kollektiv ursäkt för att tappa fokus.',
        en: 'The date has been checked. The system found no semla, no herring, no bun obligation, and no collective excuse to lose focus.',
        'pt-BR': 'A data foi verificada. O sistema nao encontrou semla, arenque, obrigacao de bolo nem desculpa coletiva para perder o foco.',
      });
  }
}

export function getOrdinaryThemeDayLead(
  locale: Locale,
  mood: Mood,
  days: string,
  note: string
): string {
  switch (mood) {
    case 'cheerful':
      return byLocale(locale, {
        sv: `Temadagsmotorn hittade ${days}. ${note}`,
        en: `The theme-day engine found ${days}. ${note}`,
        'pt-BR': `O motor de datas tematicas encontrou ${days}. ${note}`,
      });
    case 'formal':
      return byLocale(locale, {
        sv: `Temadagsmotorn identifierade ${days}. ${note}`,
        en: `The theme-day engine identified ${days}. ${note}`,
        'pt-BR': `O motor de datas tematicas identificou ${days}. ${note}`,
      });
    case 'warm':
      return byLocale(locale, {
        sv: `Temadagsmotorn lyckades faktiskt hitta ${days}. ${note}`,
        en: `The theme-day engine actually managed to find ${days}. ${note}`,
        'pt-BR': `O motor de datas tematicas conseguiu achar ${days}. ${note}`,
      });
    case 'chaotic':
      return byLocale(locale, {
        sv: `Temadagsmotorn hittade ${days}, vilket åtminstone förklarar varför datumet plötsligt beter sig märkligt. ${note}`,
        en: `The theme-day engine found ${days}, which at least explains why the date is behaving strangely. ${note}`,
        'pt-BR': `O motor de datas tematicas encontrou ${days}, o que pelo menos explica por que a data esta agindo de forma estranha. ${note}`,
      });
    case 'absurd':
      return byLocale(locale, {
        sv: `Temadagsmotorn hittade ${days}. Kalendern har alltså återigen beviljat ett märkligt ämne officiell-ish luft. ${note}`,
        en: `The theme-day engine found ${days}. The calendar has once again granted an odd subject semi-official oxygen. ${note}`,
        'pt-BR': `O motor de datas tematicas encontrou ${days}. O calendario voltou a conceder oxigenio semi-oficial a um assunto esquisito. ${note}`,
      });
    default:
      return byLocale(locale, {
        sv: `Temadagsmotorn hittade ${days}. ${note}`,
        en: `The theme-day engine found ${days}. ${note}`,
        'pt-BR': `O motor de datas tematicas encontrou ${days}. ${note}`,
      });
  }
}

export function getAsIfThatWasNotEnough(
  locale: Locale,
  mood: Mood,
  leadDay: string,
  days: string
): string {
  const lowerLead = leadDay.toLowerCase();
  switch (mood) {
    case 'cheerful':
      return byLocale(locale, {
        sv: `Som om ${lowerLead} inte redan gav dagen tillräckligt med energi, så ligger även ${days} och hjälper till i kulisserna.`,
        en: `As if ${lowerLead} did not already give the day enough energy, ${days} is also helping from the wings.`,
        'pt-BR': `Como se ${lowerLead} ja nao desse energia suficiente ao dia, ${days} tambem esta ajudando nos bastidores.`,
      });
    case 'formal':
      return byLocale(locale, {
        sv: `Som om ${lowerLead} inte var tillräckligt, pågår även ${days} parallellt.`,
        en: `As if ${lowerLead} were not sufficient, ${days} is also in progress.`,
        'pt-BR': `Como se ${lowerLead} nao bastasse, ${days} tambem esta em curso.`,
      });
    case 'warm':
      return byLocale(locale, {
        sv: `Som om ${lowerLead} inte räckte, så får dagen även sällskap av ${days} i bakgrunden.`,
        en: `As if ${lowerLead} were not enough, the day is also quietly accompanied by ${days}.`,
        'pt-BR': `Como se ${lowerLead} nao bastasse, o dia ainda conta com a companhia de ${days} ao fundo.`,
      });
    case 'chaotic':
      return byLocale(locale, {
        sv: `Som om ${lowerLead} inte var nog, pågår även ${days} och gör schemat märkbart mindre trovärdigt.`,
        en: `As if ${lowerLead} were not enough, ${days} is also happening and making the schedule less credible.`,
        'pt-BR': `Como se ${lowerLead} nao bastasse, ${days} tambem esta acontecendo e reduzindo bastante a credibilidade da agenda.`,
      });
    case 'absurd':
      return byLocale(locale, {
        sv: `Som om ${lowerLead} inte räckte, har även ${days} glidit in och börjat andas i datumets nacke.`,
        en: `As if ${lowerLead} were not enough, ${days} has also drifted in and started breathing on the date's neck.`,
        'pt-BR': `Como se ${lowerLead} nao bastasse, ${days} tambem entrou de fininho e comecou a respirar no pescoco da data.`,
      });
    default:
      return byLocale(locale, {
        sv: `Som om ${lowerLead} inte räckte, så pågår även ${days} i bakgrunden.`,
        en: `As if ${lowerLead} was not enough, ${days} is also rattling around in the background.`,
        'pt-BR': `Como se ${lowerLead} nao bastasse, ${days} tambem esta rondando a data ao fundo.`,
      });
  }
}

export function getOrdinaryThemeDayTitleEndings(locale: Locale, mood: Mood): string[] {
  switch (mood) {
    case 'cheerful':
      return [
        byLocale(locale, { sv: 'Det piggar upp mer än man kunde begära.', en: 'It brightens the day more than strictly necessary.', 'pt-BR': 'Anima o dia mais do que o necessario.' }),
        byLocale(locale, { sv: 'Det får gärna bära stämningen en stund.', en: 'It may as well carry the mood for a while.', 'pt-BR': 'Pode muito bem sustentar o clima por um tempo.' }),
        byLocale(locale, { sv: 'Det här känns ändå ganska trevligt.', en: 'This is honestly rather pleasant.', 'pt-BR': 'Isso esta honestamente bem agradavel.' }),
        byLocale(locale, { sv: 'Kalendern kunde ha gjort betydligt sämre ifrån sig.', en: 'The calendar could have done considerably worse.', 'pt-BR': 'O calendario poderia ter se saído muito pior.' }),
      ];
    case 'formal':
      return [
        byLocale(locale, { sv: 'Det får anses tillräckligt för ändamålet.', en: 'This will be considered sufficient for present purposes.', 'pt-BR': 'Isto sera considerado suficiente para os fins atuais.' }),
        byLocale(locale, { sv: 'Det tillför åtminstone viss struktur åt dagen.', en: 'It adds at least some structure to the day.', 'pt-BR': 'Ao menos adiciona alguma estrutura ao dia.' }),
        byLocale(locale, { sv: 'Det får härmed bära dagens innehåll.', en: 'It is hereby assigned to carry the day.', 'pt-BR': 'Fica assim encarregado de sustentar o dia.' }),
        byLocale(locale, { sv: 'Det duger som officiell-ish motivering.', en: 'It will do as an official-ish justification.', 'pt-BR': 'Serve como justificativa quase oficial.' }),
      ];
    case 'warm':
      return [
        byLocale(locale, { sv: 'Det får väl ge dagen lite mänsklig hjälp på traven.', en: 'It may as well give the day a little human assistance.', 'pt-BR': 'Pode ao menos dar ao dia uma ajudinha humana.' }),
        byLocale(locale, { sv: 'Det räcker faktiskt rätt fint idag.', en: 'That is honestly enough for today.', 'pt-BR': 'Isso honestamente ja basta hoje.' }),
        byLocale(locale, { sv: 'Det gör datumet lite lättare att tycka om.', en: 'It makes the date a little easier to like.', 'pt-BR': 'Torna a data um pouco mais facil de gostar.' }),
        byLocale(locale, { sv: 'Det är ändå en hygglig sak att samlas kring.', en: 'It is still a decent thing to gather around.', 'pt-BR': 'Ainda e uma coisa decente em torno da qual se reunir.' }),
      ];
    case 'chaotic':
      return [
        byLocale(locale, { sv: 'Det får väl styra cirkusen en stund då.', en: 'It may as well run the circus for a while.', 'pt-BR': 'Entao que isso conduza o circo por um tempo.' }),
        byLocale(locale, { sv: 'Ingen stoppade det i tid.', en: 'No one stopped it in time.', 'pt-BR': 'Ninguem impediu isso a tempo.' }),
        byLocale(locale, { sv: 'Det är nu officiellt dagens märkliga motorik.', en: 'It is now the day\'s strange motor function.', 'pt-BR': 'Agora isso e a estranha motricidade do dia.' }),
        byLocale(locale, { sv: 'Schemat kommer inte återhämta sig från detta.', en: 'The schedule will not recover from this.', 'pt-BR': 'A agenda nao vai se recuperar disso.' }),
      ];
    case 'absurd':
      return [
        byLocale(locale, { sv: 'Kalendern har låtit ämnet sätta sig i chefsstolen.', en: 'The calendar has allowed the subject to occupy the executive chair.', 'pt-BR': 'O calendario permitiu que o assunto ocupasse a cadeira executiva.' }),
        byLocale(locale, { sv: 'Det får väl bära dagen i sin märkliga lilla kostym.', en: 'It may as well carry the day in its strange little suit.', 'pt-BR': 'Que isso sustente o dia em seu pequeno terno esquisito.' }),
        byLocale(locale, { sv: 'Det här är uppenbarligen vad datumet ville bli när det blev stort.', en: 'This is apparently what the date wanted to be when it grew up.', 'pt-BR': 'Aparentemente era isso que a data queria ser quando crescesse.' }),
        byLocale(locale, { sv: 'Man får respektera hur orimligt konkret det blev.', en: 'One has to respect how unreasonably specific this became.', 'pt-BR': 'E preciso respeitar o quanto isso ficou absurdamente especifico.' }),
      ];
    default:
      return [
        byLocale(locale, { sv: 'Det får väl bära dagen då.', en: 'That will have to carry the day, then.', 'pt-BR': 'Vai ter que sustentar o dia, entao.' }),
        byLocale(locale, { sv: 'Det är åtminstone något att skylla på.', en: "At least it's something to blame it on.", 'pt-BR': 'Pelo menos ja existe algo em que por a culpa.' }),
        byLocale(locale, { sv: 'Ingen i organisationen var stark nog att stoppa det.', en: 'Nobody in the organization was strong enough to stop it.', 'pt-BR': 'Ninguem na organizacao teve forca para impedir.' }),
        byLocale(locale, { sv: 'Det är mer än kalendern brukar erbjuda.', en: "It's more than the calendar usually offers.", 'pt-BR': 'E mais do que o calendario costuma oferecer.' }),
        byLocale(locale, { sv: 'Det blir inte bättre än så här idag.', en: "This is about as good as today's getting.", 'pt-BR': 'Hoje nao vai ficar melhor do que isso.' }),
        byLocale(locale, { sv: 'Det får duga som dagens professionella ursäkt.', en: "It'll do as today's professional excuse.", 'pt-BR': 'Serve como desculpa profissional do dia.' }),
        byLocale(locale, { sv: 'Vi tar det och går vidare.', en: "We'll take it and move on.", 'pt-BR': 'A gente aceita e segue em frente.' }),
        byLocale(locale, { sv: 'Det är i alla fall bättre än ren tomhet.', en: "It's still better than pure emptiness.", 'pt-BR': 'Ainda e melhor do que vazio absoluto.' }),
      ];
  }
}

export function getOrdinaryThemeDayCardNotes(locale: Locale, mood: Mood): string[] {
  switch (mood) {
    case 'cheerful':
      return [
        byLocale(locale, { sv: 'Det är inte officiellt, men tillräckligt många ville uppenbarligen ge dagen lite liv.', en: 'It is not official, but clearly enough people wanted to give the day some life.', 'pt-BR': 'Nao e oficial, mas gente suficiente claramente quis dar alguma vida ao dia.' }),
        byLocale(locale, { sv: 'Kalendern fick något användbart att jobba med och det får man nästan kalla framsteg.', en: 'The calendar got something usable to work with, which nearly counts as progress.', 'pt-BR': 'O calendario recebeu algo util com que trabalhar, o que quase conta como progresso.' }),
        byLocale(locale, { sv: 'Det här är smalt, men på ett ganska charmigt sätt.', en: 'This is niche, but in a fairly charming way.', 'pt-BR': 'Isso e nichado, mas de um jeito ate charmoso.' }),
        byLocale(locale, { sv: 'Dagen fick lite innehåll och det gör den märkbart lättare att vara vän med.', en: 'The day got a little content, which makes it noticeably easier to befriend.', 'pt-BR': 'O dia ganhou algum conteudo, e isso o torna bem mais facil de suportar.' }),
      ];
    case 'formal':
      return [
        byLocale(locale, { sv: 'Detta är inte officiellt, men tillräckligt etablerat för att kunna behandlas med viss seriositet.', en: 'This is not official, but sufficiently established to be treated with some seriousness.', 'pt-BR': 'Isto nao e oficial, mas esta suficientemente estabelecido para receber alguma seriedade.' }),
        byLocale(locale, { sv: 'Kalendern arbetar med tillgängligt material och dagens underlag får anses acceptabelt.', en: 'The calendar works with available material, and today\'s basis must be considered acceptable.', 'pt-BR': 'O calendario trabalha com o material disponivel, e a base de hoje pode ser considerada aceitavel.' }),
        byLocale(locale, { sv: 'Det är smalt men tillräckligt sammanhållet för att ge datumet visst stöd.', en: 'It is niche but coherent enough to provide the date with some support.', 'pt-BR': 'E nichado, mas coeso o bastante para dar algum apoio a data.' }),
        byLocale(locale, { sv: 'Ingen formell myndighet står bakom detta, men viss respekt kan ändå anses motiverad.', en: 'No formal authority stands behind it, but some respect is still warranted.', 'pt-BR': 'Nenhuma autoridade formal assina isso, mas algum respeito ainda se justifica.' }),
      ];
    case 'warm':
      return [
        byLocale(locale, { sv: 'Det är inte officiellt, men någon tog ändå sig tid att ge dagen lite ryggrad.', en: 'It is not official, but someone still took the time to give the day a little backbone.', 'pt-BR': 'Nao e oficial, mas alguem ainda assim se deu ao trabalho de dar alguma espinha ao dia.' }),
        byLocale(locale, { sv: 'Kalendern fick något att hålla i och det gör faktiskt skillnad.', en: 'The calendar got something to hold on to, and that does make a difference.', 'pt-BR': 'O calendario ganhou algo em que se apoiar, e isso realmente faz diferenca.' }),
        byLocale(locale, { sv: 'Det här är kanske litet, men det gör dagen mindre tom och mer mänsklig.', en: 'This may be small, but it makes the day less empty and more human.', 'pt-BR': 'Talvez seja pequeno, mas deixa o dia menos vazio e mais humano.' }),
        byLocale(locale, { sv: 'Ingen stor institution behövde godkänna det här för att det skulle kännas rätt okej ändå.', en: 'No large institution had to approve this for it to feel fairly okay anyway.', 'pt-BR': 'Nao foi preciso aprovacao de grande instituicao nenhuma para isso parecer bem valido mesmo assim.' }),
      ];
    case 'chaotic':
      return [
        byLocale(locale, { sv: 'Det är inte officiellt, men tillräckligt många har tydligen kastat energi på datumet för att det ska börja låta som ett beslut.', en: 'It is not official, but enough people have clearly thrown energy at the date for it to start sounding like policy.', 'pt-BR': 'Nao e oficial, mas gente suficiente claramente atirou energia na data para isso comecar a soar como politica publica.' }),
        byLocale(locale, { sv: 'Kalendern fick något att jobba med och sprang genast iväg lite för fort med det.', en: 'The calendar got something to work with and immediately ran a little too fast with it.', 'pt-BR': 'O calendario recebeu algo com que trabalhar e imediatamente saiu correndo um pouco rapido demais com isso.' }),
        byLocale(locale, { sv: 'Det är löst sammanhållet, överentusiastiskt och ändå märkbart bättre än tomgång.', en: 'It is loosely assembled, overenthusiastic, and still noticeably better than idling.', 'pt-BR': 'E frouxamente montado, entusiasmado demais e ainda assim bem melhor do que a marcha lenta.' }),
        byLocale(locale, { sv: 'Ingen regering står bakom det här, men någonstans står säkert en gruppchatt och hyperventilerar av stolthet.', en: 'No government stands behind this, but somewhere a group chat is certainly hyperventilating with pride.', 'pt-BR': 'Nenhum governo assina isso, mas em algum lugar um grupo de chat certamente esta hiperventilando de orgulho.' }),
      ];
    case 'absurd':
      return [
        byLocale(locale, { sv: 'Det är inte officiellt, men tillräckligt många människor tittade på datumet och gav det en märklig liten hatt.', en: 'It is not official, but enough people looked at the date and gave it a strange little hat.', 'pt-BR': 'Nao e oficial, mas gente suficiente olhou para a data e lhe deu um chapeuzinho esquisito.' }),
        byLocale(locale, { sv: 'Kalendern får arbeta med det material den har, och idag råkade materialet vara ovanligt specifikt.', en: 'The calendar works with the material available, and today the material happened to be unusually specific.', 'pt-BR': 'O calendario trabalha com o material disponivel, e hoje o material acabou sendo especifico demais.' }),
        byLocale(locale, { sv: 'Det här är smalt, löst sammanhållet och ändå tillräckligt för att ge datumet ett ansiktsuttryck.', en: 'It is niche, loosely assembled, and still enough to give the date a facial expression.', 'pt-BR': 'E nichado, frouxamente montado e ainda assim suficiente para dar uma expressao facial a data.' }),
        byLocale(locale, { sv: 'Ingen regering står bakom det här, men världen blev ändå något mer detaljerad för en stund.', en: 'No government stands behind this, but the world still became slightly more detailed for a while.', 'pt-BR': 'Nenhum governo assina isso, mas o mundo ainda assim ficou um pouco mais detalhado por um momento.' }),
      ];
    default:
      return [
        byLocale(locale, { sv: 'Det är inte officiellt, men tillräckligt många har uppenbarligen bestämt sig för att göra något av det här datumet.', en: "It's not official, but clearly enough people decided this date deserved some sort of content.", 'pt-BR': 'Nao e oficial, mas claramente gente suficiente resolveu que essa data merecia algum conteudo.' }),
        byLocale(locale, { sv: 'Kalendern får arbeta med det material den har, och idag blev det ändå förvånansvärt dugligt.', en: 'The calendar has to work with the material available, and today it ended up with something surprisingly serviceable.', 'pt-BR': 'O calendario trabalha com o material que tem, e hoje saiu algo surpreendentemente aproveitavel.' }),
        byLocale(locale, { sv: 'Det här är inte statsbärande direkt, men absolut tillräckligt för att spela lite större än datumet först såg ut.', en: "This isn't exactly state-bearing, but it's absolutely enough to make the date play slightly above its station.", 'pt-BR': 'Nao e exatamente assunto de Estado, mas basta para a data parecer ligeiramente mais importante do que parecia no inicio.' }),
        byLocale(locale, { sv: 'Ingen regering står bakom det här, men folk har ändå visat den goda smaken att fylla dagen med något märkbart.', en: "No government stands behind this, but people still had the good judgment to give the day some visible substance.", 'pt-BR': 'Nenhum governo assina isso, mas alguem ao menos teve o bom senso de dar algum corpo ao dia.' }),
        byLocale(locale, { sv: 'Det är smalt, löst sammanhållet och fullt tillräckligt för att ge datumet någon sorts ryggrad.', en: "It's niche, loosely assembled, and still more than enough to give the date some kind of spine.", 'pt-BR': 'E nichado, meio frouxo e ainda assim suficiente para dar alguma espinha dorsal a data.' }),
        byLocale(locale, { sv: 'Officiellt är det tunt. Inofficiellt är det ändå nog för att låta dagen slippa total förnedring.', en: "Officially it's thin. Unofficially it's enough to spare the day total humiliation.", 'pt-BR': 'Oficialmente e pouco. Extraoficialmente ja basta para poupar o dia da humilhacao completa.' }),
        byLocale(locale, { sv: 'Någon tog sig tid att ge dagen innehåll, och det vore småaktigt att inte arbeta vidare på det.', en: 'Someone took the trouble to give the day some content, and it would be petty not to build on that.', 'pt-BR': 'Alguem se deu ao trabalho de dar algum conteudo ao dia, e seria mesquinho nao aproveitar isso.' }),
        byLocale(locale, { sv: 'Det här får duga som folkligt initiativ. Inte majestätiskt, men klart bättre än kalendermässig öken.', en: 'This will do as a piece of public initiative. Not majestic, but clearly better than calendar desert.', 'pt-BR': 'Serve como iniciativa popular. Nada majestoso, mas nitidamente melhor do que um deserto de calendario.' }),
      ];
  }
}
