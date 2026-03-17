from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

model_name = "google/vit-base-patch16-224"

processor = AutoImageProcessor.from_pretrained(model_name)
model = AutoModelForImageClassification.from_pretrained(model_name)

image = Image.open("test_leaf.jpg").convert("RGB")

inputs = processor(images=image, return_tensors="pt")

with torch.no_grad():
    outputs = model(**inputs)

logits = outputs.logits
predicted_class_id = logits.argmax(-1).item()

label = model.config.id2label[predicted_class_id]

print("Predicted Class:", label)

