import { Locale } from './locale';

export const ordinaryThemeDayTitleEndingsByLocale: Record<Locale, string[]> = {
  sv: [
    'Det får väl bära dagen då.',
    'Det är åtminstone något att skylla på.',
    'Ingen i organisationen var stark nog att stoppa det.',
    'Det är mer än kalendern brukar erbjuda.',
    'Det blir inte bättre än så här idag.',
    'Det får duga som dagens professionella ursäkt.',
    'Vi tar det och går vidare.',
    'Det är i alla fall bättre än ren tomhet.',
  ],
  en: [
    'That will have to carry the day, then.',
    "At least it's something to blame it on.",
    'Nobody in the organization was strong enough to stop it.',
    "It's more than the calendar usually offers.",
    "This is about as good as today's getting.",
    "It'll do as today's professional excuse.",
    "We'll take it and move on.",
    "It's still better than pure emptiness.",
  ],
  'pt-BR': [
    'Vai ter que sustentar o dia, então.',
    'Pelo menos já existe algo em que pôr a culpa.',
    'Ninguém na organização teve força para impedir.',
    'É mais do que o calendário costuma oferecer.',
    'Hoje não vai ficar melhor do que isso.',
    'Serve como desculpa profissional do dia.',
    'A gente aceita e segue em frente.',
    'Ainda é melhor do que vazio absoluto.',
  ],
};

export const ordinaryThemeDayCardNotesByLocale: Record<Locale, string[]> = {
  sv: [
    'Det är ingen officiell svensk högtidsdag, men tillräckligt många har uppenbarligen bestämt sig för att göra något av det här datumet.',
    'Kalendern får arbeta med det material den har, och idag blev det ändå förvånansvärt dugligt.',
    'Det här är inte statsbärande direkt, men absolut tillräckligt för att spela lite större än datumet först såg ut.',
    'Ingen regering står bakom det här, men folk har ändå visat den goda smaken att fylla dagen med något märkbart.',
    'Det är smalt, löst sammanhållet och fullt tillräckligt för att ge datumet någon sorts ryggrad.',
    'Officiellt är det tunt. Inofficiellt är det ändå nog för att låta dagen slippa total förnedring.',
    'Någon tog sig tid att ge dagen innehåll, och det vore småaktigt att inte arbeta vidare på det.',
    'Det här får duga som folkligt initiativ. Inte majestätiskt, men klart bättre än kalendermässig öken.',
  ],
  en: [
    "It's not an official Swedish holiday, but clearly enough people decided this date deserved some sort of content.",
    'The calendar has to work with the material available, and today it ended up with something surprisingly serviceable.',
    "This isn't exactly state-bearing, but it's absolutely enough to make the date play slightly above its station.",
    "No government stands behind this, but people still had the good judgment to give the day some visible substance.",
    "It's niche, loosely assembled, and still more than enough to give the date some kind of spine.",
    "Officially it's thin. Unofficially it's enough to spare the day total humiliation.",
    'Someone took the trouble to give the day some content, and it would be petty not to build on that.',
    "This will do as a piece of public initiative. Not majestic, but clearly better than calendar desert.",
  ],
  'pt-BR': [
    'Não é um feriado oficial sueco, mas claramente gente suficiente resolveu que essa data merecia algum conteúdo.',
    'O calendário trabalha com o material que tem, e hoje saiu algo surpreendentemente aproveitável.',
    'Não é exatamente assunto de Estado, mas basta para a data parecer ligeiramente mais importante do que parecia no início.',
    'Nenhum governo assina isso, mas alguém ao menos teve o bom senso de dar algum corpo ao dia.',
    'É nichado, meio frouxo e ainda assim suficiente para dar alguma espinha dorsal à data.',
    'Oficialmente é pouco. Extraoficialmente já basta para poupar o dia da humilhação completa.',
    'Alguém se deu ao trabalho de dar algum conteúdo ao dia, e seria mesquinho não aproveitar isso.',
    'Serve como iniciativa popular. Nada majestoso, mas nitidamente melhor do que um deserto de calendário.',
  ],
};

