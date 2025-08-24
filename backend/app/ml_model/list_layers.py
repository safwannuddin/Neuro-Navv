# list_layers.py

from tensorflow.keras.models import load_model

# Load your trained model (.keras file)
model = load_model("best_model.keras")

# List all layers with their names and types
for layer in model.layers:
    print(layer.name, layer.__class__.__name__)
