# Release Notes

Developer-owned release log for Fredagskoll and Vad kan man fira?.
This file is exported from `fredagskoll-frontend/src/releaseNotes.ts` and can be reused for changelog publishing.

## v0.1.32

- SV: Appen hjälper nu mer aktivt till att hitta bättre dagar att fira.
- EN: The app now helps you find better days to celebrate.
- PT-BR: O app agora ajuda melhor a encontrar dias mais interessantes para celebrar.

### Summary

- SV: Appen har fått ett överraskningsläge för att hoppa till mer firvärda datum, synliga kategorier för olika slags firardagar, en tydligare firarpoäng och en ny liten fika-panel som gör dagens anledning mer lekfull. Tanken är att det ska kännas roligare att utforska kalendern, inte bara slå upp ett datum och gå vidare.
- EN: The app now includes a surprise mode for jumping to more celebration-worthy dates, visible celebration categories, a clearer celebration score, and a small fika panel that makes the daily excuse more playful. The goal is to make exploring the calendar more fun instead of only checking a date and leaving.
- PT-BR: O app agora inclui um modo surpresa para pular para datas mais celebráveis, categorias visíveis para os tipos de celebração, uma pontuação mais clara e um pequeno painel de fika que deixa a desculpa do dia mais divertida. A ideia é tornar a exploração do calendário mais prazerosa, em vez de só consultar uma data e ir embora.
## v0.1.31

- SV: Frontendens verktygslåda kör nu på Vite i stället för CRA.
- EN: The frontend toolchain now runs on Vite instead of CRA.
- PT-BR: A base do frontend agora roda em Vite em vez de CRA.

### Summary

- SV: Frontendens bygg- och utvecklingsflöde kör nu på Vite i stället för Create React App. Det gör lokal utveckling snabbare, tar bort gammalt webpack-bagage och ger en renare väg framåt för appen utan att ändra hur själva produkten fungerar för användaren.
- EN: The frontend build and development flow now runs on Vite instead of Create React App. That makes local development faster, removes old webpack baggage, and gives the app a cleaner path forward without changing how the product itself works for users.
- PT-BR: O fluxo de build e desenvolvimento do frontend agora roda em Vite em vez de Create React App. Isso deixa o trabalho local mais rápido, remove o velho peso do webpack e dá ao app um caminho mais limpo daqui para frente sem mudar como o produto funciona para quem usa.
## v0.1.30

- SV: Påskhelgen har fått tydligare egen känsla över flera dagar i rad.
- EN: The Easter stretch now has a clearer identity across several consecutive days.
- PT-BR: O período da Páscoa agora tem uma identidade mais clara ao longo de vários dias seguidos.

### Summary

- SV: Påskhelgen känns nu mer genomtänkt som en sammanhängande följd i appen. Skärtorsdag, Långfredag, Påskafton, Påskdagen och Annandag påsk har fått egen text och egen plats i stället för att nästan allt fokus låg på bara Påskafton.
- EN: The Easter run now feels more intentional as a connected sequence in the app. Maundy Thursday, Good Friday, Easter Eve, Easter Sunday, and Easter Monday now have their own writing and their own place instead of nearly all the attention landing on Easter Eve alone.
- PT-BR: O período da Páscoa agora parece mais intencional como uma sequência conectada no app. Quinta-feira Santa, Sexta-feira Santa, Sábado de Aleluia, Domingo de Páscoa e Segunda-feira de Páscoa agora têm seus próprios textos e seu próprio lugar, em vez de quase toda a atenção cair só no sábado.
## v0.1.29

- SV: Flera stora firardagar har fått vassare och mer egen text.
- EN: Several major celebration days now have sharper and more distinctive writing.
- PT-BR: Várias grandes datas de celebração agora têm textos mais fortes e mais próprios.

### Summary

