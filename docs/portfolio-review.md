# Revisão comercial e UX — 22 de setembro de 2026

## Diagnóstico verificado antes das alterações

- A homepage do checkout destacava nome, cargo Odoo/estudante, contadores fixos `03+`, `03` e `v4.0`. Não apresentava serviços nem exemplos de trabalho na própria página. Foram capturadas as versões desktop e mobile antes da alteração.
- A navegação principal incluía Now e Shop. A versão do portfólio tinha destaque próprio. O contacto era secundário em relação a “Ver projetos”.
- A listagem de projetos começava com estado `loading` e fazia a leitura do Firestore num `useEffect`. A página pública `/en/projects` também mostrou “Loading projects…” na leitura do navegador. Isto confirma a dependência de JavaScript para o conteúdo inicial; não prova que a página nunca carregasse ou que o Google não a indexasse.
- As páginas de projetos individuais já obtinham os dados no servidor. Os registos existentes continham nome, descrição curta, ano, imagem e URL, sem contexto, participação, tipo de trabalho ou resultados.
- O formulário usava Resend e as três variáveis necessárias estão presentes no ambiente local. O código anterior devolvia sucesso perante aceitação HTTP do fornecedor e até no honeypot, sem prova de entrega.
- A animação global começava com opacidade zero. O conteúdo não devia depender de hidratação para ficar visível.
- A validação posterior encontrou páginas internas sem `og:image` após substituírem os metadados herdados. Foram adicionadas imagens sociais explícitas.

## Alterações e finalidade

1. **Proposta comercial e contacto:** nova abertura explica websites, aplicações, gestão e Odoo, os públicos e o objetivo. “Pedir orçamento” é a ação principal; “Ver trabalhos” leva aos projetos na homepage. Email visível em todas as páginas pelo rodapé.
2. **Serviços:** três áreas organizadas por necessidades, sem preço de entrada anunciado nem promessa de prazo/resultado comercial. Trabalho remoto internacional e colaboração com agências estão explícitos.
3. **Provas:** três projetos pessoais com imagens existentes, demonstração pública, resumo, contexto, solução, participação e funcionalidades. A classificação e a autoria integral foram confirmadas pelo proprietário nesta conversa. Não se apresentam como clientes.
4. **Percurso comercial:** serviços → trabalho → apresentação e agências → processo → contacto. Formação e histórico profissional mantidos em Sobre. Now, Shop, versões e administração continuam acessíveis no rodapé.
5. **Contacto:** nome, email, descrição e orçamento livre opcional (com “Ainda não sei”). Validação no navegador e servidor, estados de submissão, erro, entrega pendente e entrega confirmada, preservação do texto e alternativa de email. Sem configuração completa, o formulário dá lugar ao email.
6. **Acessibilidade e apresentação:** identidade escura/laranja e avatar preservados; melhor hierarquia, links com área de interação, foco visível, salto para conteúdo, filtros com estado anunciado, imagens com alternativa e respeito por movimento reduzido. Removida a animação global de entrada.
7. **Carregamento e metadados:** projetos fornecidos pelo servidor, filtros continuam interativos, tratamento separado para falha e coleção vazia, timeout e paginação do Firestore. Títulos, descrições, canonical, idiomas e imagens sociais nas páginas comerciais e detalhes. Administração com `noindex`; sitemap com idiomas e sem uma data de atualização inventada em cada pedido.

## Conteúdo e fontes

