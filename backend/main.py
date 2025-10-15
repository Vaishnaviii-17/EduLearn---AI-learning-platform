from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import uvicorn
import os
from dotenv import load_dotenv

# ---------------------------
# Load environment variables
# ---------------------------
load_dotenv()

# ---------------------------
# Validate Gemini API Key
# ---------------------------
GEMINI_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_KEY:
    print("⚠️  GOOGLE_API_KEY not found in .env file. Please add it before running.")
else:
    print("✅ GOOGLE_API_KEY loaded successfully.")

# ---------------------------
# Routers (absolute imports)
# ---------------------------
from backend.routers import auth, assistant, explainer, virtual_mentor

# ---------------------------
# Setup FastAPI + Socket.IO
# ---------------------------
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
fastapi_app = FastAPI(title="AI Learning SuperApp (Gemini Powered)")

# ---------------------------
# Enable CORS for frontend
# ---------------------------
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://edu-learn-ai-learning-platform.vercel.app"  # ✅ Added vercel
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Include Routers
# ---------------------------
fastapi_app.include_router(virtual_mentor.router)
fastapi_app.include_router(auth.router)
fastapi_app.include_router(assistant.router)
fastapi_app.include_router(explainer.router)

# ---------------------------
# Root endpoint
# ---------------------------
@fastapi_app.get("/")
async def root():
    """
    Root endpoint to verify backend is running properly.
    """
    return {
        "message": "Backend running with FastAPI + Google Gemini 🚀",
        "gemini_enabled": bool(GEMINI_KEY),
        "frontend_allowed": [
            "https://edu-learn-ai-learning-platform.vercel.app"  # ✅ Added vercel
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
    }

# ---------------------------
# Wrap FastAPI with Socket.IO
# ---------------------------
app = socketio.ASGIApp(sio, fastapi_app)

# ---------------------------
# Socket.IO Event Handlers
# ---------------------------
@sio.event
async def connect(sid, environ):
    print(f"🔌 Client connected: {sid}")
    await sio.emit("server_message", {"msg": "Welcome to AI SuperApp (Gemini powered) 🎉"}, to=sid)

@sio.event
async def chat_message(sid, data):
    text = data.get("text", "")
    print(f"📩 Message from {sid}: {text}")
    await sio.emit("chat_message", {"text": f"Echo: {text}"})

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")

# ---------------------------
# Run server
# ---------------------------

from backend.routers import auth, assistant, explainer, virtual_mentor
if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 10000))  # Render assigns a dynamic port
    print(f"🚀 Starting FastAPI backend on 0.0.0.0:{port}")
    print("🌐 CORS Origins allowed: http://localhost:3000, http://127.0.0.1:3000")

    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)

# Include new router
fastapi_app.include_router(auth.router)
fastapi_app.include_router(assistant.router)
fastapi_app.include_router(explainer.router)
fastapi_app.include_router(virtual_mentor.router)  # ✅ NEW
