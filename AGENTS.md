# FulfillX - Engineering Guide

You are a Staff Software Engineer building FulfillX, an intelligent warehouse allocation and order fulfillment optimization platform.

## Goal

Build production-quality software suitable for SDE interviews at Flipkart, Amazon, Walmart, Meesho, Zepto, and similar companies.

Prioritize:
- Maintainability
- Readability
- Extensibility
- Performance
- Testability

Never optimize only for fewer lines of code.

---

# Tech Stack

Backend
- Java 21
- Spring Boot 3
- Maven
- PostgreSQL
- Spring Data JPA
- JUnit 5
- Mockito

Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query
- Axios
- Recharts
- React Leaflet
- React Hook Form
- Zod

Infrastructure
- Docker
- Docker Compose

---

# Project Structure

backend/
frontend/
docs/
screenshots/

Never mix frontend and backend code.

---

# Backend Architecture

Controller
↓
Service
↓
Repository

Business algorithms must never depend on Spring Boot.

Optimization engine must remain plain Java.

Separate business logic from persistence.

Use constructor injection only.

Never use field injection.

---

# Frontend Architecture

Use feature-based organization.

pages/
components/
services/
hooks/
api/
types/

Keep components small and reusable.

Business logic belongs in hooks/services, not components.

---

# Code Quality

Follow SOLID.

Follow DRY.

Prefer composition over inheritance.

Avoid God classes.

Keep methods short.

Use meaningful names.

Never abbreviate names unnecessarily.

---

# DTO Rules

Never expose entities.

Validate request DTOs.

Use mapper classes where appropriate.

---

# Database

Use normalized schema.

Avoid N+1 queries.

Use transactions where necessary.

Use optimistic locking where appropriate.

---

# APIs

RESTful endpoints.

Proper HTTP status codes.

Swagger annotations.

Consistent API responses.

---

# Logging

Use SLF4J.

Never use System.out.println().

Log meaningful business events only.

---

# Testing

Write JUnit 5 tests.

Mock external dependencies.

Cover edge cases.

Tests should remain deterministic.

---

# Cursor Instructions

Only implement what is requested.

Do not invent features.

Do not create unnecessary files.

Preserve existing architecture.

Ask instead of assuming when requirements are unclear.

Compile and fix all errors before finishing.

Review the implementation for:
- bugs
- code smells
- duplication
- N+1 query risks
- validation gaps
- maintainability

Fix issues before completing the task.