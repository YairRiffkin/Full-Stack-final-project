from dataclasses import dataclass


@dataclass
class User:
    id: int
    username: str
    employee_id: str | None
    email: str | None
    location: str | None
    phone_number: str | None
    role: str | None
    authorization: str
