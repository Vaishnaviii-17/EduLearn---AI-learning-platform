# backend/routers/virtual_mentor.py
from fastapi import APIRouter, HTTPException, Query
from dotenv import load_dotenv
import google.generativeai as genai
import os

# ----------------------------
# Load environment variables
# ----------------------------
load_dotenv()
router = APIRouter(prefix="/mentor", tags=["virtual_mentor"])

# ----------------------------
# Configure Gemini API
# ----------------------------
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("❌ GOOGLE_API_KEY not found in .env file.")
genai.configure(api_key=GEMINI_API_KEY)

# ----------------------------
# Base endpoint
# ----------------------------
@router.get("/")
async def hello_mentor():
    return {"message": "🤖 Virtual AI Mentor is active and ready to help students!"}

# ----------------------------
# Chat endpoint (general)
# ----------------------------
@router.post("/chat")
async def mentor_chat(message: str = Query(..., description="Student's question or message")):
    """
    Chat-style mentor that gives friendly, clear, educational answers.
    """
    try:
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        prompt = (
            "You are a friendly virtual mentor who helps students understand concepts. "
            "Use short, clear, and supportive language. Avoid jargon unless explained simply.\n\n"
            f"Student: {message}\nMentor:"
        )
        response = model.generate_content(prompt)
        return {"reply": response.text.strip() if response and response.text else "I'm here to help!"}
    except Exception as e:
        print("⚠️ Mentor chat error:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------
# Context-based Mentor (uses uploaded summary or extracted text)
# ----------------------------
@router.post("/contextual")
async def mentor_with_context(
    message: str = Query(...),
    context: str = Query(...),
):
    """
    AI Mentor that answers based on uploaded content (e.g., summary or PDF text).
    """
    try:
        model = genai.GenerativeModel("models/gemini-2.5-pro")
        prompt = (
            "You are a helpful AI Mentor. Use the provided context to explain answers in simple, educational terms.\n\n"
            f"Context:\n{context[:4000]}\n\n"
            f"Student: {message}\nMentor:"
        )
        response = model.generate_content(prompt)
        return {"reply": response.text.strip() if response and response.text else "Let's explore that together!"}
    except Exception as e:
        print("⚠️ Contextual mentor error:", e)
        raise HTTPException(status_code=500, detail=str(e))
