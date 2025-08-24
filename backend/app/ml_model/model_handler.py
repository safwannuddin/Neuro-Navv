import tensorflow as tf
import numpy as np
from PIL import Image
import os

class ModelHandler:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
        self.class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']
        self.img_size = (224, 224)  # Adjust based on your model's input size

    def preprocess_image(self, image_path):
        """Preprocess the image for model prediction"""
        try:
            img = Image.open(image_path)
            img = img.resize(self.img_size)
            img = img.convert('RGB')
            img_array = np.array(img)
            img_array = img_array / 255.0  # Normalize
            img_array = np.expand_dims(img_array, axis=0)
            return img_array
        except Exception as e:
            raise Exception(f"Error preprocessing image: {str(e)}")

    def predict(self, image_path):
        """Make prediction on the input image"""
        try:
            # Preprocess the image
            processed_img = self.preprocess_image(image_path)
            
            # Make prediction
            predictions = self.model.predict(processed_img)
            predicted_class = self.class_names[np.argmax(predictions[0])]
            confidence = float(np.max(predictions[0]))
            
            return {
                "predicted_class": predicted_class,
                "confidence": confidence,
                "all_probabilities": {
                    class_name: float(prob) 
                    for class_name, prob in zip(self.class_names, predictions[0])
                }
            }
        except Exception as e:
            raise Exception(f"Error making prediction: {str(e)}") 