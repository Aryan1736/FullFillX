# FulfillX

FulfillX is a full-stack warehouse allocation and order fulfillment platform.

## Project overview

- `backend/`: Spring Boot 4.1 REST API using Java 21, Maven, Spring Data JPA, and PostgreSQL.
- `frontend/`: React 19, TypeScript, Vite, Tailwind CSS, and TanStack Query.
- `docker-compose.yml`: the original local Docker development setup. Replit runs the services directly instead of using Docker.

## Running on Replit

The `Start application` workflow runs `scripts/start-replit.sh`. It starts the Spring Boot API on port 8080 and the Vite frontend on port 5000. Vite proxies `/api` requests to the API.

The backend uses Replit's managed PostgreSQL connection variables (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`) when explicit Spring datasource variables are not provided. It initializes demo data the first time the database is empty.

The optimization flow can use OpenAI when `OPENAI_API_KEY` is configured as a Replit Secret. The application keeps a placeholder fallback so the rest of the app can start without that optional key.

## Useful commands

```bash
cd frontend && npm run build
cd backend && bash mvnw test
```