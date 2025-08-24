import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import cv2
import sys
import os

def get_img_array(img_path, size=(224, 224)):
    img = tf.keras.preprocessing.image.load_img(img_path, target_size=size)
    array = tf.keras.preprocessing.image.img_to_array(img)
    array = np.expand_dims(array, axis=0)
    array = array / 255.0
    return array

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(predictions[0])
        class_channel = predictions[:, pred_index]

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def save_and_display_gradcam(img_path, heatmap, layer_name, alpha=0.4):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_PLASMA)
    superimposed_img = cv2.addWeighted(heatmap_color, alpha, img, 1 - alpha, 0)

    heatmap_path = f"gradcam_heatmap_{layer_name}.png"
    overlay_path = f"gradcam_overlay_{layer_name}.png"

    cv2.imwrite(heatmap_path, heatmap_color)
    cv2.imwrite(overlay_path, superimposed_img)
    print(f"✅ Saved Grad-CAM for layer '{layer_name}': {overlay_path}, {heatmap_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python grad_cam.py <model_path> <image_path>")
        sys.exit(1)

    model_path = sys.argv[1]
    image_path = sys.argv[2]

    model = tf.keras.models.load_model(model_path)
    img_array = get_img_array(image_path)

    # 🔥 Experiment with these layers (MobileNetV2 recommended layers)
    candidate_layers = [
        "block_16_project",  # most recommended
        "block_15_project",
        "block_14_project",
        "Conv_1"  # fallback
    ]

    for layer_name in candidate_layers:
        try:
            heatmap = make_gradcam_heatmap(img_array, model, layer_name)
            save_and_display_gradcam(image_path, heatmap, layer_name)
        except Exception as e:
            print(f"❌ Failed for layer '{layer_name}': {e}")
