# all database functions

import sqlite3
from pathlib import Path

from flask import g

from database.FinalDatabase.FinalExpansionLTMC import final_expansion_schema
from database.FinalDatabase.FinalLongTextData import long_text_schema
from database.FinalDatabase.FinalMaterialData import final_material_schema
from database.FinalDatabase.FinalAccountingData import final_accounting_schema
from database.FinalDatabase.FinalStorageData import final_storage_schema
from database.FinalDatabase.FinalPlantData import final_plant_data_schema
from database.FinalDatabase.FinalBasic import final_basic_schema

CURRENT_DIR = Path(__file__).parent
DB_PATH = CURRENT_DIR / "data.db"


def get_db() -> sqlite3.Connection:
    """Connect to the SQLite database, and return the connection object"""
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(_e=None) -> None:
    """Close the connection to the SQLite database"""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    """Create the tables in the SQLite database"""
    SCHEMA_PATH = CURRENT_DIR / "schema.sql"
    final_schema = (
        final_basic_schema() +
        final_plant_data_schema() +
        final_storage_schema() +
        final_accounting_schema() +
        final_material_schema() +
        long_text_schema() +
        final_expansion_schema()
        )
    db = sqlite3.connect(DB_PATH)
    db_schema = SCHEMA_PATH.read_text()
    cursor = db.cursor()
    cursor.executescript(db_schema)
    cursor.executescript(final_schema)
    db.commit()
    db.close()


if __name__ == "__main__":
    init_db()
