from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool  # Import this

# Updated URL: Port 6543 for transaction mode, and URL-encode the '!' in password as '%21' to prevent parsing issues in SQLAlchemy
DATABASE_URL = "postgresql+psycopg2://postgres.kfhphyzvjhmktpzitgfh:Skorpion_1_2014_%21@aws-1-eu-north-1.pooler.supabase.com:6543/postgres"

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool  # Disable SQLAlchemy pooling; let Supabase handle it
    # Remove connect_args if not needed—SSL is enforced by Supabase
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()