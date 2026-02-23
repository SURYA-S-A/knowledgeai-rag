# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-02-23

### Added
- Next.js frontend with knowledge bot chat interface
- File upload UI with document selection for focused retrieval
- Docker Compose setup with Qdrant, backend, and frontend services
- Containerized backend and frontend with multi-stage Dockerfiles

### Changed
- Project structure with `backend/` and `frontend/` folders

---

## [0.1.1] - 2026-02-08

### Changed
- Added support for both local and remote Qdrant instances.
- Updated dependencies to their latest stable versions.

---

## [0.1.0] - 2026-02-08

### Added
- FastAPI backend for knowledge retrieval and chatbot
- RAG pipeline using LangGraph and LangChain
- Vector storage with Qdrant
- Embeddings using Hugging Face Sentence Transformers
- File upload and document ingestion support
- Chatbot with conversation memory
- Tool-based reasoning and retrieval
- File-level filtering using metadata
- RESTful APIs for chat and document management