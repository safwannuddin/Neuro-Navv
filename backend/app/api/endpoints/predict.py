from fastapi import APIRouter, UploadFile, File, HTTPException
from ...utils.grad_cam import create_gradcam
from ...models.model import load_model
import numpy as np
from PIL import Image
import io
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Load model and create GradCAM instance
try:
    model = load_model()
    gradcam = create_gradcam(model)
    logger.info("Model and GradCAM instance loaded successfully")
except Exception as e:
    logger.error(f"Error initializing model or GradCAM: {str(e)}")
    logger.error(traceback.format_exc())
    raise

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing file: {file.filename}")
        
        # Read and preprocess image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        logger.info(f"Image loaded: size={image.size}, mode={image.mode}")
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
            logger.info("Image converted to RGB")
            
        # Resize to model input size
        image = image.resize((224, 224))  # Adjust size based on your model
        logger.info("Image resized to 224x224")
        
        # Convert to numpy array and preprocess
        img_array = np.array(image)
        logger.info(f"Image converted to numpy array: shape={img_array.shape}, dtype={img_array.dtype}")
        
        # Store original image for heatmap
        original_img = img_array.copy()
        
        # Preprocess for model
        img_array = img_array.astype('float32') / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        logger.info(f"Image preprocessed: shape={img_array.shape}, dtype={img_array.dtype}")
        
        # Get prediction
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class])
        logger.info(f"Prediction made: class={predicted_class}, confidence={confidence}")
        
        # Map numeric class to string
        class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']
        predicted_class_name = class_names[predicted_class]
        logger.info(f"Predicted class name: {predicted_class_name}")
        
        # Prepare response
        response = {
            "predicted_class": predicted_class_name,
            "confidence": confidence,
            "all_probabilities": {
                class_names[i]: float(pred) for i, pred in enumerate(prediction[0])
            }
        }
        
        # Generate GradCAM heatmap only if not "notumor"
        if predicted_class_name == "notumor":
            logger.info("No tumor detected, skipping heatmap generation")
            response["message"] = "No suspicious regions detected."
            response["heatmap"] = None
        else:
            try:
                logger.info("Starting GradCAM heatmap generation")
                # Use original image for heatmap
                heatmap_url = gradcam.generate_heatmap_image(original_img, predicted_class)
                logger.info("Heatmap generated successfully")
                response["heatmap_url"] = heatmap_url
            except Exception as e:
                logger.error(f"Error generating heatmap: {str(e)}")
                logger.error(traceback.format_exc())
        
        logger.info("Response prepared")
        return response
        
    except Exception as e:
        logger.error(f"Error in prediction endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))