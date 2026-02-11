from typing import Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from knowledgeai_rag_api.config.constants import QdrantMode


class Settings(BaseSettings):
    # LLM config
    LLM_API_KEY: Optional[str] = None
    LLM_PROVIDER: str
    LLM_MODEL: str

    # Qdrant config
    QDRANT_MODE: QdrantMode

    QDRANT_PATH: Optional[str] = None
    QDRANT_URL: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file="../../.env", env_prefix="RAG_CHATBOT_")

    @model_validator(mode="after")
    def validate_qdrant_config(self):

        if self.QDRANT_MODE == QdrantMode.LOCAL:
            if not self.QDRANT_PATH:
                raise ValueError(
                    f"QDRANT_PATH is required when QDRANT_MODE={QdrantMode.LOCAL}"
                )

        if self.QDRANT_MODE == QdrantMode.REMOTE:
            if not self.QDRANT_URL:
                raise ValueError(
                    f"QDRANT_URL is required when QDRANT_MODE={QdrantMode.REMOTE}"
                )

            if not self.QDRANT_API_KEY:
                raise ValueError(
                    f"QDRANT_API_KEY is required when QDRANT_MODE={QdrantMode.REMOTE}"
                )

        return self


settings = Settings()
