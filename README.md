# VocabSRS - Vocabulary Learning with Spaced Repetition System

A full-stack web application for vocabulary learning using AI-powered word definitions and spaced repetition algorithm (SRS) for optimal retention.

## 🌟 Features

- **AI-Powered Word Addition**: Automatically fetch word meanings, synonyms, and usage examples using Google Gemini API
- **Spaced Repetition System (SM-2 Algorithm)**: Optimized review scheduling based on your performance
- **Interactive Flashcards**: Review words with an engaging flashcard interface
- **Progress Tracking**: Monitor your learning with comprehensive statistics
- **Search Functionality**: Find words by name, meaning, or synonyms
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Token-based Authentication**: Secure user authentication with JWT

## 🏗️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication
- **Google Gemini API** - AI-powered word information
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** database (local or cloud)
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

## 🚀 Quick Start

### Method 1: Automated Setup (Windows)

1. **Extract the ZIP file**
2. **Run the setup script**:
   ```bash
   setup.bat
   ```
3. **Configure environment variables** (see Configuration section below)
4. **Initialize database**:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```
5. **Start the application**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

### Method 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

6. **Run database migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

7. **Start the backend server**:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5000`

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Configure frontend environment** (see Configuration section)

5. **Start the development server**:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Database URL
# Option 1: Local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/vocabsrs"

# Option 2: Supabase (Free) - https://supabase.com
# Option 3: Neon (Free) - https://neon.tech
# Option 4: Railway (Free tier) - https://railway.app

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Google Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key-here"

# Server Configuration
PORT=5000
NODE_ENV="development"

# Frontend URL (for CORS)
CORS_ORIGIN="http://localhost:5173"
```

### Frontend Environment Variables

Edit `frontend/.env`:

```env
# Backend API URL
# Development
VITE_API_URL=http://localhost:5000/api

# Production (after deployment)
# VITE_API_URL=https://your-backend-url.com/api
```

## 🗄️ Database Setup Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb vocabsrs`
3. Update `DATABASE_URL` in `.env`

### Option 2: Supabase (Recommended for Free Hosting)
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (use "Connection pooling" for better performance)
5. Update `DATABASE_URL` in `.env`

### Option 3: Neon (Serverless PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

### Option 4: Railway
1. Sign up at [railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

## 🌐 Deployment

### Backend Deployment

#### Option 1: Railway (Recommended - Free Tier Available)
1. Sign up at [railway.app](https://railway.app)
2. Create new project > Deploy from GitHub
3. Select your backend folder
4. Add environment variables in Railway dashboard
5. Railway will auto-deploy on push

#### Option 2: Render
1. Sign up at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install && npx prisma generate`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

#### Option 3: Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET="your-secret"
heroku config:set GEMINI_API_KEY="your-key"

# Deploy
git push heroku main
```

### Frontend Deployment

#### Option 1: Vercel (Recommended - Free)
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `frontend` folder
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`
5. Deploy

#### Option 2: Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop the `frontend/dist` folder after running `npm run build`
3. Or connect via GitHub for auto-deployment
4. Add environment variable in Netlify dashboard

#### Option 3: GitHub Pages (Static only)
```bash
cd frontend
npm run build

# Deploy dist folder to GitHub Pages
```

## 📱 Usage Guide

### 1. Register/Login
- Create an account or login with existing credentials

### 2. Add Words
- Navigate to "Add Word"
- Enter any English word
- AI will automatically fetch meaning, synonyms, and usage examples
- Word is added to your vocabulary with initial SRS parameters

### 3. Review Words
- Click "Review" to start a review session
- System shows words that are due for review based on SRS algorithm
- Click the flashcard to reveal the answer
- Rate your recall from 0-5:
  - **0**: Complete blackout (didn't remember at all)
  - **1**: Incorrect, but the correct answer seemed familiar
  - **2**: Incorrect, but remembered the correct answer
  - **3**: Correct response with significant effort
  - **4**: Correct response after some hesitation
  - **5**: Perfect response with immediate recall

### 4. Track Progress
- View statistics on the Dashboard
- See total words, due reviews, and learning progress
- Access complete word list with search functionality

## 🧮 Spaced Repetition Algorithm (SM-2)

The app uses the proven SM-2 algorithm:
- Words are initially scheduled for review after 1 day
- Based on your rating (0-5), the interval adjusts:
  - Rating < 3: Reset to 1 day
  - Rating ≥ 3: Increase interval based on ease factor
- Ease factor adjusts based on performance
- Optimal retention with minimal review time

## 🎨 Features Overview

### Dashboard
- Learning statistics
- Quick action buttons
- Progress overview

### Add Word Mode
- AI-powered word lookup
- Instant meaning, synonyms, and examples
- One-click word addition

### Review Mode
- Flashcard interface
- SRS-based scheduling
- Progress tracking
- Quality rating system (0-5)

### Word List
- Search by word, meaning, or synonym
- View all vocabulary
- Track review schedule
- Delete words

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: Can't reach database server
```
Solution: Check your DATABASE_URL and ensure PostgreSQL is running

**Gemini API Error**
```
Failed to fetch word information
```
Solution: Verify your GEMINI_API_KEY is valid and has quota remaining

**CORS Error**
```
Access to fetch blocked by CORS policy
```
Solution: Update CORS_ORIGIN in backend/.env to match your frontend URL

**Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
Solution: Kill the process using the port or change PORT in .env

### Reset Database
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Words (Protected)
- `POST /api/words/add` - Add new word
- `GET /api/words/all?search=query` - Get all words
- `GET /api/words/review/due` - Get words due for review
- `GET /api/words/review/next` - Get next word for review
- `POST /api/words/review/:id` - Submit review rating
- `DELETE /api/words/:id` - Delete word
- `GET /api/words/stats` - Get user statistics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for AI-powered word information
- SM-2 Algorithm by Piotr Wozniak
- Prisma for excellent ORM
- Vite for blazing fast builds

## 📞 Support

For issues, questions, or suggestions, please create an issue on GitHub.

---

**Happy Learning! 📚✨**
