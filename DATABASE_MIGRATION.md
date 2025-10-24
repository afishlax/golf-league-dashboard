# SQLite Database Migration Guide

## What's Been Set Up

I've created a SQLite database backend for your golf league dashboard:

### Backend Components:
1. **server/database.js** - Database initialization and schema
2. **server/server.js** - Express API server with REST endpoints
3. **server/golf-league.db** - SQLite database file (will be created automatically)

### Database Schema:

**teams table:**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- player1 (TEXT)
- player2 (TEXT)
- paymentStatus (TEXT)

**courses table:**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- par (INTEGER)
- slope (INTEGER)
- rating (REAL)

**scores table:**
- id (INTEGER PRIMARY KEY)
- teamId (INTEGER)
- courseName (TEXT)
- week (INTEGER)
- date (TEXT)
- player1Score (INTEGER)
- player2Score (INTEGER)
- teamTotal (INTEGER)

**handicaps table:**
- id (INTEGER PRIMARY KEY)
- playerName (TEXT UNIQUE)
- handicapIndex (REAL)

## API Endpoints

**Teams:**
- GET `/api/teams` - Get all teams
- GET `/api/teams/:id` - Get single team
- POST `/api/teams` - Create new team
- PUT `/api/teams/:id` - Update team
- DELETE `/api/teams/:id` - Delete team

**Courses:**
- GET `/api/courses` - Get all courses

**Scores:**
- GET `/api/scores` - Get all scores
- POST `/api/scores` - Submit new score

**Handicaps:**
- GET `/api/handicaps` - Get all handicaps
- POST `/api/handicaps` - Create/update handicap

## How to Use

### Option 1: Start Backend Server Only (Recommended for Now)
```bash
npm run server
```
This starts the API server on http://localhost:5000

### Option 2: Start Both Frontend and Backend Together
```bash
# Kill the current React server first
npm run dev
```
This runs both servers concurrently:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

## Benefits of SQLite over localStorage:

1. **Persistent across devices** - Data stored on server, not browser
2. **Multi-user access** - Multiple people can view/edit simultaneously
3. **Real database queries** - Can do complex queries, joins, etc.
4. **Backup-friendly** - Just copy the .db file
5. **Production-ready** - Can easily migrate to MySQL/PostgreSQL later

## Next Steps (Optional)

If you want to fully migrate to the database, I would need to:

1. Update `src/App.js` to fetch data from API instead of localStorage
2. Update all components to use API calls (fetch/axios)
3. Add loading states and error handling
4. Keep the Admin panel but have it call the API

**Do you want me to complete the migration to use the SQLite database?** This will replace localStorage entirely.

Or would you prefer to keep the current localStorage system since it's working?
