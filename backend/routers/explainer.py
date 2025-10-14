from fastapi import APIRouter
from pydantic import BaseModel
import re
import google.generativeai as genai
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/explainer", tags=["explainer"])

# ----------------------------
# Load Gemini API Key
# ----------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("⚠️ GOOGLE_API_KEY not found. Using rule-based explanation fallback.")

class CodeInput(BaseModel):
    code: str

# ----------------------------
# Detect programming language
# ----------------------------
def detect_language(code: str) -> str:
    if re.search(r"\b(def|import|print|self)\b", code):
        return "Python"
    elif re.search(r"\b(public|class|System\.out\.println)\b", code):
        return "Java"
    elif re.search(r"#include\s*<|std::|cout|cin", code):
        return "C++"
    elif re.search(r"function|console\.log|let|const|var", code):
        return "JavaScript"
    elif re.search(r"SELECT|FROM|WHERE|INSERT|UPDATE", code, re.IGNORECASE):
        return "SQL"
    else:
        return "Unknown"

# ----------------------------
# Extract main features
# ----------------------------
def analyze_features(code: str):
    features = []
    if "import" in code:
        features.append("Imports external libraries or modules.")
    if "class " in code:
        features.append("Defines a class — used for object-oriented programming.")
    if "def " in code:
        features.append("Defines one or more functions.")
    if "for " in code or "while " in code:
        features.append("Contains loops — used for iteration.")
    if "if " in code or "elif " in code or "else:" in code:
        features.append("Uses conditional statements for decision-making.")
    if "return " in code:
        features.append("Returns values from a function.")
    if "print" in code or "console.log" in code:
        features.append("Displays output to the console.")
    if "input" in code or "cin" in code:
        features.append("Takes user input.")
    return features or ["No major code features detected."]

# ----------------------------
# Generate Explanation (Gemini or fallback)
# ----------------------------
def explain_with_ai(code: str, language: str):
    """Use Gemini for smart explanation (fallbacks if quota exceeded)."""
    try:
        model = genai.GenerativeModel("models/gemini-2.5-pro")
        prompt = (
            f"The following code is written in {language}.\n"
            "Explain what this code does step-by-step in a simple and structured way.\n"
            "Add short comments about logic, purpose, and data flow.\n\n"
            f"Code:\n{code}"
        )
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        print("⚠️ AI explanation failed:", e)

    # Fallback explanation (basic)
    explanation = []
    if "for" in code:
        explanation.append("Contains a loop that iterates through a sequence.")
    if "if" in code:
        explanation.append("Uses a conditional block to make decisions.")
    if "def" in code:
        explanation.append("Defines a function for code reuse.")
    if "return" in code:
        explanation.append("Returns values from a function.")
    if not explanation:
        explanation.append("General code detected without major constructs.")
    return "\n".join(explanation)

# ----------------------------
# Main Endpoint
# ----------------------------
@router.post("/explain")
async def explain_code(payload: CodeInput):
    code = payload.code.strip()
    if not code:
        return {"language": "None", "features": [], "explanation": "No code provided."}

    language = detect_language(code)
    features = analyze_features(code)
    explanation = explain_with_ai(code, language)

    return {
        "language": language,
        "features": features,
        "explanation": explanation
    }
