
##  How to Run the Project

###  Backend (FastAPI)

1. Open a terminal in the project root folder.

2. Start the backend server:

   ```bash
   uvicorn backend.main:app --reload
   ```
3. The backend will run at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### 💻 Frontend (Next.js / React)

1. Open another terminal and navigate to the frontend folder:

   ```bash
   cd frontend
   ```
2. Run the frontend:

   ```bash
   npm run dev
   ```
3. The frontend will be available at **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 Dependencies & Requirements

### 🧰 Frontend:

* **Framework:** Next.js / React.js
* **Styling:** CSS, inline styling
* **Libraries:**

  * `axios` → For API requests
  * `reactflow` → For flowchart visualization
  * `react-speech-recognition` / Web Speech API → For voice input
  * `react-icons`, `framer-motion` (if used)

To install dependencies:

```bash
npm install
```

---

### ⚙️ Backend:

* **Framework:** FastAPI
* **Server:** Uvicorn
* **AI APIs:** Google Gemini API (Generative AI)
* **Libraries:**

  * `fastapi`, `uvicorn`
  * `python-dotenv`
  * `google-generativeai`
  * `PyPDF2`, `python-docx`, `python-pptx`
  * `pytesseract`, `Pillow`
  * `transformers`, `torch`
  * `pandas`, `numpy`
  * `CORS Middleware`

Install all dependencies:

```bash
pip install -r requirements.txt
```


## ✅ Run Flow Summary

1. Start backend → `uvicorn backend.main:app --reload`
2. Start frontend → `npm run dev`
3. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
4. Upload files or chat with mentor — your **AI Learning Assistant** is ready! 🎓

