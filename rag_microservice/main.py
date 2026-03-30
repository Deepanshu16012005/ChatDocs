from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header, Request
from pydantic import BaseModel
from typing import List
import shutil
import os

# TODO: Import your existing logic here later
from ingest_data import process_and_upload_pdf
from rag import get_rag_answer

app = FastAPI(title="ChatDocs RAG Microservice")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["POST", "GET"],
    allow_headers=["*"]
)
INTERNAL_AUTH_KEY = os.getenv("INTERNAL_AUTH_KEY")
# --- Data Models ---
class ChatMessage(BaseModel):
    role: str
    content: str

class QueryRequest(BaseModel):
    query: str
    user_id: str
    chat_history: List[ChatMessage] = []
async def verify_auth(x_internal_key: Optional[str] = Header(None)):
    if INTERNAL_AUTH_KEY and x_internal_key != INTERNAL_AUTH_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Secret Key")
# --- Endpoints ---
@app.get("/")
async def root():
    return {"message": "ChatDocs RAG Microservice is running!"}


@app.post("/process")
async def process_document(
    document_id: str = Form(...),
    user_id: str = Form(...),
    filename: str = Form(...),
    filetype: str = Form(...),
    file_content: UploadFile = File(...)
):
    if filetype.upper() != "PDF":
        raise HTTPException(status_code=400, detail="Only PDF is supported.")

    # Save the uploaded file temporarily so PyPDFLoader can read it
    temp_file_path = f"./temp_{document_id}.pdf"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file_content.file, buffer)
    
    try:
        # TODO: Plug in your ingest_data.py logic here
        # Make sure to pass user_id and document_id to Pinecone as metadata!
        chunks_count = process_and_upload_pdf(
            file_path=temp_file_path,
            user_id=user_id,
            document_id=document_id,
            filename=filename
        )
        
        return {
            "status": "success",
            "message": f"Document {filename} processed and vectors stored.",
            "chunks_processed": chunks_count # Replace with actual count later
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/query")
async def query_document(request: QueryRequest):
    if not request.query or not request.user_id:
        raise HTTPException(status_code=400, detail="Missing query or user_id")

    try:
        # TODO: Plug in your rag.py logic here
        # Make sure to filter Pinecone search by request.user_id!
        answer, sources = get_rag_answer(
            query_text=request.query, 
            user_id=request.user_id, 
            chat_history=request.chat_history
        )
        
        return {
            "answer": answer,
            "sources": sources 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# 3. Port Configuration for Hugging Face
if __name__ == "__main__":
    import uvicorn
    # Hugging Face Spaces uses port 7860
    uvicorn.run(app, host="0.0.0.0", port=7860)