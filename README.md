# Knowledge RAG AI Bot

A two-layer architecture for building intelligent knowledge assistants using **LangGraph + LangChain**.

---

## Overview

**RAG Pipeline**
- Retrieval-augmented generation pipeline — takes a user query, fetches relevant documents from a vector store, and generates an answer using an LLM.
- Stateless and one-shot (no memory, no conversation).
- Supports file-level filtering via `selected_files` to restrict retrieval to specific uploaded documents.

**Knowledge Bot**
- An agentic chatbot built on top of the RAG Pipeline.
- Maintains conversation state and memory across turns.
- Uses tools (`rag_retrieval`, `calculator`, etc.) to answer user questions.
- Always searches uploaded documents via the RAG pipeline before fallback responses.
- Respects `selected_files` metadata for focused Q&A on chosen documents.

The separation is intentional — the RAG Pipeline is the retrieval and generation engine, while the Knowledge Bot is the chat agent with memory, reasoning, and tool use layered on top.

---

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Run

```bash
docker compose up --build -d
```

This starts three services:

| Service | Port | Description |
|---------|------|-------------|
| `knowledgeai-rag-qdrant` | 6333 | Qdrant vector store |
| `knowledgeai-rag-backend` | 8500 | FastAPI backend |
| `knowledgeai-rag-frontend` | 3000 | Next.js frontend |

### Configure

Each service has its own `.env` file:

```bash
backend/.env      # LLM API keys, Qdrant connection, embedding config
frontend/.env     # Backend API URL
```

---

## Usage

Open `http://localhost:3000/nextapp/bot/knowledge` in your browser.

Upload one or more documents, then start querying. The bot retrieves answers from your uploaded files. You can select specific files to restrict the search to those documents only.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Agent Orchestration | LangGraph + LangChain |
| Backend | FastAPI (Python) |
| Vector Store | Qdrant |
| Frontend | Next.js (TypeScript) |
| Containerization | Docker + Docker Compose |