- SV: Några av de största återkommande firardagarna, som Fettisdag, Valborg, Nationaldagen, Midsommarafton, Julafton och Nyårsafton, har fått mer specifik och mer minnesvärd fallbacktext. Appen känns därför mindre generisk även när den inte lutar sig på AI-genererat innehåll.
- EN: Some of the biggest recurring celebration days, such as Fettisdagen, Walpurgis Night, National Day, Midsummer Eve, Christmas Eve, and New Year’s Eve, now have more specific and more memorable fallback writing. That makes the app feel less generic even when it is not leaning on AI-generated content.
- PT-BR: Algumas das maiores datas recorrentes de celebração, como Fettisdagen, Valborg, Dia Nacional, Véspera de Midsommar, Véspera de Natal e Véspera de Ano-Novo, agora têm textos de fallback mais específicos e mais memoráveis. Isso faz o app parecer menos genérico mesmo quando não está apoiado em conteúdo gerado por IA.
## v0.1.28

- SV: Firardagarna har fått en tydligare regelmodell bakom kulisserna.
- EN: Celebration days now have a clearer rule model behind the scenes.
- PT-BR: As datas de celebração agora têm um modelo de regras mais claro nos bastidores.

### Summary

- SV: Firardagarna bygger nu på en tydligare gemensam modell för fasta datum, påskrelaterade datum, återkommande veckodagar och specialregler. Det förändrar inte hur appen känns för användaren, men gör logiken lättare att förstå, testa och bygga vidare på utan fler hårdkodade specialfall.
- EN: Celebration days now use a clearer shared model for fixed dates, Easter-based dates, recurring weekdays, and special rules. It does not change how the app feels for users, but it makes the logic easier to understand, test, and extend without adding more hardcoded branches.
- PT-BR: As datas de celebração agora usam um modelo compartilhado mais claro para datas fixas, datas ligadas à Páscoa, dias recorrentes da semana e regras especiais. Isso não muda como o app parece para o usuário, mas torna a lógica mais fácil de entender, testar e expandir sem adicionar mais desvios hardcoded.
## v0.1.27

- SV: Appen är uppdelad tydligare och huvudvyn är lättare att bygga vidare på.
- EN: The app is split more clearly and the main view is easier to build on.
- PT-BR: O app está dividido de forma mais clara e a tela principal ficou mais fácil de evoluir.

### Summary

- SV: Appens huvudskal är nu uppdelat tydligare, så App-komponenten mest håller ihop data och tillstånd i stället för att också bära hela huvudvyn och footern själv. Det gör koden lättare att förstå och säkrare att ändra när fler förbättringar ska in.
- EN: The app shell is now split more clearly, so the App component mostly wires data and state together instead of also carrying the full main view and footer by itself. That makes the code easier to understand and safer to change as more improvements are added.
- PT-BR: A estrutura principal do app agora está dividida de forma mais clara, então o componente App fica mais focado em ligar dados e estado em vez de também carregar sozinho toda a tela principal e o rodapé. Isso deixa o código mais fácil de entender e mais seguro para continuar evoluindo.
## v0.1.26

- SV: Inställningar sparas bättre och testkörningen är lugnare.
- EN: Preferences now persist more cleanly and test runs are quieter.
- PT-BR: As preferências agora persistem melhor e a execução dos testes ficou mais limpa.

### Summary

- SV: Språk, ton och mörkt läge sparas nu tillsammans på ett tydligare sätt, långa rubriker håller sig bättre inom kortet och dubbla dagar som Nationaldagen visas mer rimligt. Samtidigt är de gamla React-varningarna i testerna borta, så testkörningarna är lättare att lita på.
- EN: Language, mood, and dark mode now persist together in a clearer way, long titles stay inside the card more reliably, and duplicate day labels such as National Day are handled more sensibly. At the same time, the old React test warnings are gone, so the test runs are easier to trust.
- PT-BR: Idioma, humor e modo escuro agora são salvos juntos de forma mais clara, títulos longos ficam dentro do cartão com mais segurança e dias duplicados, como o Dia Nacional, são tratados de forma mais sensata. Ao mesmo tempo, os antigos avisos do React nos testes sumiram, então a suíte ficou mais confiável.
## v0.1.25

- SV: Trasiga specialtecken är fixade och mörka knappar går lättare att läsa.
- EN: Broken characters are fixed and dark buttons are easier to read.
- PT-BR: Os caracteres quebrados foram corrigidos e os botões escuros ficaram mais legíveis.

### Summary

