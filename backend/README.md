# SafeDoser Backend API

A Python Flask backend service providing AI-powered medical assistance and supplement management for the SafeDoser application.

## Features

- 🤖 **Gemini AI Integration** - Advanced medical AI assistant
- 💊 **Supplement Knowledge Base** - Comprehensive supplement information
- ⚕️ **Medical Expertise** - Drug interactions, side effects, and safety guidance
- 👥 **Age-Aware Responses** - Personalized advice based on user age
- 🔒 **Safety-First Approach** - Always recommends healthcare provider consultation
- 📊 **Context-Aware** - Understands user's supplement regimen and history

## Quick Start

### 1. Installation

```bash
# Clone and navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your Gemini API key
# Get your API key from: https://makersuite.google.com/app/apikey
```

### 3. Run the Server

```bash
# Development mode
python app.py

# Production mode with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and configuration info.

### Chat with AI Assistant
```
POST /chat
```

**Request Body:**
```json
{
  "message": "What are the benefits of Vitamin D?",
  "context": {
    "userName": "John",
    "userAge": 45,
    "supplements": [
      {
        "name": "Vitamin D3",
        "time": "08:00",
        "tags": ["#Morning", "#Bone"],
        "type": "softgel",
        "completed": false,
        "muted": false,
        "alerts": []
      }
    ],
    "currentTime": "2024-01-15T10:30:00Z"
  },
  "chatHistory": [
    {
      "sender": "user",
      "text": "Hello"
    },
    {
      "sender": "assistant", 
      "text": "Hi! How can I help you today?"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "Vitamin D3 is excellent for bone health, especially important at 45! Best absorbed with fat-containing meals...",
  "timestamp": "2024-01-15T10:30:15Z",
  "status": "success"
}
```

### Get Supplement Information
```
GET /supplement-info/<supplement_name>?age=45
```

Returns detailed information about a specific supplement including benefits, side effects, interactions, and age-specific considerations.

## Medical Knowledge Base

The AI assistant has comprehensive knowledge about:

### Supplements Covered
- **Vitamin D3** - Bone health, immune support, calcium absorption
- **Omega-3** - Heart health, brain function, anti-inflammatory
- **Magnesium** - Muscle function, sleep quality, bone health
- **Vitamin C** - Immune support, antioxidant protection
- **Probiotics** - Digestive health, immune support
- **Melatonin** - Sleep regulation, circadian rhythm

### Medical Expertise Areas
- Drug interactions and contraindications
- Age-specific health considerations (40+, 50+)
- Supplement timing optimization
- Side effect monitoring
- Safety guidelines and warnings
- Medication adherence strategies

## Safety Features

### Built-in Safety Measures
- ✅ Always recommends healthcare provider consultation
- ✅ Never provides medical diagnoses
- ✅ Evidence-based information only
- ✅ Age-appropriate guidance
- ✅ Drug interaction warnings
- ✅ Clear safety disclaimers

### Fallback System
- Intelligent offline responses when Gemini API is unavailable
- Context-aware fallbacks using supplement data
- Medical safety maintained even in offline mode
- Graceful error handling with helpful alternatives

## Development

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

### Code Formatting
```bash
# Format code
black app.py

# Check code style
flake8 app.py
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Required |
| `FLASK_ENV` | Flask environment | `development` |
| `PORT` | Server port | `8000` |

## Deployment

### Using Gunicorn (Recommended)
```bash
# Install Gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

### Environment Setup for Production
```bash
# Set environment variables
export GEMINI_API_KEY="your-actual-api-key"
export FLASK_ENV="production"
export PORT="8000"

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## Security Considerations

- 🔐 **API Key Security** - Never commit API keys to version control
- 🛡️ **CORS Configuration** - Properly configured for frontend integration
- 📝 **Input Validation** - All inputs are validated and sanitized
- 🚫 **No Medical Diagnosis** - AI never provides medical diagnoses
- ⚕️ **Healthcare Provider Emphasis** - Always recommends professional consultation

## Troubleshooting

### Common Issues

1. **Gemini API Key Not Working**
   - Verify API key is correct
   - Check API key permissions
   - Ensure billing is enabled on Google Cloud

2. **CORS Errors**
   - Verify Flask-CORS is installed
   - Check frontend URL configuration

3. **Import Errors**
   - Ensure virtual environment is activated
   - Install all requirements: `pip install -r requirements.txt`

### Logs and Monitoring
The application logs all interactions and errors. Check console output for debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is part of the SafeDoser application suite.