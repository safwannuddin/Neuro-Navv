from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ScanBase(BaseModel):
    file_name: str
    file_path: str
    file_size: int
    file_type: str

class ScanCreate(ScanBase):
    pass

class ScanResponse(BaseModel):
    message: str
    file_path: str
    status: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    id: Optional[str] = None
    created_at: Optional[datetime] = None

class ProcessingStatus(BaseModel):
    status: str
    message: str
    progress: Optional[float] = None
    error: Optional[str] = None

class AnalysisResult(BaseModel):
    scan_id: str
    anomalies: List[Dict[str, Any]]
    metrics: Dict[str, float]
    confidence_score: float
    processing_time: float
    created_at: datetime

class ModelData(BaseModel):
    scan_id: str
    model_url: str
    format: str
    size: int
    created_at: datetime

class Report(BaseModel):
    scan_id: str
    summary: str
    findings: List[Dict[str, Any]]
    recommendations: List[str]
    created_at: datetime

class ScanResult(BaseModel):
    scan_id: str
    status: str
    results: dict
    created_at: datetime
    updated_at: datetime
