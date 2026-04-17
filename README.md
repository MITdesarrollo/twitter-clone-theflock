# Twitter Clone

Full-stack Twitter/X clone built as a technical challenge for The Flock.

## Runbook

### Prerequisites

- **Node.js** >= 20 (tested with 20.19.5)
- **npm** >= 10
- **Docker** and **Docker Compose** (for PostgreSQL)
- **Git**

### Quick Start (Development)

```bash
# 1. Clone the repo
git clone https://github.com/MITdesarrollo/twitter-clone-theflock.git
cd twitter-clone-theflock

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set JWT_SECRET to a random string (min 32 chars)
# Example: openssl rand -base64 32

# 4. Start PostgreSQL
docker compose --profile dev up -d

# 5. Run database migrations
npx prisma migrate dev

# 6. Generate Prisma client
npx prisma generate

# 7. Seed the database
npx prisma db seed

# 8. Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Quick Start (Docker - One Command)

```bash
# Starts both PostgreSQL and Next.js
docker compose --profile full up --build
```

Open http://localhost:3000 in your browser.

### Test Credentials

All seed users share the same password:

| Email             | Password    |
| ----------------- | ----------- |
| alice@example.com | Password123 |
| bob@example.com   | Password123 |
| carol@example.com | Password123 |

12 users total. Full list in `prisma/seed.ts`.

### Running Tests

```bash
# Unit tests
npm run test:unit

# Unit tests with coverage report
npm run test:coverage

# E2E tests (requires dev server stopped on port 3001)
npm run test:e2e

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

### Environment Variables

| Variable              | Description                            | Example                                             |
| --------------------- | -------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string           | `postgresql://flock:flock@localhost:5433/flock_dev` |
| `POSTGRES_USER`       | PostgreSQL user (Docker)               | `flock`                                             |
| `POSTGRES_PASSWORD`   | PostgreSQL password (Docker)           | `flock`                                             |
| `POSTGRES_DB`         | PostgreSQL database name (Docker)      | `flock_dev`                                         |
| `JWT_SECRET`          | Secret for signing JWTs (min 32 chars) | `openssl rand -base64 32`                           |
| `NEXT_PUBLIC_APP_URL` | App URL                                | `http://localhost:3000`                             |
| `NODE_ENV`            | Environment                            | `development`                                       |

## Stack

### Why this stack?

| Technology    | Choice                       | Rationale                                                                                                                                                                                |
| ------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | Next.js 15 (App Router)      | Full-stack in one project. Route Handlers for API, Server Components for reads. One Dockerfile, one deploy. Chose v15 over v16 for LTS stability and mature ecosystem in a 72h timeline. |
| **Language**  | TypeScript                   | End-to-end type safety. Shared types between API and frontend without duplication.                                                                                                       |
| **Database**  | PostgreSQL 16                | Robust relational DB. Excellent for social graph queries, full ACID compliance.                                                                                                          |
| **ORM**       | Prisma 7                     | Type-safe queries, automatic migrations, built-in Studio for debugging. Adapter pattern for PostgreSQL.                                                                                  |
| **Auth**      | Custom JWT (jose + bcryptjs) | Brief requires custom auth. `jose` is Edge-compatible (works in Next.js middleware). `bcryptjs` is pure JS (no native bindings, works everywhere).                                       |
| **UI**        | Tailwind CSS + shadcn/ui     | Mobile-first utilities. shadcn provides accessible, customizable components without runtime overhead.                                                                                    |
| **Testing**   | Vitest + Playwright          | Vitest for fast unit/integration tests with happy-dom. Playwright for real browser E2E.                                                                                                  |

### Tradeoffs

- **Next.js full-stack vs separated backend**: One process, one Dockerfile, one deploy. Tradeoff: requires discipline to separate concerns (solved via hexagonal architecture).
- **Prisma vs raw SQL**: Prisma adds abstraction but delivers type safety, migrations, and Studio out of the box. For this scope, productivity wins over raw SQL control.
- **jose vs jsonwebtoken**: `jsonwebtoken` uses Node.js native crypto, incompatible with Edge runtime where middleware runs. `jose` uses Web Crypto API, works everywhere.
- **Next.js 15 vs 16**: v16 has breaking async API changes. For a 72h challenge, LTS stability reduces risk of debugging framework issues instead of building features.

## Architecture

### Hexagonal Architecture (Ports & Adapters)

