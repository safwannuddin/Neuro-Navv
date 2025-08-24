import torch
import numpy as np
from app.core.config import settings
from app.utils.file_utils import load_medical_image, validate_medical_image
from ..ml_model.model_handler import ModelHandler  # Import ModelHandler
import logging
from typing import Dict, Any, Optional
import time
from datetime import datetime
import os
from app.utils.grad_cam import create_gradcam
import tensorflow as tf
from PIL import Image
import io

logger = logging.getLogger(__name__)

# Initialize model (placeholder for now)
model = None
model_handler = None # Add this to store ModelHandler instance
gradcam = None

def load_model():
    """
    Load the 3D U-Net model and the ML image model
    """
    global model, model_handler, gradcam
    if model is None:
        try:
            # TODO: Implement actual medical model loading
            logger.info("Loading 3D U-Net model...")
            # model = torch.load(settings.MODEL_PATH, map_location=settings.DEVICE)
            logger.info("Medical model loaded successfully (placeholder)")
        except Exception as e:
            logger.error(f"Error loading medical model: {str(e)}")
            # Decide if this error should stop startup or just log

    if model_handler is None:
        try:
            model_path = os.path.join(os.path.dirname(__file__), "../ml_model/best_model.keras")
            if not os.path.exists(model_path):
                 logger.warning(f"ML model file not found at {model_path}. Image prediction will not be available.")
                 # Don't raise exception here, just log warning if ML model is optional
            else:
                 model_handler = ModelHandler(model_path)
                 logger.info("ML image model loaded successfully")
                 gradcam = create_gradcam(model_handler.model)
                 logger.info("GradCAM instance created successfully")
        except Exception as e:
             logger.error(f"Error loading ML image model: {str(e)}")
             # Decide if this error should stop startup or just log

async def process_scan(file_path: str) -> Dict[str, Any]:
    """
    Process a brain scan using the appropriate AI model based on file type
    """
    try:
        start_time = time.time()

        file_extension = os.path.splitext(file_path)[1].lower()

        if file_extension in ('.dcm', '.nii', '.nii.gz'):
            # Existing logic for medical images
            logger.info(f"Processing medical image: {file_path}")
            if not validate_medical_image(file_path):
                raise ValueError("Invalid medical image file")

            # Load medical image
            image = load_medical_image(file_path)

            # TODO: Implement actual medical image processing (3D U-Net etc.)
            # For now, return mock results for medical images
            results = {
                "anomalies": [
                    {
                        "type": "tumor",
                        "location": [100, 150, 200],
                        "size": 25.5,
                        "confidence": 0.95
                    }
                ],
                "metrics": {
                    "volume": 1500.0,
                    "density": 1.2
                },
                "confidence_score": 0.95,
                "processing_time": time.time() - start_time,
                "file_type_processed": "medical"
            }

        elif file_extension in ('.jpg', '.jpeg', '.png'):
            # Logic for standard image files using ML model
            logger.info(f"Processing standard image: {file_path}")
            if model_handler is None:
                 raise Exception("ML image model not loaded.")

            # Use the ML model handler to predict
            prediction_results = model_handler.predict(file_path)

            # Get filename from file_path for logging
            file_name = os.path.basename(file_path) # Get just the filename

            # Log the prediction results
            logger.info(f"Prediction results for {file_name}: {prediction_results}")

            # Format results for standard images
            results = {
                "prediction": prediction_results, # Contains predicted_class, confidence, all_probabilities
                "processing_time": time.time() - start_time,
                "file_type_processed": "standard_image"
            }

        else:
            raise ValueError(f"Unsupported file type for processing: {file_extension}")

        logger.info(f"Scan processed successfully: {file_path}")
        return results

    except Exception as e:
        logger.error(f"Error processing scan: {str(e)}")
        raise

async def get_scan_results(scan_id: str, include_model: bool = False) -> Dict[str, Any]:
    """
    Get the results of a processed scan
    """
    try:
        if model_handler is None or gradcam is None:
            raise Exception("ML model or GradCAM not loaded")
        uploads_dir = os.path.join(os.path.dirname(__file__), "../../uploads")
        files = [f for f in os.listdir(uploads_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        if not files:
            raise Exception("No processed files found")
        latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(uploads_dir, x)))
        file_path = os.path.join(uploads_dir, latest_file)
        prediction_results = model_handler.predict(file_path)
        
        # Check if prediction is "notumor"
        if prediction_results["predicted_class"] == "notumor":
            logger.info("No tumor detected, skipping heatmap generation")
            # Add a special message for notumor cases
            prediction_results["message"] = "No suspicious regions detected."
            heatmap_url = None
        else:
            # Generate heatmap only for tumor cases
            try:
                logger.info("Generating GradCAM heatmap for results endpoint")
                image = Image.open(file_path).convert('RGB').resize((224, 224))
                img_array = np.array(image)
                predicted_class = np.argmax(list(prediction_results['all_probabilities'].values()))
                heatmap_url = gradcam.generate_heatmap_image(img_array, predicted_class)
                logger.info("Heatmap generated successfully for results endpoint")
            except Exception as e:
                logger.error(f"Error generating heatmap in results endpoint: {str(e)}")
                heatmap_url = None
        
        results = {
            "scan_id": scan_id,
            "status": "completed",
            "progress": 1.0,
            "results": {
                "prediction": prediction_results,
                "processing_time": 5.0,
                "file_type_processed": "standard_image"
            },
            "created_at": datetime.now().isoformat()
        }
        
        if heatmap_url:
            results["results"]["prediction"]["heatmap_url"] = heatmap_url
        
        if include_model:
            results["model"] = {
                "url": f"https://storage.example.com/models/{scan_id}.gltf",
                "format": "gltf",
                "size": 1024000
            }
        return results
    except Exception as e:
        logger.error(f"Error getting scan results: {str(e)}")
        raise

def generate_report(results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a natural language report from the analysis results
    """
    try:
        # TODO: Implement actual report generation
        # For now, return mock report
        return {
            "summary": "Brain scan analysis completed successfully",
            "findings": [
                {
                    "type": "tumor",
                    "description": "Small mass detected in the right frontal lobe",
                    "severity": "moderate"
                }
            ],
            "recommendations": [
                "Follow-up scan recommended in 3 months",
                "Consult with neurologist for detailed analysis"
            ]
        }
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        raise
