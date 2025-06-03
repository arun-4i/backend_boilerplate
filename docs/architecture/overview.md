# Project Overview

## File Structure:
```
src/
├── config/           # Environment configs, database connections
├── controllers/      # Route handlers, request/response logic
├── services/         # Business logic layer
├── repositories/     # Data access layer
├── models/          # TypeScript interfaces, DTOs, entities
├── middleware/      # Authentication, validation, logging
├── utils/           # Helper functions, constants
├── types/           # Global type definitions
├── exceptions/      # Custom error classes
└── validators/      # Input validation schemas

tests/
├── unit/            # Service/utility tests
├── integration/     # API endpoint tests
├── fixtures/        # Test data
└── helpers/         # Test utilities

docs/
├── api/             # API documentation
└── architecture/    # System design docs
```
---

## Essential NPM Packages

### Framework & Core
- `express` + `@types/express`
- `typescript`, `ts-node`, `nodemon`
- `dotenv` for environment variables

### Security & Encryption
- `helmet` for security headers
- `bcrypt` for password hashing
- `crypto` (Node.js built-in) or `node-forge` for encryption
- `express-rate-limit` for rate limiting
- `cors` for CORS handling

### Validation & Middleware
- `joi` or `zod` for schema validation
- `express-validator` for request validation
- `morgan` for HTTP logging

### Database & ORM
- `typeorm` or `prisma` (if using SQL)
- `mongoose` (if using MongoDB)

### Logging & Monitoring
- `winston` for structured logging
- `express-winston` for request logging
- `@sentry/node` for error tracking

### Testing
- `jest` + `@types/jest`
- `supertest` for API testing
- `ts-jest` for TypeScript support

### Documentation
- `swagger-jsdoc` + `swagger-ui-express` for API docs

---

## Key Architectural Patterns

- **Dependency Injection:** Use `inversify` or simple factory patterns
- **Error Handling:** Centralized error middleware with custom error classes
- **Request/Response Pipeline:**  
    `Request → Middleware → Controller → Service → Repository → Database`  
    `Response ← Middleware ← Controller ← Service ← Repository ← Database`


