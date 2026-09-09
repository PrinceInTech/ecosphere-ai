from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    DEMO_MODE: bool = True
    DATABASE_URL: str = "sqlite+aiosqlite:///./ecosphere.db"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    MAX_UPLOAD_SIZE: int = 10_485_760
    ALLOWED_EXTENSIONS: list[str] = ["jpg", "jpeg", "png", "gif", "webp"]
    IBM_GRANITE_API_KEY: str = ""
    IBM_GRANITE_URL: str = ""
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ]


settings = Settings()
