# HoppAway — Deploy Guide

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env.local` and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Run locally:
   ```
   npm run dev
   ```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Connect repo to Vercel (vercel.com → New Project)
3. Add `VITE_ANTHROPIC_API_KEY` in Vercel → Project Settings → Environment Variables
4. Deploy → done

## Connect your domain (hoppaway.app)

In Vercel → Project → Settings → Domains → Add `hoppaway.app`
Then in your domain registrar (Porkbun/Cloudflare), point DNS to Vercel's nameservers.
