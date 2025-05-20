# DD Barber Hub

Full-stack application for discovering barbershops, browsing services and schedules, and managing bookings. The project offers responsive mobile and desktop interfaces, Google authentication in production, and a local demo user during development.

## Preview

- [Open the project design on Figma](https://www.figma.com/design/ByDjVh7THsTnsSVRKNN8yy/FSW-5.0--Live-?node-id=1-8&p=f)
- Published demo: not available yet.

## Features

- Search barbershops by name and filter by service.
- Detail pages with services, prices, location, and contact information.
- Date and time selection with availability checked against existing bookings.
- Google authentication for production and a simplified local login in development.
- Booking list and cancellation.
- Responsive layout for mobile and desktop.

## Stack

| Area | Technologies |
| --- | --- |
| Application | Next.js 14, React 18, TypeScript |
| UI | Tailwind CSS, Radix UI, Lucide |
| Authentication | NextAuth.js, Google OAuth, Prisma Adapter |
| Data | PostgreSQL, Prisma ORM |
| Deploy | Vercel |

## Architecture and decisions

- The App Router separates pages and shared components; data reads happen on the server, while UI interactions stay in client components.
- Prisma centralizes access to PostgreSQL. The client is reused in development to avoid opening new connections on every hot reload.
- Bookings are persisted in the database, and available times are calculated from existing reservations.
- JWT sessions allow sharing the session flow between Google OAuth and the local credentials provider. The local provider is only registered when `NODE_ENV=development`.
- `DATABASE_URL` can point to a pooled connection in serverless environments; `DIRECT_URL` is used by Prisma for operations such as migrations.
- Phone numbers and opening hours shown in the UI are prototype demo data and are not yet part of the Prisma model.

## Running locally

### Prerequisites

- Node.js 20 LTS (or Node.js 18.17 or later).
- npm.
- Docker Desktop to start PostgreSQL locally.

### Installation

```bash
git clone https://github.com/<your-username>/fullstackweek-barber.git
cd fullstackweek-barber
```

Copy `.env.example` to `.env` and adjust the values as needed. The `.env` file is ignored by Git and is read by both Next.js and Prisma commands.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Generate a local secret with Node.js and replace `NEXTAUTH_SECRET` in `.env`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

After filling in the secret, install the dependencies:

```bash
npm ci
```

Start the database, apply migrations, and load demo data:

```bash
docker compose up -d postgres
npm run db:migrate:deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The seed creates demo data and should be run once against an empty database.

### Local login

When running `npm run dev`, the menu offers **Local sign in**. This provider creates or reuses the user `local@localhost` without requiring Google credentials. It is only included when the app runs in development; it is not an authentication method for production.

To test Google OAuth locally, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` and register `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in the Google Cloud Console.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The repository does not yet have an automated UI test suite.

## Deploy on Vercel

1. Import the repository into your Vercel project and configure a managed PostgreSQL instance accessible by the deployment.
2. Register the variables `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in the corresponding Vercel environments.
3. Use the pooled/pooler URL in `DATABASE_URL` when the provider offers one for serverless functions. Set the direct URL in `DIRECT_URL` to run migrations.
4. Before releasing a version with new migrations, run `npm run db:migrate:deploy` against the production database.
5. In the Google Cloud Console, authorize `https://<your-domain>/api/auth/callback/google` as an OAuth redirect URI.

Vercel detects Next.js automatically. The project's build command runs `prisma generate` before `next build`. Local authentication is disabled in production; Google credentials and database configuration are required for a functional deployment.