- SV: Den senaste versionsnotisen visade trasiga tecken i stället för å, ä och ö, och mörkt läge hade fortfarande vissa knappar och badges som blev för svåra att läsa i de mörkare stämningarna. Det är nu rättat, så både versionsnytt och de mörka knappytorna går att läsa som normalt igen.
- EN: The latest release note showed broken characters instead of proper accented text, and dark mode still had some buttons and badges that became too hard to read in the darker moods. That is now fixed, so both the changelog and those darker button surfaces read normally again.
- PT-BR: A última nota de versão mostrava caracteres quebrados no lugar dos acentos corretos, e o modo escuro ainda tinha alguns botões e badges difíceis de ler nos tons mais escuros. Isso foi corrigido, então tanto o changelog quanto essas superfícies escuras voltaram a ficar legíveis.
## v0.1.24

- SV: Koden är bättre uppdelad och mörkt läge är lättare att läsa.
- EN: The code is better organized and dark mode is easier to read.
- PT-BR: O código está melhor organizado e o modo escuro ficou mais fácil de ler.

### Summary

- SV: Frontendkoden är nu sorterad tydligare efter område, så AI, temadagar, nationaldagar, namnsdagar och kommande datum ligger samlade i egna delar i stället för att ligga utspridda i en platt mapp. Samtidigt har mörkt läge fått tydligare kontrast i knappar, badges och små etiketter som Firardag, så det viktiga innehållet blir lättare att läsa utan att appens ton försvinner.
- EN: The frontend code is now grouped more clearly by area, so AI, theme days, national days, name days, and upcoming dates live in their own sections instead of a flat pile. At the same time, dark mode has better contrast in buttons, badges, and smaller labels like Celebration, so the important UI is easier to read without losing the app's tone.
- PT-BR: O código do frontend agora está agrupado de forma mais clara por área, para que IA, datas temáticas, datas nacionais, nomes do dia e próximas datas fiquem em suas próprias seções em vez de um monte plano. Ao mesmo tempo, o modo escuro ganhou melhor contraste em botões, badges e pequenas etiquetas como Comemoração, deixando a interface mais legível sem perder o clima do app.
## v0.1.23

- SV: Mörkt läge har fått tydligare kontrast i knappar och etiketter.
- EN: Dark mode now has clearer contrast in buttons and labels.
- PT-BR: O modo escuro agora tem contraste mais claro em botões e etiquetas.

### Summary

- SV: Mörkt läge använder nu ljusare accentfärger där text faktiskt måste gå att läsa, som i knappar, badges och små etiketter. Resultatet är att appen fortfarande känns som samma stämning, men utan att viktiga delar blir grumliga eller svåra att urskilja.
- EN: Dark mode now uses brighter accent text where people actually need to read it, such as buttons, badges, and small labels. The app still keeps the same mood, but important UI details are no longer muddy or hard to pick out.
- PT-BR: O modo escuro agora usa textos de destaque mais claros onde as pessoas realmente precisam ler, como em botões, badges e pequenas etiquetas. O app continua com o mesmo clima, mas sem deixar partes importantes confusas ou difíceis de enxergar.
## v0.1.22

- SV: Mobilvyn väntar nu med scroll tills datumväljaren faktiskt stängs.
- EN: Mobile now waits to scroll until the date picker actually closes.
- PT-BR: No celular, o app só rola depois que o seletor de data realmente fecha.

### Summary

- SV: När du byter datum på mobil hoppar appen inte längre direkt medan datumväljaren fortfarande är öppen. Scrollen sker först när datumfältet faktiskt bekräftas och stängs, vilket känns lugnare och mindre ryckigt.
- EN: When you change the date on mobile, the app no longer jumps away while the date picker is still open. It now scrolls only after the field is actually confirmed and closed, which feels calmer and less jarring.
- PT-BR: Ao trocar a data no celular, o app não pula mais enquanto o seletor ainda está aberto. A rolagem agora só acontece depois que o campo é realmente confirmado e fechado, deixando tudo mais calmo e menos brusco.
## v0.1.21

- SV: På gång har flyttat till högersidan och footern ligger lägre.
- EN: Upcoming dates moved to the right side and the footer now sits lower.
- PT-BR: O bloco de próximas datas foi para a direita e o rodapé agora fica mais baixo.

### Summary

