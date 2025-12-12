## 👨‍💻 Author
Nama: Andryano Shevchenko Limbong
NIM: 12310205
Kelas: Pengembangan Aplikasi Website RA

# 🔍 Product Review Analyzer

AI-powered product review analysis using sentiment analysis and key insights extraction.

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 Overview

Product Review Analyzer is a full-stack web application that analyzes product reviews using advanced NLP techniques:

- **Sentiment Analysis**: Powered by Hugging Face's RoBERTa model
- **Key Points Extraction**: Using Google Gemini AI
- **Real-time Analysis**: Instant feedback on review sentiment
- **Review History**: Track all analyzed reviews with pagination
- **Modern UI**: Dark-themed, responsive interface

## ✨ Features

### Backend (Pyramid Framework)
- 🔥 RESTful API with 3 endpoints
- 🤖 Hugging Face sentiment analysis (cardiffnlp/twitter-roberta-base-sentiment)
- 🧠 Google Gemini AI for key points extraction
- 💾 PostgreSQL database for persistence
- ✅ Comprehensive input validation
- 🛡️ Graceful error handling

### Frontend (React + Vite)
- 🎨 Modern dark theme with vibrant colors
- 📝 Real-time character counter and validation
- 📊 Color-coded sentiment badges (😊 😐 😞)
- 📈 Animated confidence score progress bars
- 📚 Paginated review history
- 📱 Fully responsive design
- ⚡ Fast development with Vite HMR

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Vite)           │
│         http://localhost:5173           │
└──────────────┬──────────────────────────┘
               │ Vite Proxy (/api → :6543)
               ▼
┌─────────────────────────────────────────┐
│       Pyramid API Server                │
│       http://localhost:6543             │
│  ┌───────────────────────────────────┐  │
│  │  /api/health                      │  │
│  │  /api/analyze-review (POST)       │  │
│  │  /api/reviews (GET)               │  │
│  └───────────────────────────────────┘  │
└──────┬──────────────────┬───────────────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌──────────────┐
│  NLP Models │    │  PostgreSQL  │
│  - Sentiment│    │   reviewdb   │
│  - Gemini AI│    └──────────────┘
└─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python ≥ 3.10
- Node.js ≥ 18
- PostgreSQL ≥ 14
- Git

### 1. Clone Repository

```bash
git clone https://github.com/cengkooo/product-review-analyzer-123140205.git
cd product-review-analyzer-123140205
```

### 2. Setup Environment Variables

Create `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/reviewdb

# Google Gemini API (Get from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Hugging Face Model
HF_SENTIMENT_MODEL=cardiffnlp/twitter-roberta-base-sentiment

# Server Configuration
BACKEND_HOST=localhost
BACKEND_PORT=6543
```

### 3. Setup Backend

```bash
# Create virtual environment
cd app
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install the package
pip install -e .

# Go back to root
cd ..
```

### 4. Setup Database

```bash
# Create PostgreSQL database
# Option 1: Using psql
psql -U postgres
CREATE DATABASE reviewdb;
\q

# Option 2: Using Python script
python app/setup_db.py
```

### 5. Setup Frontend

```bash
cd resources
npm install
cd ..
```

### 6. Run Application

**Option 1: Manual (2 Terminals)**

Terminal 1 - Backend:
```bash
app\.venv\Scripts\pserve.exe app\development.ini
```

Terminal 2 - Frontend:
```bash
cd resources
npm run dev
```

**Option 2: Using Start Script (Windows)**
```bash
start.bat
```

### 7. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:6543
- **Health Check**: http://localhost:6543/api/health

## 📡 API Documentation

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Review Analyzer API is running"
}
```

### Analyze Review

```http
POST /api/analyze-review
Content-Type: application/json

