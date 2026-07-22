# Setup Guide

## Folder

docs/

## Filename

setup.md

## Purpose

This guide explains how to configure MatterMind after installation, including environment variables, project setup, and development configuration.

---

# Overview

Before running MatterMind, the required environment variables, dependencies, and services must be configured correctly.

---

# Environment Variables

Create a `.env` file inside the backend directory using the provided `.env.example`.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/mattermind
SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
MODEL_PATH=./ml/models/model.pkl
API_KEY=your_api_key
BLOCKCHAIN_RPC_URL=your_blockchain_rpc
```

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
python main.py
```

or

```bash
uvicorn main:app --reload
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

or

```bash
npm start
```

depending on the project configuration.

---

# Machine Learning Module Setup

Navigate to the ML directory:

```bash
cd ml
```

Install dependencies if required:

```bash
pip install -r requirements.txt
```

Run the ML service:

```bash
python main.py
```

---

# Database Configuration

Create a PostgreSQL database.

Example:

```sql
CREATE DATABASE mattermind;
```

Update the database credentials inside the `.env` file.

---

# Recommended Development Tools

- Visual Studio Code
- Git
- Postman
- PostgreSQL
- Docker Desktop (Optional)
- Python Virtual Environment

---

# Create a Python Virtual Environment

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

---

# Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# Install Node Packages

```bash
npm install
```

---

# Verify Setup

Ensure that:

- Backend server starts successfully.
- Frontend application loads correctly.
- Database connection is established.
- ML module is accessible.
- Environment variables are correctly configured.

---

# Folder Configuration

The project should have the following structure:

```
mattermind/
│
├── backend/
├── frontend/
├── ml/
├── docs/
├── assets/
├── README.md
```

---

# Common Setup Issues

## Environment variables not loading

Ensure the `.env` file is placed in the correct directory.

---

## Module import errors

Verify that all dependencies have been installed.

---

## Database connection failure

Check:

- Database server is running
- Username and password are correct
- Database URL is properly configured

---

## Port conflicts

Make sure the required ports are not already in use.

---

# Setup Complete

MatterMind is now configured for local development and testing.