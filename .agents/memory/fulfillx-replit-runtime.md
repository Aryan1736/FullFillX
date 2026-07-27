---
name: FulfillX Replit runtime
description: Durable runtime constraints for running the imported FulfillX full-stack app on Replit.
---

FulfillX must run its Spring Boot backend directly with Java 21 and Replit-managed PostgreSQL; the imported Docker Compose files remain for local development only.

**Why:** Replit's default Java toolchain exposed Java 19, which cannot compile the project's Java 21 source level, while Docker/container workflows are not the supported Replit runtime. The managed database is already provisioned and reachable.

**How to apply:** Keep the Replit launcher on Java 21, disable Spring's Docker Compose integration in that launcher, pass through the managed `PG*` variables, and expose the Vite frontend on port 5000 with a same-origin `/api` proxy.