from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class UserProgress(SQLModel, table=True):
    uuid: str = Field(default=None, primary_key=True)
    upi_completed: bool = Field(default=False)
    send_money_completed: bool = Field(default=False)
    qr_pay_completed: bool = Field(default=False)
    password_completed: bool = Field(default=False)
    install_app_completed: bool = Field(default=False)
    sms_completed: bool = Field(default=False)
    chat_completed: bool = Field(default=False)
    otp_scam_completed: bool = Field(default=False)
    fake_link_completed: bool = Field(default=False)
    fake_app_completed: bool = Field(default=False)
    social_eng_completed: bool = Field(default=False)
    deepfakes_completed: bool = Field(default=False)
    aadhaar_completed: bool = Field(default=False)
class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    author_uuid: str = Field(index=True)
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DailyWarning(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    scenario_json: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
