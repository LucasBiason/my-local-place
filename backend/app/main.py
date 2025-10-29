"""MyLocalPlace Backend API - Main application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import containers_router, system_router, health_router

# Create FastAPI app
app = FastAPI(
    title="MyLocalPlace API",
    description="Dashboard API for managing Docker containers",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(containers_router)
app.include_router(system_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

