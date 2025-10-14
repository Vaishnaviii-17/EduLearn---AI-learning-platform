from fastapi import APIRouter, HTTPException
from backend.db.database import get_connection
from backend.schemas import UserCreate, UserLogin
from backend.utils.auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# -----------------------
# Signup Route
# -----------------------
@router.post("/signup")
def signup(user: UserCreate):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor(dictionary=True)

    # Check if email already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    existing = cursor.fetchone()
    if existing:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    # Insert new user
    hashed_pwd = hash_password(user.password)
    cursor.execute(
        "INSERT INTO users (username, email, hashed_password) VALUES (%s, %s, %s)",
        (user.username, user.email, hashed_pwd),
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"msg": "User created successfully 🚀"}


# -----------------------
# Login Route
# -----------------------
@router.post("/login")
def login(user: UserLogin):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    db_user = cursor.fetchone()
    cursor.close()
    conn.close()

    # Verify credentials
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    token = create_access_token({"sub": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}
