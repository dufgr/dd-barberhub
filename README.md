# DD Barber Hub

Aplicação full-stack para descobrir barbearias, consultar serviços e horários e gerenciar reservas. O projeto oferece interfaces responsivas para mobile e desktop, autenticação Google em produção e um usuário local de demonstração durante o desenvolvimento.

## Preview

- [Abrir o design do projeto no Figma](https://www.figma.com/design/ByDjVh7THsTnsSVRKNN8yy/FSW-5.0--Live-?node-id=1-8&p=f)
- Demo publicada: ainda não disponível.

## Funcionalidades

- Busca de barbearias por nome e filtros por serviço.
- Páginas de detalhes com serviços, preços, localização e informações de contato.
- Seleção de data e horário com verificação de reservas existentes.
- Autenticação Google para produção e login local simplificado em desenvolvimento.
- Listagem e cancelamento de reservas.
- Layout responsivo para mobile e desktop.

## Stack

| Área | Tecnologias |
| --- | --- |
| Aplicação | Next.js 14, React 18, TypeScript |
| Interface | Tailwind CSS, Radix UI, Lucide |
| Autenticação | NextAuth.js, Google OAuth, Prisma Adapter |
| Dados | PostgreSQL, Prisma ORM |
| Deploy | Vercel |

## Arquitetura e decisões

- O App Router separa páginas e componentes compartilhados; leituras de dados são feitas no servidor e interações de interface ficam em componentes client-side.
- Prisma centraliza o acesso ao PostgreSQL. O cliente é reutilizado em desenvolvimento para evitar abrir conexões a cada hot reload.
- Reservas são persistidas no banco e os horários disponíveis são calculados a partir das reservas existentes.
- Sessões JWT permitem compartilhar o fluxo de sessão entre Google OAuth e o provedor de credenciais local. O provedor local só é registrado com `NODE_ENV=development`.
- `DATABASE_URL` pode apontar para uma conexão agrupada em ambientes serverless; `DIRECT_URL` é usado pelo Prisma para operações como migrations.
- Telefones e horários mostrados na interface são dados demonstrativos do protótipo e ainda não fazem parte do modelo Prisma.

## Executar localmente

### Pré-requisitos

- Node.js 20 LTS (ou Node.js 18.17 ou superior).
- npm.
- Docker Desktop para iniciar o PostgreSQL local.

### Instalação

```bash
git clone https://github.com/<seu-usuario>/fullstackweek-barber.git
cd fullstackweek-barber
```

Copie `.env.example` para `.env` e ajuste os valores quando necessário. O arquivo `.env` é ignorado pelo Git e é lido tanto pelo Next.js quanto pelos comandos do Prisma.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Gere um segredo local com Node.js e substitua `NEXTAUTH_SECRET` no `.env`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Depois de preencher o segredo, instale as dependências:

```bash
npm ci
```

Suba o banco, aplique as migrations e carregue os dados de demonstração:

```bash
docker compose up -d postgres
npm run db:migrate:deploy
npm run db:seed
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O seed cria dados de demonstração e deve ser executado uma vez em um banco vazio.

### Login local

Em `npm run dev`, o menu oferece **Entrar localmente**. Esse provedor cria ou reutiliza o usuário `local@localhost`, sem exigir credenciais Google. Ele só é incluído quando a aplicação roda em desenvolvimento; não é um método de autenticação para produção.

Para testar Google OAuth localmente, configure `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no `.env` e cadastre `http://localhost:3000/api/auth/callback/google` como URI de redirecionamento autorizado no Google Cloud Console.

## Validação

```bash
npm run lint
npx tsc --noEmit
npm run build
```

O repositório ainda não possui uma suíte automatizada de testes de interface.

## Deploy na Vercel

1. Importe o repositório no projeto da Vercel e configure um PostgreSQL gerenciado acessível pelo deploy.
2. Cadastre as variáveis `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` nos ambientes correspondentes da Vercel.
3. Use a URL agrupada/pooler em `DATABASE_URL` quando o provedor oferecer uma para funções serverless. Configure a URL direta em `DIRECT_URL` para executar migrations.
4. Antes de disponibilizar uma versão com novas migrations, execute `npm run db:migrate:deploy` contra o banco de produção.
5. No Google Cloud Console, autorize `https://<seu-dominio>/api/auth/callback/google` como URI de redirecionamento OAuth.

A Vercel detecta Next.js automaticamente. O comando de build do projeto executa `prisma generate` antes de `next build`. A autenticação local é desativada em produção; as credenciais Google e a configuração do banco são necessárias para o deploy funcional.
