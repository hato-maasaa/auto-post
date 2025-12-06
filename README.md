# One Source, Two Posts

This project is a sophisticated content generation and automation tool designed for freelance engineers to streamline their "One Source, Two Posts" workflow (Note & X).

## Features

- **One Input, Two Outputs**: Generate a long-form Note article and a short/threaded X post from a single topic.
- **AI-Powered**: Uses LLM (Mocked for demo, ready for OpenAI integration) content generation.
- **Automated Posting**:
  - **Note**: Uses Playwright to automate the browser, handling login sessions and drafting.
  - **X**: Uses Twitter API v2.
- **Dashboard**: A premium, "Glassmorphism" design dashboard to manage content.
- **Logging**: Keeps track of all posts in a local SQLite database.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Vanilla CSS (CSS Modules), Lucide React.
- **Backend API**: Next.js API Routes.
- **Database**: SQLite + Prisma.
- **Automation**: Playwright, twitter-api-v2.
- **Validation**: Zod, React Hook Form.

## Getting Started

### 1. Installation

```bash
npm install
npx playwright install chromium
```

### 2. Environment Setup

The `.env` file has been created. Open it and fill in your keys:

```bash
DATABASE_URL="file:./dev.db"

# X (Twitter) API Keys (Get from developer.twitter.com)
TWITTER_APP_KEY=""
TWITTER_APP_SECRET=""
TWITTER_ACCESS_TOKEN=""
TWITTER_ACCESS_SECRET=""

# Note Login (Optional, see below)
NOTE_EMAIL=""
NOTE_PASSWORD=""
```

### 3. Database

Initialize the database (if not already done):

```bash
npx prisma migrate dev --name init
```

### 4. Running the App

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Note Automation (Playwright)

The tool uses Playwright to interact with Note.com.
- **First Run**: When you click "Post to Note", a browser window will open. If you are not logged in, you can log in manually in that window. The script attempts to save your session state to `note-storage-state.json`.
- **Subsequent Runs**: The tool will use the saved session state to post automatically.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/features/dashboard/`: Main dashboard logic and UI.
- `lib/`:
  - `note-poster.ts`: Playwright automation logic.
  - `prisma.ts`: Database client.
  - `types.ts`: Zod schemas and types.
- `prisma/`: Database schema.
