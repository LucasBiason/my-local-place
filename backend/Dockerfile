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
# Stage 2: Production - Clean and minimal
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
