# ChatDocs 📚

> An AI-powered document interaction web application. Upload your documents and chat with them using natural language.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=flat-square&logo=express)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal?style=flat-square&logo=fastapi)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-purple?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.1-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📄 Project Documentation

- 📋 [Software Requirements Specification (SRS)](https://docs.google.com/document/d/1iPJQGYTfxtIQ-ISMZP_UTuQ22x7nrGHw/edit?usp=sharing&ouid=118303275329383100946&rtpof=true&sd=true)
- 🐙 [GitHub Repository](https://github.com/Deepanshu16012005/ChatDocs)

---

## 📖 Overview

ChatDocs is a full-stack AI-powered web application that allows users to upload documents and interact with them through a natural language chat interface. It is built as a MERN stack application with a Python-based RAG pipeline integrated as a separate microservice.

The system uses a **Hybrid Retrieval-Augmented Generation (RAG)** pipeline combining dense semantic search and sparse keyword search to deliver highly accurate, context-grounded answers from your uploaded documents.

---

## ✨ Key Features

- 🔐 **JWT Authentication** - Secure user registration and login with bcrypt password hashing
- 📄 **Document Upload** - Upload PDF files (up to 10MB) for AI processing
- 🔀 **Hybrid Search** - Combines dense vectors (Gemini embeddings) and sparse vectors (BM25) for best retrieval
- ⚖️ **Dynamic Alpha Weighting** - Automatically adjusts balance between keyword and semantic search based on query length
- 🏆 **Cohere Reranking** - Re-scores retrieved chunks using rerank-v3.5 for maximum relevance
- 💬 **Conversational Q&A** - Ask natural language questions and get document-grounded answers
- 📚 **Chat History** - Persistent chat history stored per session in MongoDB
- 🚫 **No Hallucination** - Strict system prompt ensures answers come only from uploaded documents
- ⚡ **Rate Limiting** - 20 requests per 15 minutes per user to prevent abuse

---

## 🏗️ Architecture

ChatDocs follows a microservices-based architecture with four independently deployable components:

```
User (Browser)
      │
      │ HTTPS
      ▼
React Frontend (Port 3000)
      │
      │ REST API
      ▼
Express Backend (Port 5000)
      │                    │
      │ Internal HTTP       │ Mongoose ODM
      ▼                    ▼
Python RAG            MongoDB Atlas
Microservice
(Port 8000)
      │
      ├──► Gemini API (Dense Embeddings)
      ├──► Groq API (LLM Generation + Query Reformulation)
      ├──► Cohere API (Reranking)
      └──► Pinecone (Hybrid Vector DB)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI Microservice | Python + FastAPI |
| Embeddings | Google Gemini (gemini-embedding-001) |
| LLM | Groq (llama-3.1-8b-instant) |
| Reranking | Cohere (rerank-v3.5) |
| Vector Database | Pinecone (Hybrid Dense + Sparse) |
| Sparse Vectors | BM25Encoder |
| Authentication | JWT + bcrypt |

---

## 📁 Project Structure

```
ChatDocs/
├── rag_microservice/              # Python RAG Microservice
│   ├── prompts/
│   │   ├── system.txt             # LLM answer generation prompt
│   │   └── query_formulator.txt   # Query reformulation prompt
│   ├── sparse_vectors/
│   │   ├── __init__.py
│   │   └── vocab_save.py          # BM25 vocabulary training utility
│   ├── main.py                    # FastAPI application
│   ├── rag.py                     # RAG pipeline logic
│   ├── reranker.py                # Cohere reranking logic
│   ├── ingest_data.py             # Document ingestion pipeline
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── backend/                       # Express Backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   ├── chatController.js
│   │   └── sessionController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Session.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── chatRoutes.js
│   │   └── sessionRoutes.js
│   ├── .env.example
│   └── server.js
│
├── frontend/                      # React Frontend (Coming Soon)
│
├── docker-compose.yml             # Coming Soon
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- Python 3.11+
- Git

### API Keys Required

You will need API keys from the following services:

| Service | Purpose | Get Key |
|---|---|---|
| MongoDB Atlas | Database | [mongodb.com](https://mongodb.com) |
| Pinecone | Vector Database | [pinecone.io](https://pinecone.io) |
| Google Gemini | Dense Embeddings | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| Groq | LLM Inference | [console.groq.com](https://console.groq.com/keys) |
| Cohere | Reranking | [dashboard.cohere.com](https://dashboard.cohere.com/api-keys) |

---

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Deepanshu16012005/ChatDocs.git
cd ChatDocs
```

---

### 2. Setup Python RAG Microservice

```bash
cd rag_microservice

# Create and activate virtual environment
python3.11 -m venv rag_env

# Windows
rag_env\Scripts\activate

# Mac/Linux
source rag_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
```

Fill in `rag_microservice/.env`:

```env
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
COHERE_API_KEY=your_cohere_api_key
```

**Pinecone Index Setup:**

Create an index in your Pinecone dashboard with:
- Index name: `ragproject`
- Dimensions: `3072`
- Metric: `dotproduct` (required for hybrid search)

**Start the microservice:**

```bash
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` to verify it is running.

---

### 3. Setup Express Backend

```bash
cd ../backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

Fill in `backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
RAG_MICROSERVICE_URL=http://localhost:8000
```

**Start the backend:**

```bash
node server.js
```

---

### 4. Setup React Frontend

```bash
cd ../frontend
# Coming Soon
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Login and receive JWT token |

### Documents

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/documents/upload | Yes | Upload a PDF document |
| GET | /api/documents | Yes | Get all documents for logged in user |

### Sessions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/sessions | Yes | Create a new chat session |
| GET | /api/sessions | Yes | Get all sessions |
| PATCH | /api/sessions/:sessionId | Yes | Update session title |

### Chat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/chat | Yes | Send a message and get AI response |
| GET | /api/chat/:sessionId | Yes | Get chat history for a session |

### RAG Microservice (Internal Only)

| Method | Endpoint | Description |
|---|---|---|
| POST | /process | Process and embed a document |
| POST | /query | Query documents and get AI answer |

---

## 🧠 RAG Pipeline

### Document Ingestion Flow

```
PDF Upload
    │
    ▼
PyPDFLoader loads document
    │
    ▼
RecursiveCharacterTextSplitter
chunk_size=2200, chunk_overlap=150
    │
    ▼
Train BM25Encoder on raw page text
Save vocabulary → {user_id}_bm25_vocab.json
    │
    ▼
For each batch of 10 chunks:
    ├── Gemini embeds → Dense Vector (3072 dimensions)
    ├── BM25 encodes → Sparse Vector
    └── Pinecone upsert: { id, values, sparse_values, metadata }
```

### Query and Answer Flow

```
User Question
    │
    ▼
Groq reformulates vague/follow-up into standalone query
    │
    ▼
Generate Gemini dense embedding for query
Generate BM25 sparse vector for query
    │
    ▼
Dynamic Alpha Weighting:
    ≤ 3 words → alpha=0.3 (keyword dominant)
    > 3 words → alpha=0.7 (semantic dominant)
    │
    ▼
Pinecone hybrid query (top_k=3)
    │
    ▼
Cohere rerank-v3.5 reranks results
(fallback to raw Pinecone results if Cohere fails)
    │
    ▼
Groq llama-3.1-8b-instant generates final answer
    │
    ▼
Answer + Page Number + File Source returned to user
```

---

## 🔒 Security

- All passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- All API keys stored as server-side environment variables only
- Python RAG Microservice is not publicly accessible
- Rate limiting: 20 requests per 15 minutes per authenticated user
- Pinecone queries filtered by user_id ensuring data privacy between users

---

## 🗄️ MongoDB Collections

| Collection | Description |
|---|---|
| users | User accounts (name, email, hashed password) |
| documents | Uploaded file metadata (filename, size, status) |
| sessions | Chat sessions scoped to each user |
| chats | All chat messages with role, content, sources, timestamp |

---

## 🔮 Coming Soon

- React Frontend with real-time chat interface
- Docker and Docker Compose setup
- Deployment to GCP Cloud Run / Railway / Render
- RAGAS evaluation pipeline
- Support for TXT and DOCX file formats

---

## 👨‍💻 Author

**Deepanshu Jindal**
- GitHub: [@Deepanshu16012005](https://github.com/Deepanshu16012005)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).