- SV: På gång ligger nu i en egen panel på högersidan under Också idag, så vänsterspalten kan fokusera på val och snabb överblick. Samtidigt ligger källor, versionsnytt och bygge längre ner och följer helheten bättre i layouten.
- EN: Upcoming dates now live in their own panel on the right side below Also today, so the left column can focus on controls and quick context. At the same time, sources, release notes, and build info sit lower and follow the overall layout more naturally.
- PT-BR: As próximas datas agora ficam em seu próprio painel à direita, abaixo de Também hoje, para a coluna da esquerda focar nos controles e no contexto rápido. Ao mesmo tempo, fontes, novidades da versão e build ficaram mais embaixo e acompanham melhor o layout.
## v0.1.20

- SV: Versionsinfo flyttad till huvudkortet och mobil datumväljare hoppar rätt.
- EN: Version info moved to the main card and the mobile date picker now jumps back correctly.
- PT-BR: As informações de versão foram para o cartão principal e o seletor de data no celular agora volta para o lugar certo.

### Summary

- SV: Bygge, Bildkällor och versionsnytt ligger nu längst ner i huvudkortet i stället för att ta plats i vänsterspalten. På mobil scrollar appen också tillbaka till huvudkortet när du bekräftar ett nytt datum, så resultatet hamnar direkt där blicken borde vara.
- EN: Build info, Image credits, and version notes now live at the bottom of the main card instead of taking space in the left column. On mobile, the app also scrolls back to the main card after you confirm a new date so the result appears where your attention should be.
- PT-BR: As informações de build, os créditos das imagens e as notas da versão agora ficam no rodapé do cartão principal em vez de ocupar espaço na coluna da esquerda. No celular, o app também volta para o cartão principal depois que você confirma uma nova data, para que o resultado apareça exatamente onde deveria.
## v0.1.19

- SV: Fler temadagar har fått mer egen röst och mindre generisk text.
- EN: More theme days now have their own voice instead of generic copy.
- PT-BR: Mais datas temáticas agora têm voz própria em vez de texto genérico.

### Summary

- SV: Flera tydliga temadagar, som Saint Patrick's day, Rocka sockorna-dagen, Kanelbullens dag och Nobeldagen, har fått mer egen och mer minnesvärd text. Resultatet är att "Ny ursäkt" oftare känns som att den faktiskt hör till just den dagen i stället för att låta som en allmän temadagsmall.
- EN: Several standout theme days, such as Saint Patrick's Day, Rock Your Socks Day, Cinnamon Bun Day, and Nobel Day, now have more distinct and memorable writing. The result is that "New excuse" more often feels tied to that specific day instead of sounding like a generic theme-day template.
- PT-BR: Várias datas temáticas mais marcantes, como Saint Patrick's Day, Rock Your Socks Day, Cinnamon Bun Day e Nobel Day, agora têm textos mais próprios e memoráveis. O resultado é que "Nova desculpa" parece com mais frequência algo realmente ligado àquele dia, em vez de soar como um modelo genérico.
## v0.1.18

- SV: Temadagar väljs nu mer vettigt när flera krockar samma dag.
- EN: Theme days are now chosen more sensibly when several land on the same date.
- PT-BR: As datas temáticas agora são escolhidas de forma mais sensata quando várias caem no mesmo dia.

### Summary

- SV: Appen använder inte längre rå ordning från källdatan när flera temadagar delar datum. I stället görs en enklare redaktionell bedömning, så dagar som Rocka sockorna-dagen, vårdagjämningen och Star wars-dagen oftare får leda när de faktiskt känns mest relevanta eller roliga.
- EN: The app no longer follows raw source order when several theme days share the same date. Instead it makes a lighter editorial choice, so days like Rock Your Socks Day, the spring equinox, and Star Wars Day are more likely to lead when they are clearly the most relevant or fun option.
- PT-BR: O app não segue mais a ordem bruta da fonte quando várias datas temáticas compartilham o mesmo dia. Em vez disso, ele faz uma escolha editorial simples, para que datas como Rock Your Socks Day, o equinócio da primavera e Star Wars Day apareçam primeiro quando fizerem mais sentido ou forem mais divertidas.
## v0.1.17

- SV: Renare styling och lugnare rubriker i appen.
- EN: Cleaner styling and calmer headings across the app.
- PT-BR: Estilo mais limpo e títulos mais calmos em todo o app.

### Summary

