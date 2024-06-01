
import datetime
import re

from database.db import get_db


def ok_to_update_password(user_id: int) -> bool:
    """
    Checks if the user has entered his old password in the last 10 minutes
    """
    db = get_db()
    cursor = db.cursor()
    cursor.execute(f"""
                                SELECT created FROM history
                                WHERE action = 'check password'
                                AND relative = {user_id}
                                ORDER BY id DESC LIMIT 1""")
    timestamp = cursor.fetchone()
    print("timestamp: ", timestamp["created"])
    created_time = datetime.datetime.strptime(timestamp["created"], "%Y-%m-%d %H:%M:%S")
    current_time = datetime.datetime.now()
    time_difference = (current_time - created_time).total_seconds() / 60
    print("difference: ", float(time_difference))
    if time_difference < 10:
        return True
    else:
        return False


def check_password(password1, password2) -> str:
    exceptions = {}
    exceptions["Password"] = []
    if password1 == password2:
        password = password1
    else:
        exceptions["Password"].append("Passwords don't match")
    pattern = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6}$"
    if not re.match(pattern, password):
        exceptions["Password"].append("Password is not valid")
    return exceptions