{
  "review_text": "This product is amazing! Great quality."
}
```

**Response:**
```json
{
  "id": 1,
  "review_text": "This product is amazing! Great quality.",
  "sentiment": "positive",
  "sentiment_score": 0.9876,
  "key_points": [
    "Excellent product quality",
    "High customer satisfaction"
  ],
  "created_at": "2025-12-12T20:00:00+07:00"
}
```

**Validation:**
- `review_text`: Required, 10-5000 characters

### Get Reviews

```http
GET /api/reviews?page=1&limit=10
```

**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "review_text": "...",
      "sentiment": "positive",
      "sentiment_score": 0.9876,
      "key_points": ["..."],
      "created_at": "2025-12-12T20:00:00+07:00"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## 🛠️ Tech Stack

### Backend
- **Framework**: Pyramid 2.0.2
- **Database**: PostgreSQL with SQLAlchemy 2.0.36
- **Database Driver**: psycopg 3.2.3
- **Validation**: Pydantic 2.10.5
- **NLP**: 
  - Transformers 4.47.1
  - PyTorch 2.9.1
  - Google Generative AI 0.8.3
- **Server**: Waitress 3.0.0

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 7.2.7
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Google Fonts (Inter)

## 📁 Project Structure

```
product-review-analyzer/
├── app/                          # Backend (Pyramid)
│   ├── review_analyzer/
│   │   ├── __init__.py          # App initialization
│   │   ├── db.py                # Database config
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routes.py            # API routes
│   │   ├── views.py             # API handlers
│   │   └── services/
│   │       ├── sentiment.py     # HuggingFace sentiment
│   │       └── gemini.py        # Gemini key points
│   ├── development.ini          # Dev config
│   ├── production.ini           # Prod config
│   ├── requirements.txt         # Python deps
│   └── setup.py                 # Package config
│
├── resources/                    # Frontend (React)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # API client
│   │   ├── components/
│   │   │   ├── ReviewForm.jsx   # Input form
│   │   │   ├── ReviewResult.jsx # Results display
│   │   │   └── ReviewHistory.jsx# History list
│   │   ├── App.jsx              # Main component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html               # HTML template
│   ├── package.json             # Node deps
│   └── vite.config.js           # Vite config
│
├── .env                          # Environment variables
├── .env.example                  # Env template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🧪 Testing

All test scenarios have been verified:

- ✅ Positive review sentiment detection
- ✅ Negative review sentiment detection
- ✅ Neutral review sentiment detection
- ✅ Input validation (empty, too short, too long)
- ✅ Gemini API failure handling (graceful degradation)
- ✅ Database persistence
- ✅ Pagination
- ✅ CORS configuration
- ✅ Frontend-backend integration
- ✅ Responsive design

See [testing.md](testing.md) for detailed test documentation.

## 🐛 Troubleshooting

### Backend won't start

**Issue**: `ModuleNotFoundError` or import errors

**Solution**:
```bash
cd app
.venv\Scripts\activate
pip install -r requirements.txt
pip install -e .
```

### Database connection error

**Issue**: `psycopg.OperationalError: connection failed`

**Solutions**:
1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Ensure database `reviewdb` exists:
   ```bash
   python app/setup_db.py
   ```

### Frontend can't connect to backend

**Issue**: CORS errors or network errors

**Solutions**:
1. Ensure backend is running on port 6543
2. Check Vite proxy configuration in `resources/vite.config.js`
3. Verify no firewall blocking ports

### Gemini API errors

**Issue**: `429 Quota exceeded` or `404 Model not found`

**Solutions**:
1. **Quota exceeded**: Wait for quota reset or upgrade plan
2. **Invalid API key**: Check `GEMINI_API_KEY` in `.env`
3. **Model not found**: Verify model name in `services/gemini.py`

**Note**: Application works without Gemini (sentiment analysis still functions, key_points will be empty)

### Sentiment model download slow

**Issue**: First run downloads ~500MB model

**Solution**: This is normal. Model is cached after first download in:
```
C:\Users\<username>\.cache\huggingface\hub\
```

## 🔒 Security Notes

- Never commit `.env` file (already in `.gitignore`)
- Keep API keys secure
- Use environment variables for sensitive data
- In production, use HTTPS
- Consider rate limiting for API endpoints

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Built with ❤️ using Pyramid, React, and AI

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for sentiment analysis models
- [Google Gemini](https://ai.google.dev/) for key points extraction
- [Pyramid](https://trypyramid.com/) web framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)

---

**Need help?** Open an issue on GitHub or check the [troubleshooting section](#-troubleshooting).