- Projetos e imagens: leitura pública da coleção Firestore existente, sem alterações na base de dados.
- [Resto](https://resto-seven-iota.vercel.app/): menu por categorias, história, galeria e interface de reserva observados. A própria demonstração contém texto de integração pendente; não se afirma entrega de reservas, cliente real, avaliações ou faturação.
- [Jogastop](https://jogastop.ao): página pública com criação/entrada em salas, perfil, regras, categorias e ranking. Não foi criada uma sala nem executada uma sessão multijogador durante esta auditoria.
- [Natura Lovers](https://antonewtonq.github.io/natura/): apresentação, características, navegação e FAQs observados. Tratado como projeto pessoal, sem afirmar contrato com uma marca.
- Experiência Odoo e colaboração de frontend: textos já existentes em `messages/pt.json` e `messages/en.json`, incluindo ESPAES, Anda Africa, Compllexus e Rising Africa. Não foram acrescentadas competências ou cargos de outras fontes.
- Entrega de email: consulta do campo `last_event` na [documentação oficial Resend](https://resend.com/docs/api-reference/emails/retrieve-email). Uma resposta de criação com ID significa aceitação; apenas `delivered` permite mostrar confirmação de entrega ao servidor de destino. Não significa leitura nem colocação na caixa principal.

Os textos editoriais bilingues dos três projetos estão em `src/lib/project-stories.ts`, associados aos IDs existentes. Nome, ano, imagem e URL continuam a vir do Firestore. Para mudar os estudos de caso, editar esse ficheiro; uma alteração da descrição antiga no painel não substitui os resumos editoriais desses três projetos. Projetos novos continuam a usar a descrição do Firestore até terem conteúdo editorial verificado.

## Ficheiros principais

- Rotas: `src/app/[locale]/page.tsx`, `projects/page.tsx`, `projects/[id]/page.tsx`, `about/page.tsx`, `contact/page.tsx`.
- Homepage e navegação: `menu.tsx`, `services.tsx`, `work-process.tsx`, `contact-cta.tsx`, `navbar.tsx`, `footer.tsx`, `page-frame.tsx`, `layout.tsx` e `navlinks.ts`.
- Projetos: `projects.tsx`, `projectcard.tsx`, `project-cover.tsx`, `projects-server.ts` e `project-stories.ts`.
- Contacto: `ContactList.tsx`, `forms/ContactForm.tsx`, `api/contact/route.ts` e `contact-config.ts`.
- Metadados e idiomas: `page-metadata.ts`, layouts, geradores de imagens sociais, `sitemap.ts`, metadata do admin, `messages/pt.json` e `messages/en.json`.
- Evidência reproduzível: `scripts/check-contact.cjs`, `scripts/check-projects.cjs`, `scripts/review-browser.mjs` e `artifacts/review/`.

## Verificações

Resultados finais e capturas: `artifacts/review/browser-results.json` e ficheiros PNG na mesma pasta.

- Build Next.js de produção e verificação TypeScript.
- 22 verificações isoladas da API de contacto: configuração ausente, JSON inválido, campos inválidos, honeypot, entrega confirmada/pendente/falhada, leitura do estado sem permissão, timeouts, recibo inválido e limite de tentativas. Nenhum pedido real à Resend.
- Cinco cenários da origem dos projetos: erro de rede, HTTP de erro, coleção vazia, configuração ausente e paginação/ordenação com rejeição de links executáveis.
- Navegador Chromium: homepage, projetos, Sobre, Contacto e os três detalhes, em PT/EN; dimensões de 320, 390, 768 e 1440 px; títulos, descriptions, canonical, idiomas, imagens sociais e ausência de overflow horizontal.
- Auditoria axe (WCAG 2 A/AA e 2.1 AA) nas 14 páginas em desktop. Complemento manual/funcional de foco, teclado, layout mobile e legibilidade; não equivale a certificação de acessibilidade.
- HTML sem JavaScript, navegação por âncoras, filtros de ano, mudança de idioma preservando o projeto, formulário com respostas simuladas e preservação de dados após erro. Os sete percursos funcionais passaram na build local de produção, sem erros JavaScript.
- Zero violações axe nas 14 páginas analisadas. Verificadas também 15 rotas secundárias/técnicas: respostas HTTP esperadas, `noindex` administrativo, sitemap com idiomas, robots e quatro imagens sociais; projeto inexistente devolve 404.
- `npm run lint` não tem configuração ESLint existente e abre o assistente de configuração; não foi registado como aprovado. Não se acrescentaram dependências ao projeto.

## Limitações e informação ainda necessária

- **Entrega real:** não foi enviada uma mensagem real. É necessário testar depois com autorização e confirmar receção. Presença de variáveis locais não valida chave, domínio remetente, ambiente de alojamento ou entrega. Chaves Resend apenas de envio podem impedir a consulta do estado; nesse caso apresenta-se entrega não confirmada. A consulta é feita uma vez; não há acompanhamento posterior por webhook.
- O limitador existente de contacto é por processo. Não constitui um limite global em múltiplas instâncias.
- As imagens dependem das URLs externas existentes; o componente apresenta uma alternativa textual se uma falhar. São capturas existentes e podem ser anteriores às versões atuais das demonstrações.
- Não existem resultados mensuráveis confirmados, testemunhos autorizados ou estudos de caso públicos de Odoo/gestão nos materiais deste repositório. Para fortalecer essas áreas, fornecer problema, participação específica, funcionalidades, autorização de divulgação, imagens e resultados verificáveis. Trabalho coletivo deve identificar a equipa e a contribuição individual.
- Se os três projetos pessoais tiverem datas, stack ou resultados mais precisos que os registos atuais, fornecer esses dados antes de os acrescentar.
- Não foi medido impacto em leads, conversão, rankings de pesquisa ou Core Web Vitals. As melhorias de estrutura e disponibilização do HTML não demonstram esses ganhos.
- Não houve deploy, alteração de DNS, escrita no Firestore, alteração de segredos, commit ou push. A revisão está no checkout local.

## Pré-visualização

A versão de revisão usa uma build de produção **local**, sem publicação:

- Português: http://localhost:3001/pt
- Inglês: http://localhost:3001/en
- Contacto: http://localhost:3001/pt/contact

Para voltar a iniciar: `npm run build` e `npm run start -- --hostname 0.0.0.0 --port 3001`.

As capturas `home-pt-desktop.png`, `home-pt-mobile-first-screen.png`, `contact-pt-mobile.png` e as versões EN estão em `artifacts/review/`.
