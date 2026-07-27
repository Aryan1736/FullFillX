# 🚀 FulfillX - Intelligent Warehouse Allocation & Order Fulfillment Optimization Engine

> A full-stack warehouse allocation platform inspired by modern e-commerce logistics systems such as Amazon and Flipkart. FulfillX intelligently selects the best warehouse to fulfill customer orders using a configurable weighted optimization algorithm based on distance, shipping cost, inventory availability, warehouse utilization, and capacity.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

---

# 📖 Table of Contents

- Overview
- Features
- Architecture
- Tech Stack
- Optimization Engine
- Project Structure
- Database Design
- API Endpoints
- Screenshots
- Getting Started
- Future Improvements
- Contributing
- License

---

# 📌 Overview

Modern e-commerce platforms often maintain multiple warehouses across different locations. When a customer places an order, the system must determine which warehouse should fulfill it.

Choosing the nearest warehouse is not always the best decision.

FulfillX evaluates multiple business factors including:

- 📍 Distance
- 💰 Shipping Cost
- 📦 Inventory Availability
- 🏭 Warehouse Capacity
- 📊 Warehouse Utilization

Using these parameters, the optimization engine calculates a weighted score for every eligible warehouse and selects the most suitable one while also providing a human-readable explanation for the decision.

---

# ✨ Features

## Warehouse Management

- Create warehouses
- Update warehouse details
- Delete warehouses
- View warehouse statistics

## Inventory Management

- Track inventory across warehouses
- Update stock
- Monitor inventory availability

## Customer Orders

- Create customer orders
- Multi-product support
- Automatic warehouse allocation

## Intelligent Optimization Engine

- Candidate warehouse generation
- Weighted scoring
- Configurable optimization weights
- Explainable allocation decisions

## Analytics Dashboard

- Warehouse utilization
- Order statistics
- Allocation history
- Inventory insights

## Interactive Map

- Display warehouse locations
- Geographic visualization

---

# 🏗 System Architecture

```text
                    React + TypeScript
                           │
                           ▼
                   Spring Boot REST API
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
     Controllers       Services      Optimization Engine
                           │
                           ▼
                    Spring Data JPA
                           │
                           ▼
                      PostgreSQL
```

---

# 🧠 Optimization Engine

The optimization engine is the core component of FulfillX.

Instead of selecting the nearest warehouse, it evaluates every eligible warehouse using weighted scoring.

## Scoring Factors

- Distance
- Shipping Cost
- Inventory Availability
- Warehouse Capacity
- Warehouse Utilization

### Workflow

```text
Customer Order
        │
        ▼
Generate Candidate Warehouses
        │
        ▼
Filter Eligible Warehouses
        │
        ▼
Calculate Scores
        │
        ▼
Rank Warehouses
        │
        ▼
Best Warehouse Selected
        │
        ▼
Generate Explanation
```

### Sample Formula

```
Final Score =
Distance × W₁
+ Shipping × W₂
+ Inventory × W₃
+ Capacity × W₄
+ Utilization × W₅
```

The warehouse with the highest final score is selected.

---

# 🛠 Tech Stack

## Backend

- Java 21
- Spring Boot 3.x
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- MapStruct
- Lombok
- Swagger / OpenAPI

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query
- Axios
- Recharts
- React Leaflet

---

# 📂 Project Structure

```text
FulfillX
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── mapper
│   ├── algorithm
│   ├── config
│   ├── exception
│   └── util
│
├── frontend
│   ├── pages
│   ├── components
│   ├── hooks
│   ├── services
│   ├── router
│   ├── types
│   ├── assets
│   └── utils
│
└── README.md
```

---

# 🗄 Database Design

## Main Entities

- Warehouse
- Product
- Inventory
- Customer
- CustomerOrder
- OrderLineItem
- Allocation

### Relationships

```text
Warehouse
    │
    ├──────── Inventory ─────── Product
    │
Customer
    │
CustomerOrder
    │
OrderLineItem
    │
Allocation
```

---

# 🔄 Request Lifecycle

```text
Customer

↓

React UI

↓

REST API

↓

Validation

↓

Service Layer

↓

Optimization Engine

↓

Warehouse Selected

↓

Inventory Updated

↓

Allocation Saved

↓

Response DTO

↓

Dashboard Updated
```

---

# 📡 REST APIs

## Warehouse

```
GET    /api/v1/warehouses
POST   /api/v1/warehouses
PUT    /api/v1/warehouses/{id}
DELETE /api/v1/warehouses/{id}
```

## Inventory

```
GET    /api/v1/inventory
POST   /api/v1/inventory
PUT    /api/v1/inventory/{id}
```

## Customer Orders

```
POST   /api/v1/customer-orders
GET    /api/v1/customer-orders
```

## Optimization

```
POST   /api/v1/optimization
```

## Analytics

```
GET    /api/v1/analytics
```

---

# ⚡ Key Design Decisions

- Layered Architecture
- DTO Pattern
- Repository Pattern
- Service Layer
- Explainable Optimization
- Transaction Management
- React Query for Server State
- Type-Safe APIs
- Stateless REST Services

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/FulfillX.git
```

---

## Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on

```
http://localhost:8080
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## PostgreSQL

Create database

```sql
CREATE DATABASE fulfillx;
```

Configure

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fulfillx
spring.datasource.username=postgres
spring.datasource.password=your_password
```

---

# 📈 Future Improvements

- Split Shipment Optimization
- Redis Caching
- Kafka Event Streaming
- Machine Learning Weight Tuning
- Route Optimization
- Demand Forecasting
- Microservices Architecture
- Kubernetes Deployment

---

# 🎯 Learning Outcomes

This project demonstrates:

- Full Stack Development
- Spring Boot Architecture
- React + TypeScript
- REST API Design
- Database Modeling
- Optimization Algorithms
- Explainable Decision Making
- Scalability Considerations
- Testing Strategies
- Production Readiness

---

# 👨‍💻 Author

**Aryan Bagchi**

---
⭐ If you found this project interesting, consider giving it a star!
