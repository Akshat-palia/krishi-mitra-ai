from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str