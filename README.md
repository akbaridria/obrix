# Orbix

Orbix is an automated monitoring platform for detecting suspicious trading patterns in DeFi pools, powered by AI agents. It provides real-time insights into wash trading and pump & dump activities across Uniswap V4 pools.

## Features

- **AI-Powered Risk Detection:** Uses LLM agents to analyze swap data for wash trading and pump & dump risks.
- **Metrics Dashboard:** Monitors pool metrics such as TWAP, volatility, and mean reversion.
- **Alert System:** Displays detected wash trade and pump & dump events with detailed evidence.

## How it works
<img width="9421" height="10361" alt="obrix" src="https://github.com/user-attachments/assets/990ebf02-f2f2-4d24-9d42-8eee157bf2ec" />

## Project Structure

```
backend/
  ├── src/
  │   ├── db/           # Database schema and migration
  │   ├── llm-agent/    # AI agent logic
  │   ├── repository/   # Data access layer
  │   ├── routes/       # API endpoints
  │   ├── scripts/      # Pool data analysis
  │   ├── services/     # Business logic
  │   └── workers/      # Background job processing
  ├── backend/package.json
  ├── backend/drizzle.config.ts
  └── README.md

frontend/
  ├── src/
  │   ├── api/          # API client
  │   ├── components/   # UI components
  │   ├── config/       # App configuration
  │   ├── lib/          # Utilities
  │   └── providers/    # Context providers
  ├── frontend/package.json
  ├── frontend/vite.config.ts
  └── README.md
```
