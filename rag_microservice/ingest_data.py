from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import time
import os
from pinecone_text.sparse import BM25Encoder
from sparse_vectors.vocab_save import train_and_save_bm25
from pinecone import Pinecone
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

# 1. Initialize API clients outside the function so they are reused across API calls
api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=api_key)
index_name = "ragproject"
index = pc.Index(index_name)
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

def process_and_upload_pdf(file_path: str, user_id: str, document_id: str, filename: str):
    """
    Processes a PDF file and uploads hybrid vectors to Pinecone, 
    tagged with the user's specific ID and document ID.
    """
    print(f"Loading document: {filename} for user: {user_id}")
    
    # 2. Initialize the loader with the dynamic file path from FastAPI
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    # 3. Splitting the document
    text_splitter = RecursiveCharacterTextSplitter(
       chunk_size=2200,
       chunk_overlap=150
    )
    chunks = text_splitter.split_documents(documents)

    # 4. Sparse Vectors (BM25)
    text_chunks = [doc.page_content for doc in documents]
    
    # We save a unique BM25 vocabulary PER USER so they don't overwrite each other
    os.makedirs("./sparse_vectors", exist_ok=True)
    vocab_path = f"./sparse_vectors/{user_id}_bm25_vocab.json"
    
    train_and_save_bm25(text_chunks, vocab_path)

    bm25_encoder = BM25Encoder()
    bm25_encoder.load(vocab_path)
    print("✅ BM25 Vocabulary Loaded!")

    print(f"\nUploading {len(chunks)} chunks to Pinecone... this might take a moment.")

    # 5. Upload the chunks to your cloud database!
    batch_size = 10
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        
        texts = [doc.page_content for doc in batch]
        metadatas = []
        
        for doc in batch:
            m = doc.metadata.copy() 
            m["text"] = doc.page_content 
            
            # --- CRITICAL MICROSERVICE ADDITION ---
            # Attach the IDs so we can filter by them later!
            m["user_id"] = user_id
            m["document_id"] = document_id
            m["filename"] = filename 
            
            metadatas.append(m)
        
        # --- FIXING THE OVERWRITE BUG ---
        # Generate globally unique IDs using the document_id
        ids = [f"{document_id}_chunk_{j}" for j in range(i, i + len(batch))]
        
        # Generate vectors
        dense_vectors = embeddings_model.embed_documents(texts)
        sparse_vectors = bm25_encoder.encode_documents(texts)
        
        vectors_to_upload = []
        for j in range(len(batch)):
            vectors_to_upload.append({
                "id": ids[j],
                "values": dense_vectors[j],         
                "sparse_values": sparse_vectors[j], 
                "metadata": metadatas[j]
            })
        
        # Upsert the hybrid batch directly into Pinecone
        index.upsert(vectors=vectors_to_upload)
        
        print(f"✅ Uploaded chunks {i} to {i + len(batch) - 1}...")
        time.sleep(10) # Gemini cool-down
        
    print("\n🎉 Ingestion Complete!")
    return len(chunks) # Return the total number of chunks processed