export const appText: Record<
  Locale,
  {
    languageMenuLabel: string;
    darkMode: string;
    lightMode: string;
    eyebrow: string;
    title: string;
    lede: string;
    pickDate: string;
    surpriseAction: string;
    surpriseHint: string;
    installApp: string;
    installHint: string;
    moodLabel: string;
    nameday: string;
    namedayLoading: string;
    namedayError: string;
    namedayNone: string;
    weeklyHoliday: string;
    nowCard: string;
    upcoming: string;
    collapseShow: string;
    collapseHide: string;
    mobileWeeklyHolidaySummary: string;
    mobileSeasonSummary: (count: number) => string;
    mobileUpcomingSummary: (count: number) => string;
    mobileExtraThemeDaysSummary: (count: number) => string;
    mobileWorldDaysSummary: (count: number) => string;
    worldNationalDays: string;
    worldNationalDaysBadge: string;
    worldNationalDaysMore: (count: number) => string;
    buildInfoLabel: string;
    releaseNotesLabel: string;
    releaseNotesTitle: string;
    releaseNotesOpen: string;
    imageCredits: string;
    themeDaySource: string;
    namedaySource: string;
    publicApiLink: string;
    calendarExportLink: string;
    shareLabel: string;
    shareLead: string;
    shareOpen: string;
    shareCopy: string;
    shareCard: string;
    shareCopied: string;
    celebrationStatsLabel: string;
    celebrationStatsTitle: string;
    celebrationStatsBusiestMonth: (month: string, count: number) => string;
    celebrationStatsTopCategory: (category: string, count: number) => string;
    celebrationStatsTotalDays: (count: number) => string;
    celebrationStatsTopDates: string;
    previousDay: string;
    nextDay: string;
    reroll: string;
    blurbLoading: string;
    unofficialThemeDay: string;
    unofficialThemeDays: (count: number) => string;
    noOfficialEnergy: string;
    ordinaryTitle: string;
    extraThemeDays: string;
    asIfThatWasNotEnough: (leadDay: string, days: string) => string;
    noImageBadge: string;
    noImageTitle: string;
    noImageBody: string;
    todayThemeDays: string;
    noHit: string;
    ordinaryThemeDayLead: (days: string, note: string) => string;
    ordinaryNoHitBody: string;
    close: string;
    creditsEyebrow: string;
    creditsTitle: string;
    creditsLead: string;
    creator: string;
    license: string;
    source: string;
    commonsFilePage: string;
    upcomingTomorrow: string;
    upcomingInDays: (days: number) => string;
    seasonLabel: string;
    dateNavigationAria: string;
    untilLabel: string;
  }
