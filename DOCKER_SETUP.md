# Docker PostgreSQL Setup

This guide shows how to set up PostgreSQL and Redis with Docker for the petition website.

## Prerequisites

Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

Or install Docker and Docker Compose separately:
```bash
# On macOS with Homebrew
brew install docker docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Quick Start

1. **Start PostgreSQL and Redis:**
```bash
docker-compose up -d
```

2. **Create your `.env.local` file:**
```env
# Docker PostgreSQL Configuration
DATABASE_URL="postgresql://petition_user:petition_password@localhost:5432/petition_db"

# Session Secret (generate a random 32+ character string)
SESSION_SECRET="your-super-secret-session-key-here-make-it-long-and-random-32chars"

# Site Configuration
SITE_BASE_URL="http://localhost:3000"

# Email Provider (configure one)
RESEND_API_KEY="your-resend-api-key"
# OR
# POSTMARK_SERVER_TOKEN="your-postmark-server-token"

# Rate Limiting with Docker Redis (optional)
RATE_LIMIT_REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV="development"
```

3. **Install Node.js dependencies:**
```bash
npm install
```

4. **Set up the database:**
```bash
# Generate Prisma client
npm run db:generate

# Apply schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

5. **Start the application:**
```bash
npm run dev
```

## Alternative: Individual Docker Commands

If you don't have Docker Compose, you can run containers individually:

### PostgreSQL:
```bash
# Create network
docker network create petition-network

# Run PostgreSQL
docker run -d \
  --name petition-postgres \
  --network petition-network \
  -e POSTGRES_DB=petition_db \
  -e POSTGRES_USER=petition_user \
  -e POSTGRES_PASSWORD=petition_password \
  -p 5432:5432 \
  -v petition_postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Check if it's running
docker ps
```

### Redis (optional):
```bash
# Run Redis
docker run -d \
  --name petition-redis \
  --network petition-network \
  -p 6379:6379 \
  -v petition_redis_data:/data \
  redis:7-alpine redis-server --appendonly yes
```

### Stop containers:
```bash
docker stop petition-postgres petition-redis
docker rm petition-postgres petition-redis
```

## Docker Commands

### Start services:
```bash
docker-compose up -d
```

### Stop services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs -f

# Just PostgreSQL
docker-compose logs -f postgres

# Just Redis
docker-compose logs -f redis
```

### Reset database (remove all data):
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
npm run db:seed
```

### Access PostgreSQL directly:
```bash
docker exec -it petition-postgres psql -U petition_user -d petition_db
```

### Access Redis directly:
```bash
docker exec -it petition-redis redis-cli
```

## Configuration Details

### PostgreSQL Container:
- **Image:** `postgres:15-alpine`
- **Database:** `petition_db`
- **User:** `petition_user`
- **Password:** `petition_password`
- **Port:** `5432`
- **Volume:** Persistent data storage

### Redis Container:
- **Image:** `redis:7-alpine`
- **Port:** `6379`
- **Persistence:** AOF enabled
- **Volume:** Persistent data storage

## Troubleshooting

### Connection Issues:
```bash
# Check if containers are running
docker-compose ps

# Check container health
docker-compose exec postgres pg_isready -U petition_user -d petition_db

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Reset Everything:
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove any orphaned containers
docker system prune

# Start fresh
docker-compose up -d
npm run db:push
npm run db:seed
```

### Database Issues:
```bash
# Check database exists
docker-compose exec postgres psql -U petition_user -c "\l"

# Check tables
docker-compose exec postgres psql -U petition_user -d petition_db -c "\dt"

# View Prisma logs
npx prisma studio
```

## Production Notes

For production, consider:
- Using environment variables for secrets
- Setting up proper backup strategies
- Using managed database services (AWS RDS, Google Cloud SQL, etc.)
- Implementing proper monitoring and alerting
- Using Redis Cluster for high availability
