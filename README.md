# Portfolio v4.0

Portfolio pessoal de Antonewton Quima, construido com Next.js, TypeScript,
Tailwind CSS, Firebase e Vercel. O projecto junta portfolio, pagina Now, loja,
gestao administrativa e captura automatica de covers para projectos publicados.

## Funcionalidades

- Paginas publicas com i18n: home, sobre, projectos, now, loja, contacto e versoes.
- Loja com produtos vindos do Firestore.
- Normalizacao automatica de imagens antigas da RSV Ink para o dominio actual.
- Fallback local para imagens de produto indisponiveis.
- Painel admin protegido por Firebase Auth.
- CRUD de `items` e `projects` no admin.
- Edicao da pagina `Now` pelo admin usando o documento `now/current`.
- Captura de cover dos projectos em producao usando Chromium headless.
- Upload das covers capturadas para Vercel Blob.
- Regras Firestore com leitura publica e escrita restrita ao admin.

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

## Deploy

O deploy recomendado e na Vercel.

Antes de publicar:

- configura as variaveis de ambiente na Vercel;
- cria/conecta o Vercel Blob Store;
- publica as regras Firestore;
- confirma que o email admin esta em `ADMIN_EMAILS`.

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de producao
npm run start    # servidor de producao
npm run lint     # lint configurado pelo Next
```

## Autor

Antonewton Quima
