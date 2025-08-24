from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from root directory
root_dir = Path(__file__).parent.parent.parent.parent
load_dotenv(root_dir / ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "NeuroNav API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # AI Model Configuration
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/3d_unet.pth")
    DEVICE: str = os.getenv("DEVICE", "cuda" if os.getenv("USE_GPU", "false").lower() == "true" else "cpu")
    
    # Storage Configuration
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"  # Allow all origins in development
    ]

    class Config:
        case_sensitive = True

settings = Settings()
