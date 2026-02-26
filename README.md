# Apex — Deal Intelligence Dashboard

AI-powered commercial real estate deal intelligence dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Data Fetching:** TanStack React Query
- **PDF Viewer:** react-pdf

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment (optional):**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` to set `NEXT_PUBLIC_API_URL` if using a different backend.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The app redirects to `/dashboard`.

## Pages

- **`/dashboard`** — Portfolio overview with metric cards, deals table, and document upload
- **`/documents/[id]`** — Document detail with PDF viewer, extracted metrics, risk summary, and Q&A

## API Integration

The frontend expects these backend endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | List documents |
| POST | `/documents` | Upload document (multipart/form-data, `file` field) |
| GET | `/documents/{id}` | Get document details and metrics |
| POST | `/documents/{id}/query` | Ask question (JSON body: `{ question: string }`) |
| GET | `/documents/{id}/file` | Fetch PDF file (optional; if missing, PDF viewer shows error) |

## Design

- Linear-inspired dark theme
- Neutral slate palette
- Inter font
- Enterprise SaaS aesthetic
- No gradients, tight spacing, subtle borders
