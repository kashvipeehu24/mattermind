# ============================================================
# STAGE 1: BUILD REACT FRONTEND
# ============================================================

FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Copy frontend package definition
COPY ["frontend/landing pg/package.json", "./package.json"]
COPY ["frontend/landing pg/package-lock.json", "./package-lock.json"]

# Install frontend dependencies
RUN npm install

# Copy complete frontend source
COPY ["frontend/landing pg", "./"]

# Build React/Vite production application
RUN npm run build


# ============================================================
# STAGE 2: FASTAPI BACKEND
# ============================================================

FROM python:3.13-slim

WORKDIR /app


# ============================================================
# SYSTEM DEPENDENCIES
# ============================================================

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*


# ============================================================
# PYTHON DEPENDENCIES
# ============================================================

COPY backend/requirements.txt ./backend-requirements.txt
COPY requirements.txt ./root-requirements.txt

RUN pip install --no-cache-dir \
    -r backend-requirements.txt \
    -r root-requirements.txt


# ============================================================
# APPLICATION CODE
# ============================================================

COPY backend ./backend
COPY ai ./ai
COPY ml ./ml


# ============================================================
# COPY BUILT REACT FRONTEND
# ============================================================

COPY --from=frontend-builder /frontend/dist ./frontend_dist


# ============================================================
# ENVIRONMENT
# ============================================================

ENV PYTHONUNBUFFERED=1


# ============================================================
# PORT
# ============================================================

EXPOSE 8000


# ============================================================
# START FASTAPI
# ============================================================

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