- SV: Stilarna i appen har delats upp tydligare i teman, layout, innehåll, rörelse och mobilanpassning. Samtidigt har de största rubrikerna tonats ner lite, så sidan känns mer balanserad och mindre som en gammal portal med allt uppskruvat på max.
- EN: The app styles are now split more clearly into themes, layout, content, motion, and responsive rules. At the same time, the biggest headings have been toned down so the page feels more balanced and less like an old portal with everything turned up to full volume.
- PT-BR: Os estilos do app agora estão divididos de forma mais clara em tema, layout, conteúdo, movimento e regras responsivas. Ao mesmo tempo, os maiores títulos foram reduzidos um pouco, para a página ficar mais equilibrada e menos com cara de portal antigo com tudo no máximo.
## v0.1.16

- SV: Mobilvyn sitter bättre och appkoden är uppstädad.
- EN: The mobile view fits better and the app code is cleaner.
- PT-BR: A visualização no celular ficou melhor e o código do app está mais limpo.

### Summary

- SV: Mobilvyn trycker inte längre ut navigering, rubriker och blurbar utanför kortet på små skärmar. Samtidigt har App-komponenten delats upp i tydligare hjälpfiler och hooks så det är lättare att ändra appen utan att allt bor i en enda jättestor fil.
- EN: The mobile view no longer pushes navigation, titles, and blurbs outside the card on small screens. At the same time, the App component has been split into clearer helpers and hooks so the app is easier to change without everything living in one giant file.
- PT-BR: A visualização no celular não empurra mais navegação, títulos e blurbs para fora do cartão em telas pequenas. Ao mesmo tempo, o componente App foi dividido em helpers e hooks mais claros, para facilitar mudanças sem deixar tudo em um único arquivo gigante.
## v0.1.15

- SV: AI-varianter fylls nu lugnare och bara på riktig reroll.
- EN: AI variants now grow more slowly and only on real rerolls.
- PT-BR: As variantes de IA agora crescem mais devagar e só em rerolls de verdade.

### Summary

- SV: Appen bygger inte längre upp flera AI-varianter automatiskt bara för att någon laddar samma dag flera gånger. Först sparas en variant, och fler skapas bara när du faktiskt trycker på Ny ursäkt. Det minskar onödiga AI-anrop och ger bättre kontroll över kvoten.
- EN: The app no longer builds multiple AI variants automatically just because the same day is loaded several times. It stores one variant first, and more are created only when you actually press New excuse. That cuts unnecessary AI calls and gives better quota control.
- PT-BR: O app não cria mais várias variantes de IA automaticamente só porque o mesmo dia foi carregado várias vezes. Primeiro ele salva uma variante, e novas só são criadas quando você realmente clica em Nova desculpa. Isso reduz chamadas desnecessárias à IA e dá mais controle sobre a cota.
## v0.1.14

- SV: Footer med versionsnytt och tydligare Bildkällor.
- EN: Footer release note and clearer Image credits.
- PT-BR: Resumo da versão no rodapé e Créditos das imagens mais claro.

### Summary

- SV: Footern visar nu vad den senaste versionen faktiskt innehåller, och du kan öppna en historik över tidigare uppdateringar. Bildkällor ser också tydligare klickbar ut.
- EN: The footer now explains what the latest version actually contains, and you can open a history of earlier updates. Image credits also looks more clearly clickable.
- PT-BR: O rodapé agora explica o que a versão atual realmente traz e permite abrir um histórico de atualizações anteriores. Créditos das imagens também parece mais claramente clicável.
## v0.1.13

- SV: Gamla separata AI-funktionen är borttagen.
- EN: The old separate AI function is gone.
- PT-BR: A antiga função separada de IA foi removida.

### Summary

- SV: Appen använder nu bara sin egen /api-väg för AI-texten. Den gamla separata Azure-funktionen är bortstädad, och dokumentationen följer den nya lösningen.
- EN: The app now uses only its own /api route for AI text. The old separate Azure function has been removed, and the docs now match the new setup.
- PT-BR: O app agora usa apenas sua própria rota /api para o texto de IA. A antiga função separada no Azure foi removida e a documentação foi ajustada ao novo caminho.
## v0.1.12

