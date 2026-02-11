from enum import Enum


class QdrantMode(str, Enum):
    LOCAL = "local"
    REMOTE = "remote"