```
src/
  core/                    # Domain layer (ZERO external dependencies)
    domain/
      entities/            # User, Tweet (pure TypeScript)
      value-objects/       # Email, Username, Password, TweetContent
    use-cases/
      ports/               # Interfaces (IUserRepository, ITweetRepository, etc.)
      auth/                # RegisterUser, LoginUser, GetCurrentUser
      tweets/              # CreateTweet, DeleteTweet, GetTimeline, GetTweetWithReplies
      follow/              # ToggleFollow, GetFollowers, GetFollowing, GetFollowStatus
      likes/               # ToggleLike
      search/              # SearchUsers
  infra/                   # Infrastructure adapters
    auth/                  # JoseAuthService (implements IAuthService)
    prisma/
      repositories/        # PrismaUserRepository, PrismaTweetRepository, etc.
      mappers/             # Domain <-> Prisma model mapping
      client.ts            # Prisma singleton
  app/                     # Next.js App Router (adapters to HTTP)
    api/                   # Route Handlers
    (auth)/                # Login/Register pages (no sidebar)
    profile/               # User profiles
    tweet/                 # Tweet detail/thread view
    search/                # User search
  components/              # React components
    auth/                  # AuthProvider, LoginForm, RegisterForm
    layout/                # Sidebar, MobileNav, ThemeToggle
    tweets/                # Timeline, TweetCard, TweetComposer, TweetThread
    follow/                # FollowButton
```

**Dependency rule**: `core/` has zero imports from `infra/` or `app/`. Route Handlers compose use cases with infra adapters via manual dependency injection.

### Data Model

```
User ──< Tweet (authorId)
User ──< Like (userId) >── Tweet (tweetId)
User ──< Follow (followerId) >── User (followingId)
Tweet ──< Tweet (parentId, self-ref for reply threads)
```

**Timeline query**: Fetches tweets from followed users + own tweets, filtered by `parentId IS NULL` (excludes replies), ordered by `createdAt DESC` with compound cursor pagination `(createdAt, id)` to avoid collisions.

**Cursor-based pagination**: Used instead of offset pagination. Offset breaks when new items are inserted (duplicates/skips). Cursor is a base64-encoded `{createdAt, id}` pair ensuring stable pagination.

### Authentication

- JWT signed with HS256 via `jose`, stored in httpOnly cookie (7-day expiry)
- Passwords hashed with bcryptjs (cost factor 12)
- Edge-compatible middleware (`src/middleware.ts`) verifies JWT for route protection
- Defense-in-depth: every Route Handler re-verifies the JWT, never trusts middleware alone

## Features

### Mandatory

- User registration and login (email + password)
- JWT-based authentication with protected routes
- User profiles (username, bio, avatar placeholder)
- Create and delete tweets (280 char limit)
- Timeline with infinite scroll (cursor-based pagination)
- Follow/unfollow users
- Followers and following counts on profiles
- Like/unlike tweets with visible count
- User search by name or username
- Fully responsive (mobile-first, 3 breakpoints)
- Dark mode support

### Bonus

- **Reply threads**: Reply to tweets with threaded visualization. Self-referential `parentId` FK. Tweet detail page shows parent + indented replies.
- **Docker**: `docker compose --profile full up` starts everything with one command.

## AI Tools Used

This project was built using **Claude Code** (Anthropic's CLI for Claude) with the **Spec-Driven Development (SDD)** workflow:

1. **Explore**: Research best practices, verify current versions, investigate tradeoffs
2. **Propose**: Define scope, approach, commit sequence
3. **Spec**: Write formal requirements with Given/When/Then scenarios
4. **Design**: Technical design with architecture decisions
5. **Tasks**: Atomic implementation checklist
6. **Apply**: Implement commit by commit
7. **Verify**: Smoke test the running application

Claude Code was used to:

- Generate the hexagonal architecture structure from the start
- Implement domain entities, value objects, and port interfaces
- Build all Prisma repositories with proper cursor pagination
- Create Route Handlers with zod validation
- Build React components with proper auth state management
- Write 82 unit tests achieving 97%+ coverage on core/infra
- Debug middleware location issue (must be in `src/` with src directory)
- Maintain consistent patterns across all features

The human directed architecture decisions, stack selection, and feature prioritization. AI executed the implementation following established patterns.

## Known Limitations

- No email verification on registration
- No password reset flow
- No image upload support
- Reply threads are 1 level deep (no nested replies)
- No real-time updates (polling-based)
- No rate limiting on API endpoints
- Search is basic (ILIKE) - would benefit from full-text search for production
