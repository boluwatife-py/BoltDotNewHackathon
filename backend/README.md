# SafeDoser Backend API

A comprehensive Python Flask backend service providing AI-powered medical assistance, user authentication, and supplement management for the SafeDoser application with Supabase integration.

## 🚀 Features

### 🔐 **Authentication & User Management**
- **JWT-based Authentication** - Secure token-based auth system
- **User Registration & Login** - Complete signup/signin flow
- **Profile Management** - Update user info, age, and avatar
- **Password Reset** - Forgot password functionality
- **Image Upload** - Avatar image processing and storage

### 💊 **Supplement Management**
- **CRUD Operations** - Create, read, update, delete supplements
- **Rich Data Model** - Dosage forms, timing, interactions, expiration
- **Image Support** - Upload supplement photos
- **User Isolation** - Each user's data is completely separate

### 🤖 **AI-Powered Chat Assistant**
- **Gemini AI Integration** - Advanced medical AI responses
- **Medical Knowledge Base** - Comprehensive supplement information
- **Context-Aware** - Understands user's supplement regimen
- **Chat History** - Persistent conversation storage
- **Safety-First** - Always recommends healthcare provider consultation

### 🗄️ **Database Integration**
- **Supabase Backend** - PostgreSQL with real-time capabilities
- **Row Level Security** - User data isolation and security
- **Optimized Queries** - Indexed for performance
- **ACID Compliance** - Reliable data transactions

## 📋 Prerequisites

- Python 3.9+
- Supabase account and project
- Google Gemini AI API key (optional, has fallback)

## 🛠️ Installation

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Wait for setup to complete

2. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run the contents of `database_schema.sql`
   - This creates all necessary tables and security policies

3. **Get Supabase Credentials**
   - Go to Settings > API in your Supabase project
   - Copy the Project URL and anon/public key

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
```

**Required Environment Variables:**
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET_KEY=your-super-secret-jwt-key
```

### 4. Get API Keys

**Supabase:**
1. Project URL and anon key from Settings > API

**Gemini AI (Optional):**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to `.env` file

## 🚀 Running the Server

### Development Mode
```bash
python app.py
```

### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "age": 45,
  "avatar": "data:image/jpeg;base64,..." // Optional
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

### 👤 User Profile Endpoints

#### Get Profile
```http
GET /user/profile
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /user/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "age": 46,
  "avatar": "data:image/jpeg;base64,..." // Optional
}
```

### 💊 Supplement Endpoints

#### Get All Supplements
```http
GET /supplements
Authorization: Bearer <access_token>
```

#### Create Supplement
```http
POST /supplements
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Vitamin D3",
  "brand": "Nature's Best",
  "dosage_form": "Softgel",
  "dose_quantity": "1",
  "dose_unit": "Softgel",
  "frequency": "Once daily",
  "times_of_day": {
    "Morning": ["08:00"],
    "Afternoon": [],
    "Evening": []
  },
  "interactions": ["Take with fat-containing meal"],
  "remind_me": true,
  "expiration_date": "2025-12-31",
  "quantity": "5000 IU",
  "image": "data:image/jpeg;base64,..." // Optional
}
```

#### Update Supplement
```http
PUT /supplements/<supplement_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Vitamin D3",
  "remind_me": false
}
```

#### Delete Supplement
```http
DELETE /supplements/<supplement_id>
Authorization: Bearer <access_token>
```

### 🤖 Chat Endpoints

#### Send Message
```http
POST /chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "What are the benefits of Vitamin D?"
}
```

#### Get Chat History
```http
GET /chat/history?limit=50
Authorization: Bearer <access_token>
```

#### Clear Chat History
```http
DELETE /chat/clear
Authorization: Bearer <access_token>
```

### 🏥 Health Check
```http
GET /health
```

## 🔒 Security Features

### 🛡️ **Authentication Security**
- JWT tokens with expiration
- Password hashing with bcrypt
- Refresh token rotation
- Secure token storage

### 🔐 **Database Security**
- Row Level Security (RLS) policies
- User data isolation
- SQL injection prevention
- Input validation and sanitization

### 🖼️ **Image Security**
- Image processing and validation
- Size limits and format restrictions
- Secure storage in Supabase
- User-specific access controls

### ⚕️ **Medical AI Safety**
- Never provides medical diagnoses
- Always recommends healthcare provider consultation
- Evidence-based information only
- Fallback responses when AI unavailable

## 🧪 Testing

### Run Tests
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run all tests
pytest

# Run with coverage
pytest --cov=app
```

### Test Coverage
- Authentication flows
- CRUD operations
- AI chat functionality
- Error handling
- Security policies

## 🚀 Deployment

### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

### Environment Variables for Production
```bash
export SUPABASE_URL="your-production-supabase-url"
export SUPABASE_ANON_KEY="your-production-anon-key"
export GEMINI_API_KEY="your-gemini-api-key"
export JWT_SECRET_KEY="your-super-secure-jwt-secret"
export FLASK_ENV="production"
```

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:8000 --timeout 120 app:app
```

## 🔧 Frontend Integration

### Update Frontend Auth Context

The backend is designed to work seamlessly with your existing frontend. Update your `AuthContext.tsx`:

```typescript
// Update login function
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setUser(data.user);
    return { success: true };
  } else {
    return { success: false, error: data.error };
  }
};
```

### Update Chat Hook

Update your `useChat.ts` to use the new backend:

```typescript
const sendMessage = async (message: string) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  // Handle response...
};
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique, Required)
- `password_hash` (Required)
- `name` (Required)
- `age` (Required, 13-120)
- `avatar_url` (Optional)
- `created_at`, `updated_at`

### Supplements Table
- `id` (Serial, Primary Key)
- `user_id` (Foreign Key to users)
- `name`, `brand`, `dosage_form`
- `dose_quantity`, `dose_unit`
- `frequency`, `times_of_day` (JSONB)
- `interactions` (JSONB Array)
- `remind_me` (Boolean)
- `expiration_date`, `quantity`
- `image_url` (Optional)
- `created_at`, `updated_at`

### Chat Messages Table
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to users)
- `sender` ('user' or 'assistant')
- `message` (Text)
- `timestamp`, `context` (JSONB)

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify URL and anon key are correct
   - Check if project is active
   - Ensure database schema is created

2. **JWT Token Issues**
   - Check JWT_SECRET_KEY is set
   - Verify token expiration settings
   - Ensure frontend sends Authorization header

3. **Image Upload Failures**
   - Check Supabase storage bucket exists
   - Verify storage policies are set
   - Ensure image size is reasonable

4. **AI Chat Not Working**
   - Gemini API key may be invalid
   - Check API quotas and billing
   - Fallback responses should still work

### Logs and Monitoring
```bash
# View application logs
tail -f app.log

# Check Supabase logs in dashboard
# Monitor API usage in Gemini AI Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is part of the SafeDoser application suite.

---

**🔗 Quick Links:**
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Google AI Studio](https://makersuite.google.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [JWT Documentation](https://flask-jwt-extended.readthedocs.io/)