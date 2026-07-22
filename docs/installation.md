# Installation Guide

## Folder

docs/

## Filename

installation.md

## Purpose

This guide explains how to install and configure MatterMind for local development.

---

# System Requirements

Before installing MatterMind, ensure your system meets the following requirements.

## Software Requirements

- Git
- Python 3.10 or later
- Node.js 18 or later
- npm or yarn
- PostgreSQL
- Docker (Optional)
- Visual Studio Code (Recommended)

---

# Clone the Repository

```bash
git clone https://github.com/<username>/mattermind.git
cd mattermind
```

---

# Install Backend Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

# Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

---

# Configure Environment Variables

Create a `.env` file using the provided `.env.example`.

Example:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
MODEL_PATH=your_model_path
```

---

# Database Setup

Create the project database.

Example:

```sql
CREATE DATABASE mattermind;
```

Run database migrations if available.

---

# Running the Backend

```bash
cd backend

python main.py
```

or

```bash
uvicorn main:app --reload
```

---

# Running the Frontend

```bash
cd frontend

npm start
```

or

```bash
npm run dev
```

depending on the frontend framework.

---

# Running the Machine Learning Module

```bash
cd ml

python main.py
```

*Command may vary depending on implementation.*

---

# Running the Entire Project

Open separate terminals for:

- Backend
- Frontend
- Machine Learning Module

Ensure all services are running before accessing the application.

---

# Verify Installation

Open your browser and navigate to:

```
http://localhost:3000
```

or

```
http://localhost:5173
```

depending on your frontend configuration.

---

# Common Installation Issues

### Python not found

Ensure Python is installed and added to your system PATH.

---

### Node.js not found

Install the latest LTS version of Node.js.

---

### Database Connection Error

Verify:

- Database is running
- Credentials are correct
- Environment variables are configured

---

### Missing Dependencies

Run:

```bash
pip install -r requirements.txt
```

or

```bash
npm install
```

again.

---

# Installation Complete

If all services start successfully, MatterMind is ready for local development.