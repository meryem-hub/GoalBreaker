from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# LOAD ENVIRONMENT VARIABLES FIRST
load_dotenv()

from app.core.config import settings
from app.db.database import engine, Base
from app.db.models import Goal, Task

# Create tables first
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

# CORS - ADD allow_methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://goal-breaker-nine.vercel.app",   
        "http://localhost:3000",
        "http://localhost:5173",
        "https://goal-breaker-nine.vercel.app/", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from app.api.v1.endpoints import goals, health

app.include_router(goals.router, prefix=settings.API_V1_STR, tags=["goals"])
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])

@app.get("/")
async def root():
    return {"message": "Smart Goal Breaker API is running!"}