- SV: AI-texten går nu via appens egen Azure-väg.
- EN: AI text now uses the app's own Azure route.
- PT-BR: O texto de IA agora usa a própria rota Azure do app.

### Summary

- SV: AI-texten går nu via appens egen Azure-väg i stället för en separat publik funktionsadress. Det gör lösningen enklare och minskar beroendet av en fristående backendadress.
- EN: AI text now goes through the app's own Azure route instead of a separate public function URL. That makes the setup simpler and reduces the app's dependence on a standalone backend address.
- PT-BR: O texto de IA agora passa pela própria rota Azure do app em vez de uma URL pública separada. Isso deixa a solução mais simples e reduz a dependência de um endereço externo de backend.
## v0.1.11

- SV: Gammal AI-text försvinner direkt vid datum- eller tonbyte.
- EN: Old AI text disappears right away on date or tone change.
- PT-BR: O texto antigo da IA some na hora ao trocar data ou tom.

### Summary

- SV: När datum eller ton ändras försvinner gammal AI-text direkt. Appen väntar nu på rätt svar i stället för att visa text som hör till ett annat läge.
- EN: When the date or tone changes, old AI text disappears right away. The app now waits for the correct response instead of showing text from the wrong state.
- PT-BR: Quando a data ou o tom mudam, o texto antigo da IA some na hora. O app agora espera a resposta certa em vez de mostrar texto do estado anterior.
## v0.1.10

- SV: Ingen tillfällig reservtext innan rätt blurb finns.
- EN: No temporary fallback text before the right blurb is ready.
- PT-BR: Sem texto provisório antes da blurb certa ficar pronta.

### Summary

- SV: Appen visar inte längre en tillfällig reservtext som sedan byts ut när AI-svaret kommer. Den väntar i stället på rätt dagsblurb, så innehållet känns lugnare och mindre ryckigt.
- EN: The app no longer shows a temporary fallback text and then swaps it out when the AI response arrives. It now waits for the right daily blurb, which makes the content feel calmer and less jumpy.
- PT-BR: O app não mostra mais um texto provisório de reserva para depois trocá-lo quando a IA responde. Agora ele espera pela blurb certa do dia, o que deixa a experiência mais calma e menos brusca.
## v0.1.9

- SV: Svenska landsnamn och tydligare helgdagsförklaring.
- EN: Swedish country names and a clearer holiday explanation.
- PT-BR: Nomes de países em sueco e explicação mais clara sobre feriado.

### Summary

- SV: Nationaldagar visas nu med svenska landsnamn i den svenska versionen. Texten förtydligar också att det inte handlar om en officiell svensk helgdag.
- EN: National days now show Swedish country names in the Swedish version. The text also makes clear that this is not an official Swedish holiday.
- PT-BR: As datas nacionais agora mostram nomes de países em sueco na versão sueca. O texto também deixa claro que isso não é um feriado oficial sueco.
## v0.1.8

- SV: Ton märks nu också i färg, form och rörelse.
- EN: Tone now also shows up in color, shape, and motion.
- PT-BR: O tom agora também aparece em cor, forma e movimento.

### Summary

- SV: Den valda tonen märks nu bättre genom färg, form och rörelse i appen, inte bara i texten. Kort, paneler och detaljer har blivit tydligare kopplade till den stämning du valt.
- EN: The selected tone now shows up more clearly through color, shape, and motion in the app, not only in the text. Cards, panels, and details now match the mood more clearly.
- PT-BR: O tom escolhido agora aparece melhor por cor, forma e movimento no app, e não só no texto. Cartões, painéis e detalhes agora combinam melhor com o clima escolhido.
## v0.1.7

- SV: Du kan nu välja ton i appen.
- EN: You can now choose the app's tone.
- PT-BR: Agora você pode escolher o tom do app.

### Summary

- SV: Du kan nu välja ton för appens texter. Det påverkar både AI-texter och fler av appens egna formuleringar, så upplevelsen känns mer sammanhållen.
- EN: You can now choose a tone for the app's writing. It affects both AI text and more of the app's own copy, so the experience feels more consistent.
- PT-BR: Agora você pode escolher o tom dos textos do app. Isso afeta tanto o texto da IA quanto mais partes do próprio conteúdo do app, deixando a experiência mais coesa.
## v0.1.6

