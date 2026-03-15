import { Locale } from './locale';

export type ReleaseNote = {
  version: string;
  shortSummary: Record<Locale, string>;
  summary: Record<Locale, string>;
};

export const releaseNotes: ReleaseNote[] = [
  {
    version: '0.1.25',
    shortSummary: {
      sv: 'Trasiga specialtecken är fixade och mörka knappar går lättare att läsa.',
      en: 'Broken characters are fixed and dark buttons are easier to read.',
      'pt-BR': 'Os caracteres quebrados foram corrigidos e os botões escuros ficaram mais legíveis.',
    },
    summary: {
      sv: 'Den senaste versionsnotisen visade trasiga tecken i stället för å, ä och ö, och mörkt läge hade fortfarande vissa knappar och badges som blev för svåra att läsa i de mörkare stämningarna. Det är nu rättat, så både versionsnytt och de mörka knappytorna går att läsa som normalt igen.',
      en: 'The latest release note showed broken characters instead of proper accented text, and dark mode still had some buttons and badges that became too hard to read in the darker moods. That is now fixed, so both the changelog and those darker button surfaces read normally again.',
      'pt-BR': 'A última nota de versão mostrava caracteres quebrados no lugar dos acentos corretos, e o modo escuro ainda tinha alguns botões e badges difíceis de ler nos tons mais escuros. Isso foi corrigido, então tanto o changelog quanto essas superfícies escuras voltaram a ficar legíveis.',
    },
  },
  {
    version: '0.1.24',
    shortSummary: {
      sv: 'Koden är bättre uppdelad och mörkt läge är lättare att läsa.',
      en: 'The code is better organized and dark mode is easier to read.',
      'pt-BR': 'O código está melhor organizado e o modo escuro ficou mais fácil de ler.',
    },
    summary: {
      sv: 'Frontendkoden är nu sorterad tydligare efter område, så AI, temadagar, nationaldagar, namnsdagar och kommande datum ligger samlade i egna delar i stället för att ligga utspridda i en platt mapp. Samtidigt har mörkt läge fått tydligare kontrast i knappar, badges och små etiketter som Firardag, så det viktiga innehållet blir lättare att läsa utan att appens ton försvinner.',
      en: 'The frontend code is now grouped more clearly by area, so AI, theme days, national days, name days, and upcoming dates live in their own sections instead of a flat pile. At the same time, dark mode has better contrast in buttons, badges, and smaller labels like Celebration, so the important UI is easier to read without losing the app’s tone.',
      'pt-BR': 'O código do frontend agora está agrupado de forma mais clara por área, para que IA, datas temáticas, datas nacionais, nomes do dia e próximas datas fiquem em suas próprias seções em vez de um monte plano. Ao mesmo tempo, o modo escuro ganhou melhor contraste em botões, badges e pequenas etiquetas como Comemoração, deixando a interface mais legível sem perder o clima do app.',
    },
  },
  {
    version: '0.1.23',
    shortSummary: {
      sv: 'Mörkt läge har fått tydligare kontrast i knappar och etiketter.',
      en: 'Dark mode now has clearer contrast in buttons and labels.',
      'pt-BR': 'O modo escuro agora tem contraste mais claro em botões e etiquetas.',
    },
    summary: {
      sv: 'Mörkt läge använder nu ljusare accentfärger där text faktiskt måste gå att läsa, som i knappar, badges och små etiketter. Resultatet är att appen fortfarande känns som samma stämning, men utan att viktiga delar blir grumliga eller svåra att urskilja.',
      en: 'Dark mode now uses brighter accent text where people actually need to read it, such as buttons, badges, and small labels. The app still keeps the same mood, but important UI details are no longer muddy or hard to pick out.',
      'pt-BR': 'O modo escuro agora usa textos de destaque mais claros onde as pessoas realmente precisam ler, como em botões, badges e pequenas etiquetas. O app continua com o mesmo clima, mas sem deixar partes importantes confusas ou difíceis de enxergar.',
    },
  },
  {
    version: '0.1.22',
    shortSummary: {
      sv: 'Mobilvyn väntar nu med scroll tills datumväljaren faktiskt stängs.',
      en: 'Mobile now waits to scroll until the date picker actually closes.',
      'pt-BR': 'No celular, o app só rola depois que o seletor de data realmente fecha.',
    },
    summary: {
      sv: 'När du byter datum på mobil hoppar appen inte längre direkt medan datumväljaren fortfarande är öppen. Scrollen sker först när datumfältet faktiskt bekräftas och stängs, vilket känns lugnare och mindre ryckigt.',
      en: 'When you change the date on mobile, the app no longer jumps away while the date picker is still open. It now scrolls only after the field is actually confirmed and closed, which feels calmer and less jarring.',
      'pt-BR': 'Ao trocar a data no celular, o app não pula mais enquanto o seletor ainda está aberto. A rolagem agora só acontece depois que o campo é realmente confirmado e fechado, deixando tudo mais calmo e menos brusco.',
    },
  },
  {
    version: '0.1.21',
    shortSummary: {
      sv: 'På gång har flyttat till högersidan och footern ligger lägre.',
      en: 'Upcoming dates moved to the right side and the footer now sits lower.',
      'pt-BR': 'O bloco de próximas datas foi para a direita e o rodapé agora fica mais baixo.',
    },
    summary: {
      sv: 'På gång ligger nu i en egen panel på högersidan under Också idag, så vänsterspalten kan fokusera på val och snabb överblick. Samtidigt ligger källor, versionsnytt och bygge längre ner och följer helheten bättre i layouten.',
      en: 'Upcoming dates now live in their own panel on the right side below Also today, so the left column can focus on controls and quick context. At the same time, sources, release notes, and build info sit lower and follow the overall layout more naturally.',
      'pt-BR': 'As próximas datas agora ficam em seu próprio painel à direita, abaixo de Também hoje, para a coluna da esquerda focar nos controles e no contexto rápido. Ao mesmo tempo, fontes, novidades da versão e build ficaram mais embaixo e acompanham melhor o layout.',
    },
  },
  {
    version: '0.1.20',
    shortSummary: {
      sv: 'Versionsinfo flyttad till huvudkortet och mobil datumväljare hoppar rätt.',
      en: 'Version info moved to the main card and the mobile date picker now jumps back correctly.',
      'pt-BR': 'As informações de versão foram para o cartão principal e o seletor de data no celular agora volta para o lugar certo.',
    },
    summary: {
      sv: 'Bygge, Bildkällor och versionsnytt ligger nu längst ner i huvudkortet i stället för att ta plats i vänsterspalten. På mobil scrollar appen också tillbaka till huvudkortet när du bekräftar ett nytt datum, så resultatet hamnar direkt där blicken borde vara.',
      en: 'Build info, Image credits, and version notes now live at the bottom of the main card instead of taking space in the left column. On mobile, the app also scrolls back to the main card after you confirm a new date so the result appears where your attention should be.',
      'pt-BR': 'As informações de build, os créditos das imagens e as notas da versão agora ficam no rodapé do cartão principal em vez de ocupar espaço na coluna da esquerda. No celular, o app também volta para o cartão principal depois que você confirma uma nova data, para que o resultado apareça exatamente onde deveria.',
    },
  },
  {
    version: '0.1.19',
    shortSummary: {
      sv: 'Fler temadagar har fått mer egen röst och mindre generisk text.',
      en: 'More theme days now have their own voice instead of generic copy.',
      'pt-BR': 'Mais datas temáticas agora têm voz própria em vez de texto genérico.',
    },
    summary: {
      sv: 'Flera tydliga temadagar, som Saint Patrick’s day, Rocka sockorna-dagen, Kanelbullens dag och Nobeldagen, har fått mer egen och mer minnesvärd text. Resultatet är att “Ny ursäkt” oftare känns som att den faktiskt hör till just den dagen i stället för att låta som en allmän temadagsmall.',
      en: 'Several standout theme days, such as Saint Patrick’s Day, Rock Your Socks Day, Cinnamon Bun Day, and Nobel Day, now have more distinct and memorable writing. The result is that “New excuse” more often feels tied to that specific day instead of sounding like a generic theme-day template.',
      'pt-BR': 'Várias datas temáticas mais marcantes, como Saint Patrick’s Day, Rock Your Socks Day, Cinnamon Bun Day e Nobel Day, agora têm textos mais próprios e memoráveis. O resultado é que “Nova desculpa” parece com mais frequência algo realmente ligado àquele dia, em vez de soar como um modelo genérico.',
    },
  },
  {
    version: '0.1.18',
    shortSummary: {
      sv: 'Temadagar väljs nu mer vettigt när flera krockar samma dag.',
      en: 'Theme days are now chosen more sensibly when several land on the same date.',
      'pt-BR': 'As datas temáticas agora são escolhidas de forma mais sensata quando várias caem no mesmo dia.',
    },
    summary: {
      sv: 'Appen använder inte längre rå ordning från källdatan när flera temadagar delar datum. I stället görs en enklare redaktionell bedömning, så dagar som Rocka sockorna-dagen, vårdagjämningen och Star wars-dagen oftare får leda när de faktiskt känns mest relevanta eller roliga.',
      en: 'The app no longer follows raw source order when several theme days share the same date. Instead it makes a lighter editorial choice, so days like Rock Your Socks Day, the spring equinox, and Star Wars Day are more likely to lead when they are clearly the most relevant or fun option.',
      'pt-BR': 'O app não segue mais a ordem bruta da fonte quando várias datas temáticas compartilham o mesmo dia. Em vez disso, ele faz uma escolha editorial simples, para que datas como Rock Your Socks Day, o equinócio da primavera e Star Wars Day apareçam primeiro quando fizerem mais sentido ou forem mais divertidas.',
    },
  },
  {
    version: '0.1.17',
    shortSummary: {
      sv: 'Renare styling och lugnare rubriker i appen.',
      en: 'Cleaner styling and calmer headings across the app.',
      'pt-BR': 'Estilo mais limpo e títulos mais calmos em todo o app.',
    },
    summary: {
      sv: 'Stilarna i appen har delats upp tydligare i teman, layout, innehåll, rörelse och mobilanpassning. Samtidigt har de största rubrikerna tonats ner lite, så sidan känns mer balanserad och mindre som en gammal portal med allt uppskruvat på max.',
      en: 'The app styles are now split more clearly into themes, layout, content, motion, and responsive rules. At the same time, the biggest headings have been toned down so the page feels more balanced and less like an old portal with everything turned up to full volume.',
      'pt-BR': 'Os estilos do app agora estão divididos de forma mais clara em tema, layout, conteúdo, movimento e regras responsivas. Ao mesmo tempo, os maiores títulos foram reduzidos um pouco, para a página ficar mais equilibrada e menos com cara de portal antigo com tudo no máximo.',
    },
  },
  {
    version: '0.1.16',
    shortSummary: {
      sv: 'Mobilvyn sitter bättre och appkoden är uppstädad.',
      en: 'The mobile view fits better and the app code is cleaner.',
      'pt-BR': 'A visualização no celular ficou melhor e o código do app está mais limpo.',
    },
    summary: {
      sv: 'Mobilvyn trycker inte längre ut navigering, rubriker och blurbar utanför kortet på små skärmar. Samtidigt har App-komponenten delats upp i tydligare hjälpfiler och hooks så det är lättare att ändra appen utan att allt bor i en enda jättestor fil.',
      en: 'The mobile view no longer pushes navigation, titles, and blurbs outside the card on small screens. At the same time, the App component has been split into clearer helpers and hooks so the app is easier to change without everything living in one giant file.',
      'pt-BR': 'A visualização no celular não empurra mais navegação, títulos e blurbs para fora do cartão em telas pequenas. Ao mesmo tempo, o componente App foi dividido em helpers e hooks mais claros, para facilitar mudanças sem deixar tudo em um único arquivo gigante.',
    },
  },
  {
    version: '0.1.15',
    shortSummary: {
      sv: 'AI-varianter fylls nu lugnare och bara på riktig reroll.',
      en: 'AI variants now grow more slowly and only on real rerolls.',
      'pt-BR': 'As variantes de IA agora crescem mais devagar e só em rerolls de verdade.',
    },
    summary: {
      sv: 'Appen bygger inte längre upp flera AI-varianter automatiskt bara för att någon laddar samma dag flera gånger. Först sparas en variant, och fler skapas bara när du faktiskt trycker på Ny ursäkt. Det minskar onödiga AI-anrop och ger bättre kontroll över kvoten.',
      en: 'The app no longer builds multiple AI variants automatically just because the same day is loaded several times. It stores one variant first, and more are created only when you actually press New excuse. That cuts unnecessary AI calls and gives better quota control.',
      'pt-BR': 'O app não cria mais várias variantes de IA automaticamente só porque o mesmo dia foi carregado várias vezes. Primeiro ele salva uma variante, e novas só são criadas quando você realmente clica em Nova desculpa. Isso reduz chamadas desnecessárias à IA e dá mais controle sobre a cota.',
    },
  },
  {
    version: '0.1.14',
    shortSummary: {
      sv: 'Footer med versionsnytt och tydligare Bildkällor.',
      en: 'Footer release note and clearer Image credits.',
      'pt-BR': 'Resumo da versão no rodapé e Créditos das imagens mais claro.',
    },
    summary: {
      sv: 'Footern visar nu vad den senaste versionen faktiskt innehåller, och du kan öppna en historik över tidigare uppdateringar. Bildkällor ser också tydligare klickbar ut.',
      en: 'The footer now explains what the latest version actually contains, and you can open a history of earlier updates. Image credits also looks more clearly clickable.',
      'pt-BR': 'O rodapé agora explica o que a versão atual realmente traz e permite abrir um histórico de atualizações anteriores. Créditos das imagens também parece mais claramente clicável.',
    },
  },
  {
    version: '0.1.13',
    shortSummary: {
      sv: 'Gamla separata AI-funktionen är borttagen.',
      en: 'The old separate AI function is gone.',
      'pt-BR': 'A antiga função separada de IA foi removida.',
    },
    summary: {
      sv: 'Appen använder nu bara sin egen /api-väg för AI-texten. Den gamla separata Azure-funktionen är bortstädad, och dokumentationen följer den nya lösningen.',
      en: 'The app now uses only its own /api route for AI text. The old separate Azure function has been removed, and the docs now match the new setup.',
      'pt-BR': 'O app agora usa apenas sua própria rota /api para o texto de IA. A antiga função separada no Azure foi removida e a documentação foi ajustada ao novo caminho.',
    },
  },
  {
    version: '0.1.12',
    shortSummary: {
      sv: 'AI-texten går nu via appens egen Azure-väg.',
      en: 'AI text now uses the app’s own Azure route.',
      'pt-BR': 'O texto de IA agora usa a própria rota Azure do app.',
    },
    summary: {
      sv: 'AI-texten går nu via appens egen Azure-väg i stället för en separat publik funktionsadress. Det gör lösningen enklare och minskar beroendet av en fristående backendadress.',
      en: 'AI text now goes through the app’s own Azure route instead of a separate public function URL. That makes the setup simpler and reduces the app’s dependence on a standalone backend address.',
      'pt-BR': 'O texto de IA agora passa pela própria rota Azure do app em vez de uma URL pública separada. Isso deixa a solução mais simples e reduz a dependência de um endereço externo de backend.',
    },
  },
  {
    version: '0.1.11',
    shortSummary: {
      sv: 'Gammal AI-text försvinner direkt vid datum- eller tonbyte.',
      en: 'Old AI text disappears right away on date or tone change.',
      'pt-BR': 'O texto antigo da IA some na hora ao trocar data ou tom.',
    },
    summary: {
      sv: 'När datum eller ton ändras försvinner gammal AI-text direkt. Appen väntar nu på rätt svar i stället för att visa text som hör till ett annat läge.',
      en: 'When the date or tone changes, old AI text disappears right away. The app now waits for the correct response instead of showing text from the wrong state.',
      'pt-BR': 'Quando a data ou o tom mudam, o texto antigo da IA some na hora. O app agora espera a resposta certa em vez de mostrar texto do estado anterior.',
    },
  },
  {
    version: '0.1.10',
    shortSummary: {
      sv: 'Ingen tillfällig reservtext innan rätt blurb finns.',
      en: 'No temporary fallback text before the right blurb is ready.',
      'pt-BR': 'Sem texto provisório antes da blurb certa ficar pronta.',
    },
    summary: {
      sv: 'Appen visar inte längre en tillfällig reservtext som sedan byts ut när AI-svaret kommer. Den väntar i stället på rätt dagsblurb, så innehållet känns lugnare och mindre ryckigt.',
      en: 'The app no longer shows a temporary fallback text and then swaps it out when the AI response arrives. It now waits for the right daily blurb, which makes the content feel calmer and less jumpy.',
      'pt-BR': 'O app não mostra mais um texto provisório de reserva para depois trocá-lo quando a IA responde. Agora ele espera pela blurb certa do dia, o que deixa a experiência mais calma e menos brusca.',
    },
  },
  {
    version: '0.1.9',
    shortSummary: {
      sv: 'Svenska landsnamn och tydligare helgdagsförklaring.',
      en: 'Swedish country names and a clearer holiday explanation.',
      'pt-BR': 'Nomes de países em sueco e explicação mais clara sobre feriado.',
    },
    summary: {
      sv: 'Nationaldagar visas nu med svenska landsnamn i den svenska versionen. Texten förtydligar också att det inte handlar om en officiell svensk helgdag.',
      en: 'National days now show Swedish country names in the Swedish version. The text also makes clear that this is not an official Swedish holiday.',
      'pt-BR': 'As datas nacionais agora mostram nomes de países em sueco na versão sueca. O texto também deixa claro que isso não é um feriado oficial sueco.',
    },
  },
  {
    version: '0.1.8',
    shortSummary: {
      sv: 'Ton märks nu också i färg, form och rörelse.',
      en: 'Tone now also shows up in color, shape, and motion.',
      'pt-BR': 'O tom agora também aparece em cor, forma e movimento.',
    },
    summary: {
      sv: 'Den valda tonen märks nu bättre genom färg, form och rörelse i appen, inte bara i texten. Kort, paneler och detaljer har blivit tydligare kopplade till den stämning du valt.',
      en: 'The selected tone now shows up more clearly through color, shape, and motion in the app, not only in the text. Cards, panels, and details now match the mood more clearly.',
      'pt-BR': 'O tom escolhido agora aparece melhor por cor, forma e movimento no app, e não só no texto. Cartões, painéis e detalhes agora combinam melhor com o clima escolhido.',
    },
  },
  {
    version: '0.1.7',
    shortSummary: {
      sv: 'Du kan nu välja ton i appen.',
      en: 'You can now choose the app’s tone.',
      'pt-BR': 'Agora você pode escolher o tom do app.',
    },
    summary: {
      sv: 'Du kan nu välja ton för appens texter. Det påverkar både AI-texter och fler av appens egna formuleringar, så upplevelsen känns mer sammanhållen.',
      en: 'You can now choose a tone for the app’s writing. It affects both AI text and more of the app’s own copy, so the experience feels more consistent.',
      'pt-BR': 'Agora você pode escolher o tom dos textos do app. Isso afeta tanto o texto da IA quanto mais partes do próprio conteúdo do app, deixando a experiência mais coesa.',
    },
  },
  {
    version: '0.1.6',
    shortSummary: {
      sv: 'Frontend kopplades till AI-tjänsten.',
      en: 'The frontend was connected to the AI service.',
      'pt-BR': 'O frontend foi ligado ao serviço de IA.',
    },
    summary: {
      sv: 'Frontend kopplades till AI-tjänsten så att datum kan få smartare blurbar. Det här var steget där AI började påverka det som faktiskt visas i appen.',
      en: 'The frontend was connected to the AI service so dates can get smarter blurbs. This was the step where AI started affecting what the app actually shows.',
      'pt-BR': 'O frontend foi ligado ao serviço de IA para que as datas possam receber blurbs mais inteligentes. Foi aqui que a IA começou a afetar o que realmente aparece no app.',
    },
  },
  {
    version: '0.1.5',
    shortSummary: {
      sv: 'AI-flödet blev stabilare i drift.',
      en: 'The AI flow became more stable in production.',
      'pt-BR': 'O fluxo de IA ficou mais estável em produção.',
    },
    summary: {
      sv: 'AI-flödet fick en live-fix så att startproblem och konstiga tecken inte ställer till det. Kort sagt: mindre strul, färre märkliga tecken och bättre stabilitet.',
      en: 'The AI flow got a live fix so startup problems and odd text encoding do not get in the way. In short: less breakage, fewer weird characters, and better stability.',
      'pt-BR': 'O fluxo de IA recebeu uma correção em produção para que problemas na inicialização e textos estranhos não atrapalhem. Em resumo: menos falhas, menos caracteres esquisitos e mais estabilidade.',
    },
  },
  {
    version: '0.1.4',
    shortSummary: {
      sv: 'AI-blurbar började använda cache.',
      en: 'AI blurbs started using cache.',
      'pt-BR': 'As blurbs de IA passaram a usar cache.',
    },
    summary: {
      sv: 'AI-blurbar med cache började användas, så appen kan återanvända bra texter i stället för att skriva om allt varje gång. Det gjorde svaren snabbare och öppnade för en växande blurbbank.',
      en: 'Cached AI blurbs started being used, so the app can reuse good text instead of writing everything again every time. That made responses faster and opened the door to a growing blurb library.',
      'pt-BR': 'Blurbs de IA com cache começaram a ser usados, para o app reaproveitar bons textos em vez de gerar tudo de novo toda vez. Isso deixou as respostas mais rápidas e abriu caminho para uma biblioteca maior de blurbs.',
    },
  },
  {
    version: '0.1.3',
    shortSummary: {
      sv: 'Första versionen av AI-blurbar lades till.',
      en: 'The first version of AI blurbs was added.',
      'pt-BR': 'A primeira versão das blurbs de IA foi adicionada.',
    },
    summary: {
      sv: 'Första versionen av AI-blurbar lades till som ett nytt lager ovanpå de vanliga texterna. Appen kunde därmed börja skriva friare dagsformuleringar i stället för att bara använda fasta texter.',
      en: 'The first version of AI blurbs was added as a new layer on top of the regular text. The app could now start writing looser daily copy instead of relying only on fixed text.',
      'pt-BR': 'A primeira versão das blurbs de IA foi adicionada como uma nova camada por cima dos textos normais. O app passou a poder escrever textos mais livres para o dia, em vez de depender só de frases fixas.',
    },
  },
  {
    version: '0.1.2',
    shortSummary: {
      sv: 'Public och team fick egna ikoner.',
      en: 'Public and team got their own icons.',
      'pt-BR': 'Public e team ganharam seus próprios ícones.',
    },
    summary: {
      sv: 'Varje innehållspaket fick egna ikoner så att public och team känns tydligare åtskilda redan i webbläsaren. Det gjorde varianterna enklare att känna igen direkt.',
      en: 'Each content pack got its own icons so public and team feel more clearly separated right in the browser. That made the two variants easier to recognize at a glance.',
      'pt-BR': 'Cada pacote de conteúdo ganhou seus próprios ícones, para separar melhor as versões pública e de equipe já no navegador. Isso deixou as duas variantes mais fáceis de reconhecer de imediato.',
    },
  },
  {
    version: '0.1.1',
    shortSummary: {
      sv: 'Portugisiska nationaldagsrutan blev tydligare.',
      en: 'The Portuguese national-day panel became clearer.',
      'pt-BR': 'O painel de datas nacionais em português ficou mais claro.',
    },
    summary: {
      sv: 'Nationaldagsrutan förbättrades för portugisiska och blev tydligare även där. Det var en mindre ändring, men viktig för att språkvyn skulle kännas mindre halvfärdig.',
      en: 'The national-day panel was improved for Portuguese and became clearer there too. It was a smaller change, but important for making that language view feel less half-finished.',
      'pt-BR': 'O painel de datas nacionais foi melhorado em português e ficou mais claro também. Foi uma mudança menor, mas importante para a visão em português parecer menos incompleta.',
    },
  },
];

export function getReleaseNote(version: string): ReleaseNote | null {
  return releaseNotes.find((note) => note.version === version) ?? null;
}
