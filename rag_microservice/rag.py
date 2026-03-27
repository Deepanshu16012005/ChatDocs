import os
from dotenv import load_dotenv
from pinecone import Pinecone
from pinecone_text.sparse import BM25Encoder
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate 
from reranker import rerank_pinecone_matches

load_dotenv()

# 1. Setup Global Clients (Reused across requests)
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("ragproject")
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

# Answer Generation LLM
groq_llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2, max_retries=2)

# Query Reformulation LLM (Deterministic)
formulator_llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.0, max_retries=2)

# Load Prompts
with open("./prompts/system.txt", "r") as file:
    system_instruction = file.read()
prompt = ChatPromptTemplate.from_messages([
    ("system", system_instruction),
    ("user", "{question}")
])
rag_chain = prompt | groq_llm

with open("./prompts/query_formulator.txt" , "r") as file:
    formulator_instruction = file.read()
reformulator_prompt = ChatPromptTemplate.from_messages([
    ("system", formulator_instruction),
    ("user", "{question}")
])
reformulator_chain = reformulator_prompt | formulator_llm


def get_rag_answer(query_text: str, user_id: str, chat_history: list):
    """Takes a query, reformulates it, securely searches Pinecone, reranks, and returns the AI answer + sources."""
    
    # --- STEP 1: REFORMULATE QUERY ---
    history_text = ""
    if chat_history and len(chat_history) > 0:
        for h in chat_history[-2:]:
            role = "AI" if h.role == "assistant" else "User"
            history_text += f"{role}: {h.content}\n"

    formulated_response = reformulator_chain.invoke({
        "history": history_text,
        "question": query_text
    })
    actual_query = formulated_response.content.strip()
    print(f"Original: {query_text} --> Formulated: {actual_query}")


    # --- STEP 2: LOAD USER-SPECIFIC BM25 ---
    vocab_path = f"./sparse_vectors/{user_id}_bm25_vocab.json"
    if not os.path.exists(vocab_path):
        return "Please upload a document before asking questions.", []
        
    bm25_encoder = BM25Encoder()
    bm25_encoder.load(vocab_path)


    # --- STEP 3: GENERATE BOTH VECTORS & APPLY ALPHA ---
    dense_vec = embeddings_model.embed_query(actual_query)
    sparse_vec = bm25_encoder.encode_queries(actual_query)

    words = actual_query.split()
    alpha = 0.3 if len(words) <= 3 else 0.7
    
    scaled_dense = [v * alpha for v in dense_vec]
    scaled_sparse = {
        'indices': sparse_vec['indices'],
        'values': [v * (1 - alpha) for v in sparse_vec['values']]
    }


    # --- STEP 4: SECURE PINECONE QUERY ---
    query_results = index.query(
        vector=scaled_dense,
        sparse_vector=scaled_sparse,
        top_k=3,
        include_metadata=True,
        filter={"user_id": {"$eq": user_id}}  # CRITICAL: Ensures data privacy
    )
    print("Got Both Sparse and Dense Vectors From Database")


    # --- STEP 5: COHERE RERANKING & EXTRACTING SOURCES ---
    print("Reranking using COHERE")
    sources_to_return = []
    
    try:
        # Note: Ensure your rerank_pinecone_matches function can handle the metadata structure
        context_text, metadata = rerank_pinecone_matches(
            query=actual_query, 
            pinecone_matches=query_results['matches'], 
            top_n=3
        )
        print("Ranking successful")
        
        sources_to_return = metadata
             
    except Exception as e:
        print(f"Ranking Failed ERROR: {e}")
        context_pieces = []
        for match in query_results['matches']:
            page_num = match.metadata.get('page_label', 'Unknown')
            filename = match.metadata.get('filename', 'Unknown')
            formatted_chunk = f"--- (Page: {page_num} \n Source: {filename}) ---\n{match.metadata.get('text','')}"
            context_pieces.append(formatted_chunk)
            
            sources_to_return.append({"filename": filename, "page": page_num})
            
        context_text = "\n\n".join(context_pieces)
    
    if not context_text.strip():
        return "I cannot answer this based on the provided documents.", []
    # --- STEP 6: GENERATE FINAL ANSWER ---
    print("Generating answer using AI...")
    response = rag_chain.invoke({
        "context": context_text, 
        "question": actual_query
    })
    
    return response.content, sources_to_return