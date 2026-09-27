import os
import psycopg2
from psycopg2 import Error
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.host = os.getenv("HOST")
        self.port = os.getenv("DB_PORT", "5432")
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("PASSWD")
        self.database = os.getenv("DATABASE")
        self.sslmode = os.getenv("DB_SSLMODE", "prefer")

    def executar_query(self, query: str, valores: tuple = None):
        try:
            with psycopg2.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database,
                client_encoding="UTF8",
                sslmode=self.sslmode
            ) as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute(query, valores)

                    if cursor.description:
                        result = cursor.fetchall()
                        conn.commit()
                        return result

                    conn.commit()
                    return True

        except Error as e:
            print(f"Erro no banco de dados: {e}")
            return None