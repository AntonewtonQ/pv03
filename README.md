# Portfolio v4.0

Portfolio pessoal de Antonewton Quima, construido com Next.js, TypeScript,
Tailwind CSS, Firebase e Vercel. O projecto junta portfolio, pagina Now, loja,
gestao administrativa e captura automatica de covers para projectos publicados.

## Funcionalidades

- Paginas publicas com i18n: home, sobre, projectos, now, loja, contacto e versoes.
- Loja com produtos vindos do Firestore, carrinho persistente e checkout por WhatsApp.
- Normalizacao automatica de imagens antigas da RSV Ink para o dominio actual.
- Fallback local para imagens de produto indisponiveis.
- Painel admin protegido por Firebase Auth.
- CRUD de `items` e `projects` no admin.
- Actualizacao do preco de todas as t-shirts numa unica operacao.
- Edicao da pagina `Now` pelo admin usando o documento `now/current`.
- Captura de cover dos projectos em producao usando Chromium headless.
- Upload das covers capturadas para Vercel Blob.
- Pagina individual para cada projecto com URL partilhavel.
- Cards sociais Open Graph e Twitter dinamicos usando a cover de cada projecto.
- Estado online automatico dos projectos publicados com tempo de resposta.
- SEO com metadata, dados estruturados, sitemap e robots.
- Vercel Web Analytics para visitantes, paginas vistas, origens e dispositivos.
- Regras Firestore com leitura publica e escrita restrita ao admin.
- Formulario de contacto enviado por API interna usando Resend.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- next-intl
- Firebase Auth
- Cloud Firestore
- Vercel Blob
- Puppeteer Core
- @sparticuz/chromium
- Sharp
- Vercel Web Analytics
- Lucide React

## Estrutura Principal

```txt
src/app/[locale]         Rotas publicas localizadas
src/app/api/admin        APIs internas do painel admin
src/components           Componentes da interface
src/lib                  Configuracoes e helpers partilhados
messages                 Traducoes PT/EN
public/images            Assets publicos locais
firestore.rules          Regras sugeridas para o Firestore
```

## Rotas

```txt
/pt
/pt/about
/pt/projects
/pt/projects/[id]
/pt/now
/pt/shop
/pt/contact
/pt/versions
/pt/admin
```

As mesmas rotas tambem existem em `/en`.

## Colecoes Firestore

### `items`

Usada pela loja.

```ts
{
  name: string;
  price: number;
  imageUrl: string;
}
```

### `projects`

Usada pela pagina de projectos e pelo admin.

```ts
{
  name: string;
  description: string;
  year: string;
  cover: string;
  link: string;
}
```

### `now/current`

Usada pela pagina Now.

```ts
{
  headline: string;
  summary: string;
  availability: string;
  focus: string;
  building: string;
  learning: string;
  location: string;
  projectName: string;
  projectLink: string;
  projectCover: string;
  updatedAt: string;
}
```

Nos campos `focus`, `building` e `learning`, cada linha vira um item visual na
pagina publica.

## Variaveis de Ambiente

Cria um ficheiro `.env.local` com as variaveis publicas do Firebase:

```env
NEXT_PUBLIC_SITE_URL=https://antonewton.xyz
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Para o admin e captura de covers:

```env
BLOB_READ_WRITE_TOKEN=
ADMIN_EMAILS=teu-email-admin@dominio.com
```

`BLOB_READ_WRITE_TOKEN` vem do Vercel Blob. `ADMIN_EMAILS` aceita varios emails
separados por virgula.

Para o formulario de contacto:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=antonewtonquima@gmail.com
CONTACT_FROM_EMAIL="Portfolio <contact@teu-dominio.com>"
```

Durante testes, `CONTACT_FROM_EMAIL` pode usar `"Portfolio <onboarding@resend.dev>"`,
mas esse dominio so envia para o email associado a conta Resend. Para producao,
verifica um dominio na Resend e usa um remetente desse dominio.

Em desenvolvimento local, caso o Chromium automatico nao funcione, podes apontar
um executavel local:

```env
CHROME_EXECUTABLE_PATH=/caminho/para/chrome
```

