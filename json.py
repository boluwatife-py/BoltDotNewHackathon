from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum
import re

class SupplementType(str, Enum):
    DEFAULT = "default"
    GUMMY = "gummy"
    LIQUID = "liquid"
    POWDER = "powder"
    SOFTGEL = "softgel"
    TABLET = "tablet"

class SupplementStatus(str, Enum):
    COMPLETED = "completed"
    MISSED = "missed"
    CURRENT = "current"
    DEFAULT = "default"

class SupplementAlert(BaseModel):
    message: str
    type: str

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ["interaction", "recall"]:
            raise ValueError("type must be 'interaction' or 'recall'")
        return v

class SupplementItem(BaseModel):
    id: int
    time: str
    name: str
    muted: bool
    tags: List[str]
    alerts: Optional[List[SupplementAlert]] = None
    type: SupplementType
    status: SupplementStatus

    @field_validator("time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        if not re.match(r"^([01]\d|2[0-3]):[0-5]\d$", v):
            raise ValueError("time must be in HH:mm format (e.g., '08:00', '13:20')")
        return v