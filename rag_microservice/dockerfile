# Use Python 3.11
FROM python:3.11-slim

# Set up a new user 'user' with UID 1000 to comply with Hugging Face security
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy requirements and install
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your RAG code
COPY --chown=user . .

# Hugging Face expects the app on port 7860 by default
# Change your code to listen on 7860 or set it here
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]