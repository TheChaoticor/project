import cv2
import numpy as np
import tempfile
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv
import json

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

SIGHTENGINE_API_USER = os.getenv("SIGHTENGINE_API_USER", "583928004")
SIGHTENGINE_API_SECRET = os.getenv("SIGHTENGINE_API_SECRET", "cARfHGMhodD2obAqBwLQRwJMmBFVxW9J")
if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
    raise ValueError("🚨 Sightengine API keys are not set! Check your .env file.")

SIGHTENGINE_API_ENDPOINT = "https://api.sightengine.com/1.0/check.json"

def extract_frames_from_video(file_bytes: bytes, num_frames: int = 5) -> list:
    """Extract `num_frames` evenly spaced frames from a video."""
    # Write video to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    cap = cv2.VideoCapture(tmp_path)
    if not cap.isOpened():
        os.remove(tmp_path)
        raise ValueError("Could not open video file.")

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count < num_frames:
        num_frames = frame_count

    # Calculate indices for evenly spaced frames
    indices = np.linspace(0, frame_count - 1, num_frames, dtype=int)
    frames = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            continue
        # Encode frame as JPEG
        ret, jpeg = cv2.imencode(".jpg", frame)
        if ret:
            frames.append(jpeg.tobytes())
    cap.release()
    os.remove(tmp_path)
    return frames

def transform_sightengine_result(result: dict) -> dict:
    deepfake_score = result.get("type", {}).get("deepfake", 0)
    confidence = deepfake_score * 100
    # Use a threshold (e.g., 50%) to determine deepfake suspicion
    is_deepfake = confidence > 50
    return {
        "isDeepfake": is_deepfake,
        "confidence": confidence,
        "message": f"Deepfake confidence is {confidence:.2f}%"
    }

async def analyze_image_with_sightengine(image_bytes: bytes, content_type: str = "image/jpeg") -> dict:
    files = {"media": ("media", image_bytes, content_type)}
    data = {
        "models": "deepfake",
        "api_user": SIGHTENGINE_API_USER,
        "api_secret": SIGHTENGINE_API_SECRET
    }
    headers = {"accept": "application/json"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            SIGHTENGINE_API_ENDPOINT,
            headers=headers,
            files=files,
            data=data,
            follow_redirects=True
        )
    if response.status_code != 200:
        try:
            error_data = response.json()
            error_message = error_data.get("error", "Unknown error from Sightengine API")
        except Exception:
            error_message = response.text
        raise HTTPException(status_code=response.status_code, detail=error_message)
    result = response.json()
    return transform_sightengine_result(result)

async def analyze_video(file_content: bytes, content_type: str) -> dict:
    try:
        frames = extract_frames_from_video(file_content, num_frames=10)
        if not frames:
            raise HTTPException(status_code=400, detail="Failed to extract frames from video.")
        
        results = []
        # Analyze each extracted frame
        for frame in frames:
            result = await analyze_image_with_sightengine(frame, "image/jpeg")
            results.append(result)
        
        # Aggregate results, e.g., by taking the average confidence and majority vote on deepfake classification
        avg_confidence = sum(r["confidence"] for r in results) / len(results)
        is_deepfake = sum(1 for r in results if r["isDeepfake"]) > (len(results) / 2)
        return {
            "isDeepfake": is_deepfake,
            "confidence": avg_confidence,
            "message": f"Average deepfake confidence is {avg_confidence:.2f}% based on {len(results)} frames."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing video: {str(e)}")

async def analyze_with_sightengine(file_content: bytes, content_type: str) -> dict:
    # If file is a video, handle separately
    if file_content and "video" in content_type:
        return await analyze_video(file_content, content_type)
    else:
        return await analyze_image_with_sightengine(file_content, content_type)

@app.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):
    if not file.content_type.startswith(("image/", "video/")):
        raise HTTPException(status_code=400, detail="Only image and video files are supported")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 10MB")
    result = await analyze_with_sightengine(content, file.content_type)
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

print(f"✅ Loaded Sightengine API keys: {'Set' if SIGHTENGINE_API_USER and SIGHTENGINE_API_SECRET else 'Not Set'}")
