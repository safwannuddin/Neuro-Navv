import os
import shutil
from fastapi import UploadFile
from app.core.config import settings
import nibabel as nib
import pydicom
from typing import Union
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

async def save_upload_file(file: UploadFile) -> str:
    """
    Save an uploaded file to the uploads directory
    """
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = Path(settings.UPLOAD_DIR)
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        file_ext = Path(file.filename).suffix
        unique_filename = f"{os.urandom(8).hex()}{file_ext}"
        file_path = str(upload_dir / unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File saved successfully: {file_path}")
        return file_path
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise

def load_medical_image(file_path: str) -> Union[nib.Nifti1Image, pydicom.FileDataset]:
    """
    Load a medical image file (DICOM or NIfTI)
    """
    try:
        file_path = str(Path(file_path))
        if file_path.lower().endswith('.dcm'):
            return pydicom.dcmread(file_path)
        elif file_path.lower().endswith(('.nii', '.nii.gz')):
            return nib.load(file_path)
        else:
            raise ValueError("Unsupported file format")
    except Exception as e:
        logger.error(f"Error loading medical image: {str(e)}")
        raise

def validate_medical_image(file_path: str) -> bool:
    """
    Validate that the file is a valid medical image
    """
    try:
        load_medical_image(file_path)
        return True
    except Exception as e:
        logger.error(f"Invalid medical image: {str(e)}")
        return False

def cleanup_file(file_path: str) -> None:
    """
    Remove a file from the filesystem
    """
    try:
        file_path = Path(file_path)
        if file_path.exists():
            file_path.unlink()
            logger.info(f"File cleaned up: {file_path}")
    except Exception as e:
        logger.error(f"Error cleaning up file: {str(e)}")
        raise
