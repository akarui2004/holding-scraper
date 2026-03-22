# NodeJS TypeScript OOP API

A robust, scalable, and well-structured NodeJS TypeScript API built with Object-Oriented Programming principles, featuring ExpressJS, MikroORM, PostgreSQL, and Redis.

## Features

- **NodeJS 22.17.1** with **TypeScript** for type-safe development
- **TOML Configuration** with multi-environment support
- **MikroORM** with PostgreSQL for database operations
- **Redis** for caching and performance optimization
- **ExpressJS** for RESTful API routing
- **Pino** for high-performance structured logging
- **OOP Architecture** with base classes and design patterns
- **Zod** for runtime validation

## Project Structure

```
src/
├── routes/
│   ├── index.ts                ← central router / mounts all groups
│   ├── api/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── product.routes.ts
│   ├── admin/
│   │   ├── index.ts
│   │   └── dashboard.routes.ts
│   ├── ops/
│   │   ├── index.ts
│   │   └── monitoring.routes.ts
│   └── web/                    (optional)
│       └── index.ts
│   │
│   ├── config/                   # Configuration management
│   │   ├── index.ts              # Config exports
│   │   ├── app.config.ts         # Application configuration class
│   │   ├── config.loader.ts      # TOML config loader (singleton)
│   │   ├── db.config.ts          # Database configuration class
│   │   ├── logger.config.ts      # Logger configuration class
│   │   ├── redis.config.ts       # Redis configuration class
│   │   └── security.config.ts    # Security configuration class
│   │
│   ├── controllers/              # Request handlers (controllers)
│   │   ├── index.ts              # Controller exports
│   │   └── base.controller.ts    # Base controller with common methods
│   │
│   ├── entities/                 # Database entities (MikroORM)
│   │   ├── index.ts              # Entity exports
│   │   └── base.entity.ts        # Base entity with common fields
│   │
│   ├── helpers/                  # Utility helper classes
│   │   ├── index.ts              # Helper exports
│   │   ├── date.helper.ts        # Date manipulation utilities
│   │   ├── string.helper.ts      # String manipulation utilities
│   │   └── validation.helper.ts  # Validation utilities
│   │
│   ├── loaders/                  # Application initialization
│   │   ├── index.ts              # Loader exports
│   │   ├── app.loader.ts         # Express app initialization
│   │   ├── database.loader.ts    # MikroORM connection management
│   │   └── redis.loader.ts       # Redis connection & cache service
│   │
│   ├── middlewares/              # Express middlewares
│   │   ├── index.ts              # Middleware exports
│   │   ├── error.middleware.ts   # Global error handler
│   │   ├── logger.middleware.ts  # Request logging
│   │   └── validation.middleware.ts # Zod validation middleware
│   │
│   ├── repositories/             # Data access layer
│   │   ├── index.ts              # Repository exports
│   │   └── base.repository.ts    # Base repository with CRUD operations
│   │
│   ├── services/                 # Business logic layer
│   │   ├── index.ts              # Service exports
│   │   └── base.service.ts       # Base service with common operations
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts              # Type exports
│   │   ├── common.types.ts       # Common interfaces
│   │   └── response.types.ts     # API response types
│   │
│   ├── utils/                    # Utility functions and classes
│   │   ├── index.ts              # Utility exports
│   │   ├── environment.ts        # Environment exporter
│   │   ├── logger.ts             # Pino logger wrapper
│   │   └── result.ts             # Result pattern for error handling
│   │
│   ├── migrations/               # Database migrations
│   │   └── .gitkeep
│   │
│   └── server.ts                  # Application entry point
│   │
├── config/                       # TOML configuration files
│   ├── default.toml              # Default configuration
│   ├── development.toml          # Development environment
│   ├── staging.toml              # Staging environment
│   ├── production.toml           # Production environment
│   └── test.toml                 # Test environment
│   │
├── logs/                         # Log files directory
├── tests/                        # Test files directory
├── .gitignore                    # Git ignore rules
├── .editorconfig                 # Editor style config
├── .eslintrc.json                # ESLint rules
├── .prettierignore               # Prettier ignore list
├── .prettierrc                   # Prettier format rules
├── tsconfig.json                 # TypeScript compiler config
└── package.json                  # NPM project metadata
```

