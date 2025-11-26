from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Goal Breaker API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # AI Service
    GEMINI_API_KEY: str
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Optional fields
    DATABASE_URL: Optional[str] = None
    SECRET_KEY: Optional[str] = None
    LOG_LEVEL: Optional[str] = None
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()