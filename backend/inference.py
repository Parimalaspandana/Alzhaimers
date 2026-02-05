import torch
from PIL import Image
from torchvision import transforms
from model import AlzheimerCNN

classes = [
    "Non_Demented",
    "Very_Mild_Demented",
    "Mild_Demented",
    "Moderate_Demented"
]

model = AlzheimerCNN()
model.load_state_dict(torch.load("model.pt", map_location="cpu"))
model.eval()

transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.Resize((128, 128)),
    transforms.ToTensor()
])

async def predict_image(file):
    image = Image.open(file.file)
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        probs = torch.softmax(output, dim=1)[0]

    idx = torch.argmax(probs).item()

    return {
        "prediction": classes[idx],
        "confidence": float(probs[idx]),
        "probabilities": {
            classes[i]: float(probs[i]) for i in range(4)
        }
    }
