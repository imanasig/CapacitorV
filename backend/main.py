from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
import re

from database import engine, create_db_and_tables
from models import UserProgress, Report, DailyWarning
from services import generate_daily_warning

app = FastAPI(title="SafeLy API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session():
    with Session(engine) as session:
        yield session

def camel_to_snake(name: str) -> str:
    """
    Convert camelCase module names from frontend to snake_case DB columns.
    Example: upiCompleted -> upi_completed
    """
    # Replace capital letters with _lowercased letter
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

@app.get("/health")
def health_check():
    """Verify backend and DB connection."""
    try:
        with Session(engine) as session:
            # Simple query to check DB
            session.exec(select(UserProgress).limit(1)).all()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/api/progress/{uuid}", response_model=UserProgress)
def get_progress(uuid: str, session: Session = Depends(get_session)):
    """Fetch or initialize progress for a specific user UUID."""
    progress = session.get(UserProgress, uuid)
    if not progress:
        progress = UserProgress(uuid=uuid)
        session.add(progress)
        session.commit()
        session.refresh(progress)
    return progress

@app.post("/api/progress/{uuid}/mark")
def update_progress(uuid: str, payload: dict, session: Session = Depends(get_session)):
    """
    Update a specific module's completion status.
    Payload: {"moduleName": "upiCompleted"}
    """
    module_name = payload.get("moduleName")
    if not module_name:
        raise HTTPException(status_code=400, detail="moduleName is required")
        
    db_field = camel_to_snake(module_name)
    
    progress = session.get(UserProgress, uuid)
    if not progress:
        progress = UserProgress(uuid=uuid)
        session.add(progress)
    
    if hasattr(progress, db_field):
        setattr(progress, db_field, True)
    else:
        raise HTTPException(status_code=400, detail=f"Invalid module name: {module_name}")
    
    session.commit()
    session.refresh(progress)
    return {"status": "success", "progress": progress}

# --- Community Siren Routes ---

@app.get("/api/reports/recent", response_model=List[Report])
def get_recent_reports(session: Session = Depends(get_session)):
    return session.exec(select(Report).order_by(Report.timestamp.desc()).limit(20)).all()

@app.post("/api/reports", response_model=Report)
def create_report(report: Report, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    session.add(report)
    session.commit()
    session.refresh(report)
    # Generate AI warning in background
    background_tasks.add_task(generate_warnings_background, report.id)
    return report

def generate_warnings_background(report_id: int):
    with Session(engine) as session:
        report = session.get(Report, report_id)
        if report:
            warning = generate_daily_warning([report])
            session.add(warning)
            session.commit()

@app.get("/api/warnings", response_model=List[DailyWarning])
def get_warnings(session: Session = Depends(get_session)):
    return session.exec(select(DailyWarning).order_by(DailyWarning.timestamp.desc()).limit(10)).all()

@app.get("/api/warnings/today", response_model=DailyWarning)
def get_latest_warning(session: Session = Depends(get_session)):
    warning = session.exec(select(DailyWarning).order_by(DailyWarning.timestamp.desc())).first()
    if not warning:
        # Generate fallback if no warnings yet
        reports = session.exec(select(Report).order_by(Report.timestamp.desc()).limit(5)).all()
        warning = generate_daily_warning(reports)
        session.add(warning)
        session.commit()
        session.refresh(warning)
    return warning
