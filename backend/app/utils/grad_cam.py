import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
import cv2
from PIL import Image
import io
import base64
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GradCAM:
    def __init__(self, model, layer_name=None):
        """
        Initialize GradCAM with a trained model.
        
        Args:
            model: Trained Keras model
            layer_name: Name of the layer to use for GradCAM. If None, uses the last conv layer.
        """
        self.model = model
        
        # If no layer specified, use the last conv layer
        if layer_name is None:
            for layer in reversed(model.layers):
                if isinstance(layer, tf.keras.layers.Conv2D):
                    layer_name = layer.name
                    break
        
        if layer_name is None:
            raise ValueError("No convolutional layer found in the model")
            
        logger.info(f"Using layer {layer_name} for GradCAM")
        self.layer_name = layer_name
        
        try:
            self.grad_model = Model(
                inputs=[model.inputs],
                outputs=[model.get_layer(layer_name).output, model.output]
            )
            logger.info("GradCAM model created successfully")
        except Exception as e:
            logger.error(f"Error creating GradCAM model: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def compute_heatmap(self, img_array, pred_index=None):
        """
        Compute GradCAM heatmap for an image.
        
        Args:
            img_array: Preprocessed image array
            pred_index: Index of the predicted class. If None, uses the predicted class.
            
        Returns:
            Heatmap as a numpy array
        """
        try:
            logger.info(f"Computing heatmap for image shape: {img_array.shape}")
            
            # Ensure input is in the correct format
            if len(img_array.shape) != 3:
                raise ValueError(f"Expected 3D input array, got shape {img_array.shape}")
            
            # Normalize image for model input
            img_for_model = img_array.astype('float32') / 255.0
            img_for_model = np.expand_dims(img_for_model, axis=0)
            logger.info(f"Prepared image for model: shape={img_for_model.shape}, dtype={img_for_model.dtype}")
            
            with tf.GradientTape() as tape:
                logger.info("Running forward pass")
                conv_outputs, predictions = self.grad_model(img_for_model)
                logger.info(f"Conv outputs shape: {conv_outputs.shape}, Predictions shape: {predictions.shape}")
                
                if pred_index is None:
                    pred_index = tf.argmax(predictions[0])
                loss = predictions[:, pred_index]
                logger.info(f"Using prediction index: {pred_index}")

            # Compute gradients
            logger.info("Computing gradients")
            grads = tape.gradient(loss, conv_outputs)
            logger.info(f"Gradients shape: {grads.shape}")
            
            # Global average pooling of gradients
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
            logger.info(f"Pooled gradients shape: {pooled_grads.shape}")
            
            # Weight the channels by their gradients
            conv_outputs = conv_outputs.numpy()[0]
            pooled_grads = pooled_grads.numpy()
            
            for i in range(pooled_grads.shape[-1]):
                conv_outputs[:, :, i] *= pooled_grads[i]
                
            # Generate heatmap
            heatmap = np.mean(conv_outputs, axis=-1)
            heatmap = np.maximum(heatmap, 0)  # ReLU
            
            # Normalize heatmap
            if np.max(heatmap) > 0:
                heatmap /= np.max(heatmap)
            else:
                logger.warning("Heatmap is all zeros")
            
            logger.info(f"Generated heatmap shape: {heatmap.shape}, min: {np.min(heatmap)}, max: {np.max(heatmap)}")
            return heatmap
            
        except Exception as e:
            logger.error(f"Error computing heatmap: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def overlay_heatmap(self, img_array, heatmap, alpha=0.4):
        """
        Overlay heatmap on the original image.
        
        Args:
            img_array: Original image array
            heatmap: Computed heatmap
            alpha: Transparency of the heatmap
            
        Returns:
            Image with heatmap overlay
        """
        try:
            logger.info(f"Overlaying heatmap on image shape: {img_array.shape}")
            
            # Ensure image is in correct format
            if img_array.dtype != np.uint8:
                img_array = (img_array * 255).astype(np.uint8)
            
            # Resize heatmap to match image size
            heatmap = cv2.resize(heatmap, (img_array.shape[1], img_array.shape[0]))
            logger.info(f"Resized heatmap shape: {heatmap.shape}")
            
            # Convert heatmap to RGB
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            logger.info(f"Colored heatmap shape: {heatmap.shape}")
            
            # Convert to RGB (from BGR)
            heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
            
            # Superimpose heatmap on original image
            output = cv2.addWeighted(img_array, 1-alpha, heatmap, alpha, 0)
            logger.info(f"Final output shape: {output.shape}")
            
            return output
            
        except Exception as e:
            logger.error(f"Error overlaying heatmap: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def generate_heatmap_image(self, img_array, pred_index=None):
        """
        Generate a complete heatmap visualization.
        
        Args:
            img_array: Original image array
            pred_index: Index of the predicted class
            
        Returns:
            Base64 encoded image with heatmap overlay
        """
        try:
            logger.info("Starting heatmap image generation")
            
            # Compute heatmap
            heatmap = self.compute_heatmap(img_array, pred_index)
            
            # Overlay heatmap on original image
            output = self.overlay_heatmap(img_array, heatmap)
            
            # Convert to PIL Image
            output_img = Image.fromarray(output)
            logger.info(f"Created PIL Image: size={output_img.size}, mode={output_img.mode}")
            
            # Convert to base64
            buffered = io.BytesIO()
            output_img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            logger.info("Successfully encoded image to base64")
            
            return f"data:image/png;base64,{img_str}"
            
        except Exception as e:
            logger.error(f"Error generating heatmap image: {str(e)}")
            logger.error(traceback.format_exc())
            raise

def create_gradcam(model, layer_name=None):
    """
    Factory function to create a GradCAM instance.
    
    Args:
        model: Trained Keras model
        layer_name: Optional layer name for GradCAM
        
    Returns:
        GradCAM instance
    """
    return GradCAM(model, layer_name) 