- SV: Frontend kopplades till AI-tjänsten.
- EN: The frontend was connected to the AI service.
- PT-BR: O frontend foi ligado ao serviço de IA.

### Summary

- SV: Frontend kopplades till AI-tjänsten så att datum kan få smartare blurbar. Det här var steget där AI började påverka det som faktiskt visas i appen.
- EN: The frontend was connected to the AI service so dates can get smarter blurbs. This was the step where AI started affecting what the app actually shows.
- PT-BR: O frontend foi ligado ao serviço de IA para que as datas possam receber blurbs mais inteligentes. Foi aqui que a IA começou a afetar o que realmente aparece no app.
## v0.1.5

- SV: AI-flödet blev stabilare i drift.
- EN: The AI flow became more stable in production.
- PT-BR: O fluxo de IA ficou mais estável em produção.

### Summary

- SV: AI-flödet fick en live-fix så att startproblem och konstiga tecken inte ställer till det. Kort sagt: mindre strul, färre märkliga tecken och bättre stabilitet.
- EN: The AI flow got a live fix so startup problems and odd text encoding do not get in the way. In short: less breakage, fewer weird characters, and better stability.
- PT-BR: O fluxo de IA recebeu uma correção em produção para que problemas na inicialização e textos estranhos não atrapalhem. Em resumo: menos falhas, menos caracteres esquisitos e mais estabilidade.
## v0.1.4

- SV: AI-blurbar började använda cache.
- EN: AI blurbs started using cache.
- PT-BR: As blurbs de IA passaram a usar cache.

### Summary

- SV: AI-blurbar med cache började användas, så appen kan återanvända bra texter i stället för att skriva om allt varje gång. Det gjorde svaren snabbare och öppnade för en växande blurbbank.
- EN: Cached AI blurbs started being used, so the app can reuse good text instead of writing everything again every time. That made responses faster and opened the door to a growing blurb library.
- PT-BR: Blurbs de IA com cache começaram a ser usados, para o app reaproveitar bons textos em vez de gerar tudo de novo toda vez. Isso deixou as respostas mais rápidas e abriu caminho para uma biblioteca maior de blurbs.
## v0.1.3

- SV: Första versionen av AI-blurbar lades till.
- EN: The first version of AI blurbs was added.
- PT-BR: A primeira versão das blurbs de IA foi adicionada.

### Summary

- SV: Första versionen av AI-blurbar lades till som ett nytt lager ovanpå de vanliga texterna. Appen kunde därmed börja skriva friare dagsformuleringar i stället för att bara använda fasta texter.
- EN: The first version of AI blurbs was added as a new layer on top of the regular text. The app could now start writing looser daily copy instead of relying only on fixed text.
- PT-BR: A primeira versão das blurbs de IA foi adicionada como uma nova camada por cima dos textos normais. O app passou a poder escrever textos mais livres para o dia, em vez de depender só de frases fixas.
## v0.1.2

- SV: Public och team fick egna ikoner.
- EN: Public and team got their own icons.
- PT-BR: Public e team ganharam seus próprios ícones.

### Summary

- SV: Varje innehållspaket fick egna ikoner så att public och team känns tydligare åtskilda redan i webbläsaren. Det gjorde varianterna enklare att känna igen direkt.
- EN: Each content pack got its own icons so public and team feel more clearly separated right in the browser. That made the two variants easier to recognize at a glance.
- PT-BR: Cada pacote de conteúdo ganhou seus próprios ícones, para separar melhor as versões pública e de equipe já no navegador. Isso deixou as duas variantes mais fáceis de reconhecer de imediato.
## v0.1.1

- SV: Portugisiska nationaldagsrutan blev tydligare.
- EN: The Portuguese national-day panel became clearer.
- PT-BR: O painel de datas nacionais em português ficou mais claro.

### Summary

- SV: Nationaldagsrutan förbättrades för portugisiska och blev tydligare även där. Det var en mindre ändring, men viktig för att språkvyn skulle kännas mindre halvfärdig.
- EN: The national-day panel was improved for Portuguese and became clearer there too. It was a smaller change, but important for making that language view feel less half-finished.
- PT-BR: O painel de datas nacionais foi melhorado em português e ficou mais claro também. Foi uma mudança menor, mas importante para a visão em português parecer menos incompleta.
