from qdrant_client import QdrantClient
from app.config.settings import settings, QdrantMode


def create_qdrant_client() -> QdrantClient:
    """
    Create and return configured Qdrant client
    based on environment settings.
    """

    if settings.QDRANT_MODE == QdrantMode.LOCAL:
        return QdrantClient(
            path=settings.QDRANT_PATH
        )

    if settings.QDRANT_MODE == QdrantMode.REMOTE:
        return QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
        )