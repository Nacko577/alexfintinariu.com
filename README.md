# Personal Portfolio - Next.js

A modern personal portfolio website built with Next.js, deployed on Vercel.

## Features

- Modern, responsive design with dark/light theme toggle
- Projects showcase
- Education timeline
- Teams schedule page with live data (Manchester United, Baltimore Orioles, Baltimore Ravens, LA Lakers)
- Server-side API routes to bypass CORS restrictions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
FOOTBALL_API_KEY=your_api_key_here
MLB_API_KEY=your_api_key_here
NFL_API_KEY=your_api_key_here
NBA_API_KEY=your_api_key_here
```

**Note**: API keys no longer use `NEXT_PUBLIC_` prefix since they're only used server-side in API routes.

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `FOOTBALL_API_KEY`, `MLB_API_KEY`, `NFL_API_KEY`, `NBA_API_KEY`

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "Add New Project"

4. Import your GitHub repository

5. Add environment variables in the project settings:
   - `FOOTBALL_API_KEY`
   - `MLB_API_KEY`
   - `NFL_API_KEY`
   - `NBA_API_KEY`

6. Click "Deploy"

Vercel will automatically deploy on every push to your main branch.

## API Routes

The project uses Next.js API routes to proxy external API calls, avoiding CORS issues:

- `/api/teams/manutd` - Proxies football-data.org API for Manchester United

API keys are stored server-side (no `NEXT_PUBLIC_` prefix), keeping them secure.

## Project Structure

```
/
├── app/
│   ├── api/                # API routes (server-side)
│   │   └── teams/
│   │       └── manutd/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── teams/
│       └── page.tsx        # Teams page
├── components/             # React components
├── lib/                    # Utility functions and client-side API calls
├── styles/                 # Global CSS files
└── public/                 # Static assets
```

## Local Development

- Run `npm run dev` for development server
- Run `npm run build` to test production build
- Run `npm start` to test production build locally

## License

Private - All rights reserved.