## Regras Firestore

O projecto inclui [firestore.rules](./firestore.rules) como base. A regra
esperada e:

- leitura publica para `items`, `projects` e `now`;
- escrita apenas para emails admin autenticados;
- bloqueio por padrao para outras colecoes.

Antes de publicar, troca o email exemplo em `firestore.rules` pelo teu email
real de admin.

## Desenvolvimento

Instala as dependencias:

```bash
npm install
```

Inicia o servidor local:

```bash
npm run dev
```

O servidor de desenvolvimento usa `.next-dev`, separado do build de producao
em `.next`, evitando conflitos de chunks quando `dev` e `build` sao executados
ao mesmo tempo.

Abre:

```txt
http://localhost:3000/pt
http://localhost:3000/pt/admin
```

## Build

```bash
npm run build
```

## Painel Admin

Acede a `/pt/admin` ou `/en/admin`.

O admin permite:

- criar, editar e apagar produtos;
- actualizar o preco de todas as t-shirts de uma unica vez;
- criar, editar e apagar projectos;
- capturar cover da pagina inicial de um projecto em producao;
- editar a pagina Now;
- capturar e guardar a tela do projecto actual da pagina Now;
- abrir a pagina Now publica para conferencia.

Para o login funcionar, activa o metodo Email/Password no Firebase Auth e cria
o teu usuario administrador.

## Captura de Covers

No admin de projectos, o botao `Capturar cover`:

1. valida a sessao Firebase Auth;
2. abre o link publico do projecto com Chromium;
3. tira screenshot em formato WebP;
4. envia a imagem para Vercel Blob;
5. grava a URL resultante no campo `cover` do projecto.

A API usada por esse fluxo esta em:

```txt
src/app/api/admin/project-cover/route.ts
```

## SEO e Cards Sociais

Cada documento da colecao `projects` recebe uma pagina publica em:

```txt
/pt/projects/[id]
/en/projects/[id]
```

Ao partilhar essa pagina no WhatsApp, LinkedIn ou noutra rede, o Next.js gera
um card `1200x630` exclusivo com a cover, nome, descricao e ano do projecto.
A cover capturada pelo admin e guardada no campo `cover` e reutilizada
automaticamente no card social.

O portfolio tambem disponibiliza:

```txt
/sitemap.xml
/robots.txt
```

Configura `NEXT_PUBLIC_SITE_URL` com o dominio final antes do deploy para que
canonical URLs, sitemap e links dos cards sociais apontem para o endereco
correcto.

## Estado dos Projectos

A API publica `/api/projects/status` verifica os links guardados nos projectos
e apresenta um indicador na listagem e pagina individual:

- `Online`: respondeu com sucesso em menos de 3 segundos;
- `Instavel`: respondeu lentamente ou retornou um erro HTTP;
- `Offline`: nao respondeu dentro do limite ou a ligacao falhou;
- `Sem link`: o projecto ainda nao possui URL publicada.

As verificacoes sao feitas no servidor, rejeitam enderecos locais/privados e
ficam em cache durante cinco minutos para evitar pedidos excessivos.

## Deploy

O deploy recomendado e na Vercel.

Antes de publicar:

- configura as variaveis de ambiente na Vercel;
- cria/conecta o Vercel Blob Store;
- publica as regras Firestore;
- confirma que o email admin esta em `ADMIN_EMAILS`.
- activa Web Analytics no separador Analytics do projecto na Vercel.

## Estatisticas de Acesso

O portfolio inclui o componente oficial `@vercel/analytics`, carregado no
layout global para acompanhar todas as paginas e navegacoes.

Depois do deploy, activa Web Analytics no painel da Vercel:

```txt
Projecto > Analytics > Enable
```

Os dados ficam disponiveis no mesmo separador e incluem visitantes, paginas
mais vistas, origens, paises, dispositivos, navegadores e taxa de rejeicao.
O Vercel Web Analytics utiliza dados anonimizados e nao depende de cookies.

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de producao
npm run start    # servidor de producao
npm run lint     # lint configurado pelo Next
```

## Autor

Antonewton Quima
