import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",        # change this
            password="NewStrongPassword",  # change this
            database="learning_ai"
        )
        return conn
    except Error as e:
        print("Error:", e)
        return None
