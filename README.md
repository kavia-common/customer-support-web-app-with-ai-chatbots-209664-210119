# customer-support-web-app-with-ai-chatbots-209664-210119 (Frontend)

Angular 19 standalone SPA implementing:
- Auth UI (login/register) + session storage
- RBAC route protection (admin route)
- Tickets UI (list/create/detail/update)
- Real-time chat UI using WebSocket (with basic reconnect)
- REST data layer via HttpClient

## Run locally

```bash
npm install
npm run start
```

App: http://localhost:4200

## Backend integration (required)

This frontend expects the backend container to provide:

- REST base URL: `http://localhost:8000`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
  - `GET /api/v1/auth/me` (optional)
  - `GET /api/v1/tickets`
  - `POST /api/v1/tickets`
  - `GET /api/v1/tickets/{id}`
  - `PATCH /api/v1/tickets/{id}`

- WebSocket base URL: `ws://localhost:8000`
  - `GET /ws/chat?token=...&ticketId=...`

The app uses placeholder globals `__API_BASE_URL__` and `__WS_BASE_URL__` in `src/environments/environment.ts`.
In deployment, the orchestrator/build pipeline should set these appropriately (or replace the file per environment).
"
