from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from inference import predict_image

app = FastAPI(title="Alzheimer MRI Image Prediction API")

# ✅ CORS CONFIG (THIS FIXES YOUR ERROR)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "API running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await predict_image(file)