## Architecture Overview

### Configuration System

The configuration system uses TOML files for environment-specific settings. Configuration is loaded in this order:

1. `default.toml` - Base configuration
2. `{environment}.toml` - Environment-specific overrides
3. Environment variables - Final overrides

```typescript
import { getConfig } from '@config';

const config = getConfig();
console.log(config.app.port); // Access app port
console.log(config.database.connectionString); // Get database URL
```

### Database Layer (MikroORM)

The database layer follows the Repository pattern with MikroORM:

```typescript
// Entity extending BaseEntity
@Entity()
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  name!: string;
}

// Service extending BaseService
export class UserService extends BaseService<User> {
  constructor(em: EntityManager) {
    super(em, 'User', 'UserService');
  }
}
```

### Redis Caching

Redis is used for caching with a clean API:

```typescript
import { CacheService } from '@loaders';

const cache = new CacheService();

// Get or set with callback
const user = await cache.getOrSet(
  `user:${userId}`,
  () => userService.findById(userId),
  3600 // TTL in seconds
);
```

### Logging System

Pino provides high-performance structured logging:

```typescript
import { logger, createContextLogger } from '@utils';

// Global logger
logger.info('Server started', { port: 3000 });

// Context-aware logger
const userLogger = createContextLogger('UserService');
userLogger.error('User not found', { userId: '123' });
```

### Request Flow

```
Request → Middleware → Controller → Service → Repository → Database
                ↓
              Logger
                ↓
            Response
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure your settings:
   - Edit `.env` for local overrides
   - Or modify TOML files in `config/` directory

## Usage

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Migrations

```bash
# Create a new migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migration
npm run migration:down
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Creating New Features

### 1. Create an Entity

```typescript
// src/entities/user.entity.ts
import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@entities';

@Entity()
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  name!: string;

  @Property()
  password!: string;
}
```

### 2. Create a Repository (Optional)

```typescript
// src/repositories/user.repository.ts
import { User } from '@entities';
import { BaseRepository } from '@repositories';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('UserRepository');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}
```

### 3. Create a Service

```typescript
// src/services/user.service.ts
import { EntityManager } from '@mikro-orm/core';
import { BaseService } from '@services';
import { User } from '@entities';

export class UserService extends BaseService<User> {
  constructor(em: EntityManager) {
    super(em, 'User', 'UserService');
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ email });
  }
}
```

### 4. Create a Controller

```typescript
// src/controllers/user.controller.ts
import { Router } from 'express';
import { BaseController } from '@controllers';
import { ValidationMiddleware, commonSchemas } from '@middlewares';
import { z } from 'zod';

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super('UserController');
  }

  initializeRoutes(): void {
    this.router.get(
      '/',
      this.asyncHandler(this.getAll.bind(this))
    );

    this.router.get(
      '/:id',
      ValidationMiddleware.validateParams(commonSchemas.id),
      this.asyncHandler(this.getById.bind(this))
    );

    this.router.post(
      '/',
      ValidationMiddleware.validateBody(
        z.object({
          email: z.string().email(),
          name: z.string().min(2),
          password: z.string().min(8),
        })
      ),
      this.asyncHandler(this.create.bind(this))
    );
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    const result = await this.userService.findAll();
    // Handle response...
  }
}
```

### 5. Register Route

```typescript
// src/routes/index.ts
import { UserController } from '@controllers';

// In initializeRoutes():
this.router.use('/users', userController.getRouter());
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/staging/production/test) | development |
| `APP_PORT` | Server port | 3000 |
| `APP_HOST` | Server host | 0.0.0.0 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | app_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `REDIS_PASSWORD` | Redis password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `LOG_LEVEL` | Log level (debug/info/warn/error) | info |

## License

MIT
