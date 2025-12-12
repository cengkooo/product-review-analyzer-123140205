"""Simple script to test if we can connect to PostgreSQL and create the database."""
import psycopg
import sys
from dotenv import load_dotenv
import os

load_dotenv()

# Parse DATABASE_URL
db_url = os.getenv('DATABASE_URL', 'postgresql+psycopg://postgres:postgres@localhost:5432/reviewdb')
# Remove the +psycopg part for psycopg connection
db_url = db_url.replace('postgresql+psycopg://', 'postgresql://')

print(f"Testing database connection...")
print(f"Database URL: {db_url}")

try:
    # Try to connect to the reviewdb database
    conn = psycopg.connect(db_url)
    print("✅ Successfully connected to reviewdb database!")
    conn.close()
except psycopg.OperationalError as e:
    if 'database "reviewdb" does not exist' in str(e):
        print("⚠️  Database 'reviewdb' does not exist. Creating it...")
        
        # Connect to default 'postgres' database to create reviewdb
        default_url = db_url.rsplit('/', 1)[0] + '/postgres'
        try:
            conn = psycopg.connect(default_url, autocommit=True)
            cursor = conn.cursor()
            cursor.execute('CREATE DATABASE reviewdb;')
            print("✅ Database 'reviewdb' created successfully!")
            cursor.close()
            conn.close()
        except Exception as create_error:
            print(f"❌ Error creating database: {create_error}")
            print("\nPlease create the database manually:")
            print("1. Open PostgreSQL (psql or pgAdmin)")
            print("2. Run: CREATE DATABASE reviewdb;")
            sys.exit(1)
    else:
        print(f"❌ Error connecting to PostgreSQL: {e}")
        print("\nPlease check:")
        print("1. PostgreSQL is running")
        print("2. Username/password in .env are correct")
        print("3. PostgreSQL is listening on localhost:5432")
        sys.exit(1)

print("\n✅ Database setup complete!")