> = {
  sv: {
    languageMenuLabel: 'Språk',
    darkMode: 'Mörkt läge',
    lightMode: 'Ljust läge',
    eyebrow: 'Svensk kalenderlogik',
    title: 'Vad kan man fira?',
    lede:
      'Välj ett datum och låt appen avgöra om dagen förtjänar flaggor, bakverk, högtidston eller bara ett torrt konstaterande av kalenderns begränsningar.',
    pickDate: 'Välj datum',
    surpriseAction: 'Överraska mig',
    surpriseHint: 'Hoppa till nästa datum som faktiskt bär sig med lite självförtroende.',
    installApp: 'Installera appen',
    installHint: 'Spara Vad kan man fira? på hemskärmen för snabbare vardagsbruk.',
    moodLabel: 'Ton',
    nameday: 'Dagens namnsdag',
    namedayLoading: 'Laddar namnsdag från öppet API.',
    namedayError:
      'Namnsdag gick inte att hämta just nu. Internet måste förstås också vilja samarbeta.',
    namedayNone: 'Ingen namnsdag registrerad för datumet.',
    weeklyHoliday: 'Veckans helgdag',
    nowCard: 'Säsongen pågår',
    upcoming: 'På gång',
    collapseShow: 'Visa',
    collapseHide: 'Dölj',
    mobileWeeklyHolidaySummary: 'Veckans helgdag',
    mobileSeasonSummary: (count: number) => `Säsonger just nu${count > 1 ? ` (${count})` : ''}`,
    mobileUpcomingSummary: (count: number) => `På gång${count > 1 ? ` (${count})` : ''}`,
    mobileExtraThemeDaysSummary: (count: number) =>
      `Fler temadagar${count > 1 ? ` (${count})` : ''}`,
    mobileWorldDaysSummary: (count: number) =>
      `Nationaldagar ute i världen${count > 1 ? ` (${count})` : ''}`,
    worldNationalDays: 'Nationaldagar ute i världen',
    worldNationalDaysBadge: 'Också idag',
    worldNationalDaysMore: (count: number) => `Och ${count} till.`,
    buildInfoLabel: 'Bygge',
    releaseNotesLabel: 'Nytt i versionen',
    releaseNotesTitle: 'Det här har ändrats i appen',
    releaseNotesOpen: 'Visa alla ändringar',
    imageCredits: 'Bildkällor',
    themeDaySource: 'Temadagar inspirerade av temadagar.se',
    namedaySource: 'Namnsdagar via sholiday.faboul.se',
    publicApiLink: 'Publikt API',
    calendarExportLink: 'Kalenderexport (.ics)',
    shareLabel: 'Dela vidare',
    shareLead: 'Skicka vidare dagens dom med en länk som ser ut att mena allvar.',
    shareOpen: 'Skicka vidare',
    shareCopy: 'Kopiera länk',
    shareCard: 'Öppna delkort',
    shareCopied: 'Länk kopierad.',
    celebrationStatsLabel: 'Året i korthet',
    celebrationStatsTitle: 'Firarstatistik',
    celebrationStatsBusiestMonth: (month: string, count: number) =>
      `${month} bär mest med ${count} firardagar.`,
    celebrationStatsTopCategory: (category: string, count: number) =>
      `${category} leder med ${count} dagar.`,
    celebrationStatsTotalDays: (count: number) => `${count} dagar i år har egen firardag.`,
    celebrationStatsTopDates: 'Toppdatum',
    previousDay: 'Föregående dag',
    nextDay: 'Nästa dag',
    reroll: 'Ny ursäkt',
    blurbLoading: 'Hämtar dagens text.',
    unofficialThemeDay: 'Inofficiell temadag',
    unofficialThemeDays: (count: number) => `Inofficiella temadagar x${count}`,
    noOfficialEnergy: 'Ingen officiell stordådskänsla',
    ordinaryTitle: 'En vanlig dag. Så sorgligt är det.',
    extraThemeDays: 'Fler temadagar idag',
    asIfThatWasNotEnough: (leadDay: string, days: string) =>
      `Som om ${leadDay.toLowerCase()} inte räckte, så pågår även ${days} i bakgrunden.`,
    noImageBadge: 'Bildfri zon',
    noImageTitle: 'Det här firandet får bära sig självt utan fotobevis.',
    noImageBody:
      'Ingen bild finns än, men dagen försöker i alla fall inte se tom ut längre.',
    todayThemeDays: 'Dagens temadagar',
    noHit: 'Ingen träff',
    ordinaryThemeDayLead: (days: string, note: string) =>
      `Temadagsmotorn hittade ${days}. ${note}`,
    ordinaryNoHitBody:
      'Datumet har kollats. Systemet fann ingen semla, ingen sill, ingen bullplikt och ingen kollektiv ursäkt för att tappa fokus.',
    close: 'Stäng',
    creditsEyebrow: 'Bildkällor',
    creditsTitle: 'Wikimedia Commons-credits',
    creditsLead:
      'De nedladdade Commons-bilderna är publikt krediterade här med skapare, källsida och licens. Bilderna i appen är nedskalade versioner.',
    creator: 'Skapare',
    license: 'Licens',
    source: 'Källa',
    commonsFilePage: 'Commons-filsida',
    upcomingTomorrow: 'I morgon',
    upcomingInDays: (days: number) => `Om ${days} dagar`,
    seasonLabel: 'Säsong',
    dateNavigationAria: 'Datumnavigering',
    untilLabel: 'till',
  },
  en: {
    languageMenuLabel: 'Language',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    eyebrow: 'Swedish calendar logic',
    title: 'What can one celebrate?',
    lede:
      'Pick a date and let the app decide whether it calls for flags, pastries, ceremonial energy, or just a dry acknowledgement of the calendar’s limitations.',
    pickDate: 'Choose date',
    surpriseAction: 'Surprise me',
    surpriseHint: 'Jump to the next date that carries itself with some confidence.',
    installApp: 'Install app',
    installHint: 'Add What can one celebrate? to your home screen for quicker daily use.',
    moodLabel: 'Tone',
    nameday: "Today's name day",
    namedayLoading: 'Loading name day from the open API.',
    namedayError:
      'The name day lookup failed for now. The internet, naturally, also has to feel like cooperating.',
    namedayNone: 'No registered name day for this date.',
    weeklyHoliday: "This week's holiday",
    nowCard: 'Season in progress',
    upcoming: 'Coming up',
    collapseShow: 'Show',
    collapseHide: 'Hide',
    mobileWeeklyHolidaySummary: "This week's holiday",
    mobileSeasonSummary: (count: number) => `Current seasons${count > 1 ? ` (${count})` : ''}`,
    mobileUpcomingSummary: (count: number) => `Coming up${count > 1 ? ` (${count})` : ''}`,
    mobileExtraThemeDaysSummary: (count: number) =>
      `More theme days${count > 1 ? ` (${count})` : ''}`,
    mobileWorldDaysSummary: (count: number) =>
      `National days elsewhere${count > 1 ? ` (${count})` : ''}`,
    worldNationalDays: 'National days elsewhere today',
    worldNationalDaysBadge: 'Also today',
    worldNationalDaysMore: (count: number) => `And ${count} more.`,
    buildInfoLabel: 'Build',
    releaseNotesLabel: 'New in this version',
    releaseNotesTitle: 'What changed in the app',
    releaseNotesOpen: 'Show all changes',
    imageCredits: 'Image credits',
    themeDaySource: 'Theme days inspired by temadagar.se',
    namedaySource: 'Name days via sholiday.faboul.se',
    publicApiLink: 'Public API',
    calendarExportLink: 'Calendar export (.ics)',
    shareLabel: 'Share it onward',
    shareLead: 'Send the verdict onward with a share link that feels like it means it.',
    shareOpen: 'Send it on',
    shareCopy: 'Copy link',
    shareCard: 'Open share card',
    shareCopied: 'Link copied.',
    celebrationStatsLabel: 'Year at a glance',
    celebrationStatsTitle: 'Celebration stats',
    celebrationStatsBusiestMonth: (month: string, count: number) =>
      `${month} carries the most weight with ${count} celebration days.`,
    celebrationStatsTopCategory: (category: string, count: number) =>
      `${category} leads with ${count} days.`,
    celebrationStatsTotalDays: (count: number) =>
      `${count} days this year have their own celebration.`,
    celebrationStatsTopDates: 'Top dates',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    reroll: 'New excuse',
    blurbLoading: "Fetching today's copy.",
    unofficialThemeDay: 'Unofficial theme day',
    unofficialThemeDays: (count: number) => `Unofficial theme days x${count}`,
    noOfficialEnergy: 'No official sense of occasion',
    ordinaryTitle: 'Just an ordinary day. Grim stuff.',
    extraThemeDays: 'More theme days today',
    asIfThatWasNotEnough: (leadDay: string, days: string) =>
      `As if ${leadDay.toLowerCase()} was not enough, ${days} is also rattling around in the background.`,
    noImageBadge: 'Image-free zone',
    noImageTitle: 'This celebration will have to carry itself without photographic proof.',
    noImageBody:
      "There isn't an image yet, but at least the day no longer has to sit there looking empty.",
    todayThemeDays: "Today's theme days",
    noHit: 'No hit',
    ordinaryThemeDayLead: (days: string, note: string) =>
      `The theme-day engine found ${days}. ${note}`,
    ordinaryNoHitBody:
      'The date has been checked. The system found no semla, no herring, no bun obligation, and no collective excuse to lose focus.',
    close: 'Close',
    creditsEyebrow: 'Image credits',
    creditsTitle: 'Wikimedia Commons credits',
    creditsLead:
      'Downloaded Commons images are publicly credited here with creator, source page, and license. The versions in the app are downscaled.',
    creator: 'Creator',
    license: 'License',
    source: 'Source',
    commonsFilePage: 'Commons file page',
    upcomingTomorrow: 'Tomorrow',
    upcomingInDays: (days: number) => `In ${days} days`,
    seasonLabel: 'Season',
    dateNavigationAria: 'Date navigation',
    untilLabel: 'until',
  },
  'pt-BR': {
    languageMenuLabel: 'Idioma',
    darkMode: 'Modo escuro',
    lightMode: 'Modo claro',
    eyebrow: 'Lógica sueca de calendário',
    title: 'O que se pode comemorar?',
    lede:
      'Escolha uma data e deixe o app decidir se o dia merece bandeiras, doces, solenidade ou apenas um comentário seco sobre as limitações do calendário.',
    pickDate: 'Escolher data',
    surpriseAction: 'Me surpreenda',
    surpriseHint: 'Vá para a próxima data que consiga se sustentar com alguma convicção.',
    installApp: 'Instalar app',
    installHint: 'Adicione o app à tela inicial para consultar o calendário com menos fricção.',
    moodLabel: 'Tom',
    nameday: 'Nome do dia',
    namedayLoading: 'Carregando nome do dia pela API aberta.',
    namedayError:
      'Não foi possível buscar o nome do dia agora. A internet, naturalmente, também precisa querer colaborar.',
    namedayNone: 'Nenhum nome do dia registrado para esta data.',
    weeklyHoliday: 'Feriado da semana',
    nowCard: 'Temporada em curso',
    upcoming: 'A caminho',
    collapseShow: 'Mostrar',
    collapseHide: 'Ocultar',
    mobileWeeklyHolidaySummary: 'Feriado da semana',
    mobileSeasonSummary: (count: number) => `Temporadas agora${count > 1 ? ` (${count})` : ''}`,
    mobileUpcomingSummary: (count: number) => `A caminho${count > 1 ? ` (${count})` : ''}`,
    mobileExtraThemeDaysSummary: (count: number) =>
      `Mais datas temáticas${count > 1 ? ` (${count})` : ''}`,
    mobileWorldDaysSummary: (count: number) =>
      `Datas nacionais pelo mundo${count > 1 ? ` (${count})` : ''}`,
    worldNationalDays: 'Datas nacionais pelo mundo hoje',
    worldNationalDaysBadge: 'Também hoje',
    worldNationalDaysMore: (count: number) => `E mais ${count}.`,
    buildInfoLabel: 'Build',
    releaseNotesLabel: 'Novo nesta versão',
    releaseNotesTitle: 'O que mudou no app',
    releaseNotesOpen: 'Mostrar todas as mudanças',
    imageCredits: 'Créditos das imagens',
    themeDaySource: 'Datas temáticas inspiradas em temadagar.se',
    namedaySource: 'Nomes do dia via sholiday.faboul.se',
    publicApiLink: 'API pública',
    calendarExportLink: 'Exportar calendário (.ics)',
    shareLabel: 'Compartilhar',
    shareLead: 'Envie o veredito do dia com um link que pareça ter sido feito de propósito.',
    shareOpen: 'Enviar adiante',
    shareCopy: 'Copiar link',
    shareCard: 'Abrir cartão',
    shareCopied: 'Link copiado.',
    celebrationStatsLabel: 'O ano em resumo',
    celebrationStatsTitle: 'Estatísticas de celebração',
    celebrationStatsBusiestMonth: (month: string, count: number) =>
      `${month} carrega mais peso com ${count} dias de celebração.`,
    celebrationStatsTopCategory: (category: string, count: number) =>
      `${category} lidera com ${count} dias.`,
    celebrationStatsTotalDays: (count: number) =>
      `${count} dias deste ano têm sua própria celebração.`,
    celebrationStatsTopDates: 'Datas em destaque',
    previousDay: 'Dia anterior',
    nextDay: 'Próximo dia',
    reroll: 'Nova desculpa',
    blurbLoading: 'Buscando o texto do dia.',
    unofficialThemeDay: 'Data temática não oficial',
    unofficialThemeDays: (count: number) => `Datas temáticas não oficiais x${count}`,
    noOfficialEnergy: 'Nenhum senso oficial de ocasião',
    ordinaryTitle: 'Só um dia comum. Triste, mas é isso.',
    extraThemeDays: 'Mais datas temáticas hoje',
    asIfThatWasNotEnough: (leadDay: string, days: string) =>
      `Como se ${leadDay.toLowerCase()} não bastasse, ${days} também está rondando a data ao fundo.`,
    noImageBadge: 'Zona sem imagem',
    noImageTitle: 'Essa comemoração vai ter que se sustentar sem prova fotográfica.',
    noImageBody: 'Ainda não existe imagem, mas pelo menos o dia não precisa mais ficar parecendo vazio.',
    todayThemeDays: 'Datas temáticas de hoje',
    noHit: 'Nenhum acerto',
    ordinaryThemeDayLead: (days: string, note: string) =>
      `O motor de datas temáticas encontrou ${days}. ${note}`,
    ordinaryNoHitBody:
      'A data foi verificada. O sistema não encontrou semla, arenque, obrigação de bolo nem desculpa coletiva para perder o foco.',
    close: 'Fechar',
    creditsEyebrow: 'Créditos das imagens',
    creditsTitle: 'Créditos do Wikimedia Commons',
    creditsLead:
      'As imagens baixadas do Commons são creditadas publicamente aqui com autor, página de origem e licença. As versões no app foram reduzidas.',
    creator: 'Autor',
    license: 'Licença',
    source: 'Fonte',
    commonsFilePage: 'Página do arquivo no Commons',
    upcomingTomorrow: 'Amanhã',
    upcomingInDays: (days: number) => `Em ${days} dias`,
    seasonLabel: 'Temporada',
    dateNavigationAria: 'Navegação de datas',
    untilLabel: 'até',
  },
};
