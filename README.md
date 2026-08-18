# Wardrobe AI

Your personal AI stylist — a web app that helps you manage your wardrobe and get intelligent outfit suggestions.

## Features

- **Wardrobe Management** — Add, edit, search, and categorize your clothing items
- **AI Outfit Suggestions** — Weather-aware, season-aware, occasion-based outfit recommendations
- **Weather Integration** — Real-time weather via Open-Meteo API
- **Saved Outfits** — Bookmark your favorite looks
- **AI Stylist Chat** — Context-aware fashion advice based on your wardrobe
- **Style Preferences** — Personalize by style, body type, colors, sizes, and weather sensitivity
- **Responsive Design** — Mobile bottom tabs, desktop top nav

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (auth + database)
- lucide-react (icons)
- Open-Meteo API (weather)

## Getting Started

```bash
npm install
npm run dev
```

Environment variables needed (see `.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
