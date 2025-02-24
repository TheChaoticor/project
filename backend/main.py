import cv2
import numpy as np
import tempfile
import asyncio
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SIGHTENGINE_API_USER = os.getenv("SIGHTENGINE_API_USER")
SIGHTENGINE_API_SECRET = os.getenv("SIGHTENGINE_API_SECRET")
SIGHTENGINE_API_ENDPOINT = "https://api.sightengine.com/1.0/check.json"

if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
    raise ValueError("🚨 Sightengine API keys are not set! Check your .env file.")

def extract_frames_from_video(file_bytes: bytes, num_frames: int = 15) -> list:
    """Extract `num_frames` evenly spaced frames from a video."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    cap = cv2.VideoCapture(tmp_path)
    if not cap.isOpened():
        os.remove(tmp_path)
        raise ValueError("Could not open video file.")

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    num_frames = min(num_frames, frame_count)
    indices = np.linspace(0, frame_count - 1, num_frames, dtype=int)
    frames = []

    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            continue
        ret, jpeg = cv2.imencode(".jpg", frame)
        if ret:
            frames.append(jpeg.tobytes())
    
    cap.release()
    os.remove(tmp_path)
    return frames

def transform_sightengine_result(result: dict) -> dict:
    deepfake_score = result.get("type", {}).get("deepfake", 0) * 100
    is_deepfake = deepfake_score > 50
    return {"isDeepfake": is_deepfake, "confidence": deepfake_score}

async def analyze_image_with_sightengine(image_bytes: bytes) -> dict:
    files = {"media": ("media", image_bytes, "image/jpeg")}
    data = {"models": "deepfake", "api_user": SIGHTENGINE_API_USER, "api_secret": SIGHTENGINE_API_SECRET}
    headers = {"accept": "application/json"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(SIGHTENGINE_API_ENDPOINT, headers=headers, files=files, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return transform_sightengine_result(response.json())

async def analyze_video(file_content: bytes) -> dict:
    try:
        frames = extract_frames_from_video(file_content, num_frames=15)
        if not frames:
            raise HTTPException(status_code=400, detail="Failed to extract frames from video.")
        
        tasks = [analyze_image_with_sightengine(frame) for frame in frames]
        results = await asyncio.gather(*tasks)
        
        avg_confidence = sum(r["confidence"] for r in results) / len(results)
        is_deepfake = sum(1 for r in results if r["isDeepfake"]) > len(results) / 2
        
        return {"isDeepfake": is_deepfake, "confidence": avg_confidence,
                "message": f"Deepfake confidence: {avg_confidence:.2f}% over {len(results)} frames."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing video: {str(e)}")

@app.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):
    if not file.content_type.startswith(("image/", "video/")):
        raise HTTPException(status_code=400, detail="Only image and video files are supported")
    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 20MB")
    if "video" in file.content_type:
        return await analyze_video(content)
    return await analyze_image_with_sightengine(content)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

print("✅ Deepfake video analysis service ready!")
