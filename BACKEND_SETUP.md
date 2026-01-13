# Backend CORS Setup Instructions

## Current Issue
Your frontend (running on `http://localhost:5174`) is being blocked by CORS policy when trying to access your backend API at `http://localhost:3000`.

## Quick Fix

### 1. Install CORS middleware in your backend:
```bash
npm install cors
```

### 2. Apply the CORS configuration from `backend-cors-setup.js`:

Copy the configuration from `backend-cors-setup.js` and add it to your main backend server file (usually `server.js`, `app.js`, or `index.js`):

```javascript
import cors from 'cors';
import express from 'express';

const app = express();

// CORS configuration - CRITICAL for frontend to work
const corsOptions = {
  origin: [
    'http://localhost:5174',  // Your current Vite dev server port
    'http://localhost:5173',  // Alternative Vite dev server port
    'http://localhost:3000',  // Alternative dev port
    'http://localhost:4173',  // Vite preview
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Your other middleware
app.use(express.json());

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/applicant", applicantRoutes);
// ... other routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 3. Restart your backend server

After applying the CORS configuration, restart your backend server completely.

## Troubleshooting

### If CORS errors persist:

1. **Check backend is running**: Make sure your backend is running on `http://localhost:3000`
2. **Check CORS order**: CORS middleware must be applied BEFORE your routes
3. **Check credentials**: Make sure `credentials: true` is set in both frontend and backend
4. **Check preflight**: Make sure you handle OPTIONS requests with `app.options('*', cors(corsOptions))`

### Common mistakes:
- ❌ Adding CORS headers in frontend (remove `Access-Control-Allow-Origin` from frontend)
- ❌ Wrong port in CORS origin (should be `5174` not `5173`)
- ❌ CORS middleware applied after routes
- ❌ Missing credentials: true

### Test CORS is working:
Open browser dev tools and check if you see this error:
- ❌ "Access to XMLHttpRequest... has been blocked by CORS policy"
- ✅ Should see successful API calls or proper error responses from your backend

## Current Frontend Configuration
Your frontend is already configured correctly with:
- `withCredentials: true`
- Proper error handling
- Correct API base URL (`http://localhost:3000`)

The issue is purely on the backend CORS configuration.