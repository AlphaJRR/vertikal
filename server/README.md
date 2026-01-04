# VERTIKAL Server

Backend API server for the VERTIKAL platform.

## Tech Stack

- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Zod** - Validation

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and secrets.

3. **Set up database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed database
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Creators
- `GET /api/creators` - Get all creators
- `GET /api/creators/:id` - Get creator by ID
- `GET /api/creators/handle/:handle` - Get creator by handle

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show by ID
- `GET /api/shows/:id/related` - Get related shows
- `POST /api/shows` - Create show (auth required)
- `PATCH /api/shows/:id` - Update show (auth required)
- `POST /api/shows/:id/like` - Like a show

### Comments
- `GET /api/comments/show/:showId` - Get comments for a show
- `POST /api/comments` - Create comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)
- `POST /api/comments/:id/like` - Like a comment

### Tips
- `GET /api/tips/creator/:creatorId` - Get tips for a creator
- `GET /api/tips/show/:showId` - Get tips for a show
- `GET /api/tips/creator/:creatorId/total` - Get total tips for creator
- `POST /api/tips` - Create tip (auth required)

### Analytics
- `POST /api/analytics/track` - Track analytics event
- `GET /api/analytics/show/:showId` - Get analytics for a show
- `GET /api/analytics/show/:showId/stats` - Get analytics stats

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origin


