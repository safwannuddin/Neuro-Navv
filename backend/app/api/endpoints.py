from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List
import os
import logging
from app.core.config import settings
from app.services.ai_service import process_scan, get_scan_results
from app.utils.file_utils import save_upload_file
from app.models.schemas import ScanResponse, ProcessingStatus
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/upload", response_model=ScanResponse)
async def upload_scan(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Upload a brain scan (DICOM or NIfTI) for processing
    """
    try:
        logger.info(f"Received upload request for file: {file.filename}")
        logger.info(f"File content type: {file.content_type}")
        logger.info(f"File size: {file.size if hasattr(file, 'size') else 'unknown'} bytes")

        # Validate file type
        if not file.filename.lower().endswith((
            '.jpg', '.jpeg', '.png', '.dcm', '.nii', '.nii.gz')):
            logger.error(f"Invalid file type: {file.filename}")
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only .jpg, .jpeg, .png, .dcm, .nii, .nii.gz files are supported."
            )
        
        logger.info("File type validation passed")
        
        # Save file
        try:
            file_path = await save_upload_file(file)
            logger.info(f"File saved successfully at: {file_path}")
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
        
        # Start processing in background
        if background_tasks:
            logger.info("Adding background processing task")
            background_tasks.add_task(process_scan, file_path)
            logger.info("Background task added successfully")
        
        # Generate a unique ID for the scan
        scan_id = os.urandom(8).hex()
        
        response = ScanResponse(
            message="File uploaded successfully",
            file_path=file_path,
            status="processing",
            file_name=file.filename,
            file_size=file.size if hasattr(file, 'size') else None,
            file_type=file.content_type,
            id=scan_id,
            created_at=datetime.now()
        )
        
        logger.info(f"Upload successful. Response: {response}")
        return response

    except HTTPException as he:
        logger.error(f"HTTP Exception during upload: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error during upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/process/{scan_id}", response_model=ProcessingStatus)
async def get_processing_status(scan_id: str):
    """
    Get the processing status of a scan
    """
    try:
        logger.info(f"Checking processing status for scan_id: {scan_id}")
        status = await get_scan_results(scan_id)
        logger.info(f"Processing status: {status}")
        return status
    except Exception as e:
        logger.error(f"Error getting processing status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results/{scan_id}")
async def get_results(scan_id: str):
    """
    Get the analysis results for a processed scan
    """
    try:
        logger.info(f"Fetching results for scan_id: {scan_id}")
        results = await get_scan_results(scan_id)
        if not results:
            logger.warning(f"No results found for scan_id: {scan_id}")
            raise HTTPException(status_code=404, detail="Results not found")
        logger.info(f"Results retrieved successfully: {results}")
        return results
    except Exception as e:
        logger.error(f"Error getting results: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/{scan_id}")
async def get_model(scan_id: str):
    """
    Get the 3D model data for visualization
    """
    try:
        logger.info(f"Fetching 3D model for scan_id: {scan_id}")
        model_data = await get_scan_results(scan_id, include_model=True)
        if not model_data:
            logger.warning(f"No model found for scan_id: {scan_id}")
            raise HTTPException(status_code=404, detail="Model not found")
        logger.info(f"Model data retrieved successfully: {model_data}")
        return model_data
    except Exception as e:
        logger.error(f"Error getting model data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
