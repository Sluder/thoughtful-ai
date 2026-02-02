# Thoughtful AI

## Project Setup

### Installation
This is a Vue.js + Vite + TypeScript project.

For the large part of my code, please see `\src\views\HomeView.vue`

Create the .env file & set `VITE_APP_OPEN_AI_API_KEY`
Feel free to reach out to me for an API key!
```sh
cp .env.example .env
```

Install dependencies
```sh
npm install
```

Run the UI
```sh
npm run dev
```

## Continuation

- Cleanup UI as this one is very simple. Would need to set up a branding kit within the tailwind.config.js
- Tune the prompt responses to be more 'support-like'. The agent sometimes can't find an answer with hallucinating facts not within the knowledge-base, but this can be improved.
- UI items can be contained within components

Thank you for the opportunity! - Zachary Sluder