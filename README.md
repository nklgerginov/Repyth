# Repyth - Web app template for webshop/webservice etc.

A high-performance fullstack application built with Python (FastAPI) and React.

## Features

- Fast and responsive API using FastAPI
- User authentication with JWT tokens
- Task management system with CRUD operations
- Modern React frontend with TypeScript
- Beautiful UI with Tailwind CSS
- Dark mode support
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Python (v3.9 or later)

### Installation

1. Clone the repository
2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
python -m venv venv
venv\scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

4. Create a `.env` file based on `.env.example`

### Development

Start both frontend and backend concurrently:

```bash
npm run dev
```

Or start them separately:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
uvicorn main:app --reload
```

## Project Structure

```
/
├── src/                    # Frontend source files
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── stores/             # State management
│   └── ...
├── backend/                # Python backend
│   ├── main.py             # FastAPI application
│   ├── utils.py            # Utility functions
│   └── data/               # Data storage
└── ...
```

## API Documentation

When running the backend, visit:
- http://localhost:8000/docs for Swagger UI
- http://localhost:8000/redoc for ReDoc

## License

MIT
