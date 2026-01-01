import psycopg2

# Use your updated DATABASE_URL (with port 6543 and encoded password)
DATABASE_URL = "dbname=postgres user=postgres.kfhphyzvjhmktpzitgfh password=Skorpion_1_2014_! host=aws-1-eu-north-1.pooler.supabase.com port=6543 sslmode=require"

try:
    conn = psycopg2.connect(DATABASE_URL)
    print("Connection successful!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")