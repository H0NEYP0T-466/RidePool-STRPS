# Setup Guide

This guide will help you set up and run the RidePool STRPS application.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Python** (v3.10 or higher)
   - Download from: https://www.python.org/
   - Verify installation: `python --version`

3. **MongoDB** (v6.0 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas for cloud hosting

---

## Frontend Setup

### 1. Navigate to Project Root

```bash
cd ridepool-strps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8888
VITE_SOCKET_URL=http://localhost:8888
```

### 4. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# On macOS/Linux
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/strps
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=3600
PORT=8888
CORS_ORIGINS=*
```

### 5. Start MongoDB

Make sure MongoDB is running:

```bash
# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB from Services or run:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### 6. Run Seed Data

Populate the database with sample data:

```bash
python seed_data/seed.py
```

This will create:
- 10 regular users
- 5 drivers
- 5 admins
- 15 sample rides
- Sample bookings and feedback

### 7. Start Backend Server

```bash
uvicorn app.main:socket_app --host 0.0.0.0 --port 8888 --reload
```

The API will be available at `http://localhost:8888`

API documentation: `http://localhost:8888/docs`

---

## Running Both Frontend and Backend

### Option 1: Two Terminals

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:socket_app --host 0.0.0.0 --port 8888 --reload
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Option 2: Using a Process Manager

You can use tools like `pm2` or `concurrently` to run both.

---

## Test Credentials

After running the seed script, use these credentials:

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| User   | user1@ridepool.pk      | password123 |
| User   | user2@ridepool.pk      | password123 |
| Driver | driver1@ridepool.pk    | password123 |
| Driver | driver2@ridepool.pk    | password123 |
| Admin  | admin1@ridepool.pk     | password123 |

---

## Troubleshooting

### MongoDB Connection Error

```
Error: Could not connect to MongoDB
```

**Solutions:**
1. Check if MongoDB is running
2. Verify the `MONGO_URI` in your `.env` file
3. Try `mongodb://127.0.0.1:27017/strps` instead of localhost

### CORS Error

```
Access-Control-Allow-Origin error
```

**Solutions:**
1. Ensure `CORS_ORIGINS=*` is set in backend `.env`
2. Restart the backend server

### Module Not Found

```
ModuleNotFoundError: No module named 'xxx'
```

**Solutions:**
1. Make sure virtual environment is activated
2. Run `pip install -r requirements.txt` again

### Port Already in Use

```
Address already in use
```

**Solutions:**
1. Find the process using the port: `lsof -i :8888`
2. Kill the process: `kill -9 <PID>`
3. Or use a different port

### JWT Token Expired

```
401 Unauthorized - Token expired
```

**Solutions:**
1. Log in again to get a new token
2. Tokens expire after 1 hour (3600 seconds)

---

## Development Tips

### Hot Reloading

- Frontend: Enabled by default with Vite
- Backend: Use `--reload` flag with uvicorn

### API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8888/docs`
- ReDoc: `http://localhost:8888/redoc`

### Database Management

Use MongoDB Compass for a GUI to manage your database:
- Download: https://www.mongodb.com/products/compass

### ESLint

Run linting:
```bash
npm run lint
```

---

## Production Deployment

### Frontend

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` directory to a static hosting service like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront

### Backend

1. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn app.main:socket_app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. Deploy to:
   - AWS EC2 / ECS
   - Google Cloud Run
   - DigitalOcean Droplet
   - Heroku

3. Use a managed MongoDB service:
   - MongoDB Atlas
   - AWS DocumentDB
