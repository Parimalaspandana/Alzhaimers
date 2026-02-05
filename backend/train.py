import torch
from torch.utils.data import DataLoader
from torch import nn, optim
from dataset import AlzheimerDataset
from model import AlzheimerCNN

# Load dataset
dataset = AlzheimerDataset("../Dataset")
loader = DataLoader(dataset, batch_size=32, shuffle=True)

# Model, loss, optimizer
model = AlzheimerCNN()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

epochs = 10

for epoch in range(epochs):
    total_loss = 0.0
    correct = 0
    total = 0

    for images, labels in loader:
        optimizer.zero_grad()

        outputs = model(images)
        loss = criterion(outputs, labels)

        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        # ✅ Accuracy calculation
        _, predicted = torch.max(outputs, 1)
        correct += (predicted == labels).sum().item()
        total += labels.size(0)

    avg_loss = total_loss / len(loader)
    accuracy = 100 * correct / total

    print(f"Epoch [{epoch+1}/{epochs}] | Loss: {avg_loss:.4f} | Accuracy: {accuracy:.2f}%")

# Save model
torch.save(model.state_dict(), "model.pt")
print("✅ Model trained and saved as model.pt")
