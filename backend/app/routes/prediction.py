from fastapi import APIRouter, UploadFile, File, HTTPException
from ..ml_model.model_handler import ModelHandler
import os
from typing import Dict, Any

router = APIRouter()
model_handler = None

def init_model():
    global model_handler
    model_path = os.path.join(os.path.dirname(__file__), "../ml_model/best_model.keras")
    if not os.path.exists(model_path):
        raise Exception("Model file not found")
    model_handler = ModelHandler(model_path)

@router.post("/predict")
async def predict_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Endpoint to predict brain tumor type from uploaded MRI image
    """
    try:
        if not model_handler:
            init_model()

        # File type check
        if not file.filename.lower().endswith((
            '.jpg', '.jpeg', '.png', '.dcm', '.nii', '.nii.gz')):
            raise HTTPException(status_code=400, detail="Invalid file type. Only .jpg, .jpeg, .png, .dcm, .nii, .nii.gz files are supported.")

        # Save uploaded file temporarily
        temp_path = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)
        
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Get prediction
        result = model_handler.predict(temp_path)
        
        # Clean up temporary file
        os.remove(temp_path)
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 