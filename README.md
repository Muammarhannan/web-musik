# LyricMotion

LyricMotion is a premium local-first music experience with immersive visuals, synchronized lyrics, and a polished dashboard.

## Features
- Local media upload for audio, album covers, and lyric files
- Modern audio player with playback controls and volume
- Playlist creation and management
- Live visualizer and lyric experience
- Responsive glassmorphism UI inspired by premium streaming products

## Local development

1. Install dependencies
   ```bash
   npm install
   ```
2. Start PostgreSQL locally
   ```bash
   docker compose up -d postgres
   ```
3. Copy the environment file
   ```bash
   copy .env.example .env
   ```
4. Run the app
   ```bash
   npm run dev
   ```

Open http://localhost:3000

## Project structure
- app/
- components/
- features/
- hooks/
- lib/
- services/
- utils/
- types/
- prisma/
- public/

## Tech stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma
- PostgreSQL
