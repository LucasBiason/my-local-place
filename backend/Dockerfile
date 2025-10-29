# Multi-stage Dockerfile for MyLocalPlace Backend

# ============================================
# Stage 1: Base - Dependencies
# ============================================
FROM python:3.13-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# ============================================
# Stage 2: Test - Testing environment
# ============================================
FROM base AS test

# Install dev dependencies
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt

# Copy application code
COPY app/ ./app/

# Copy test files
COPY tests/ ./tests/
COPY pytest.ini ./
COPY .coveragerc ./

# Copy entrypoint
COPY --chmod=755 entrypoint.sh /entrypoint.sh

# Set PYTHONPATH for imports
ENV PYTHONPATH=/app

# Tests run via entrypoint
ENTRYPOINT ["/entrypoint.sh"]
CMD ["test"]


# ============================================
# Stage 3: Production - Clean and minimal
# ============================================
FROM base AS production

# Copy only production code
COPY app/ ./app/

# Expose port
EXPOSE 8000

# Copy and set entrypoint
COPY --chmod=755 entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["runserver"]
