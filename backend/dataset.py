import os
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

class AlzheimerDataset(Dataset):
    def __init__(self, root_dir):
        self.images = []
        self.labels = []

        self.classes = [
            "Non_Demented",
            "Very_Mild_Demented",
            "Mild_Demented",
            "Moderate_Demented"
        ]

        for label, cls in enumerate(self.classes):
            folder = os.path.join(root_dir, cls)
            for img in os.listdir(folder):
                self.images.append(os.path.join(folder, img))
                self.labels.append(label)

        self.transform = transforms.Compose([
            transforms.Grayscale(),
            transforms.Resize((128, 128)),
            transforms.ToTensor()
        ])

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        image = Image.open(self.images[idx])
        image = self.transform(image)
        label = self.labels[idx]
        return image, label
