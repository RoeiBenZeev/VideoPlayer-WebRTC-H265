from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
from aiortc.contrib.media import MediaPlayer
import json
import uuid

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# VIDEO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
VIDEO_URL = "https://firebasestorage.googleapis.com/v0/b/flutter-videos-9c1b7.firebasestorage.app/o/video_h265.mp4?alt=media&token=ee7ef047-a520-4f94-95e8-cd47f30793f4"

# Global dictionary to store RTCPeerConnection instances
peer_connections = {}

class VideoStreamTrackFromURL(VideoStreamTrack):
    def __init__(self, url: str):
        super().__init__()
        self.url = url
        self.player = MediaPlayer(url)

    async def recv(self):
        frame = await self.player.video.recv()
        return frame

@app.post("/offer")
async def offer():
    pc = RTCPeerConnection()
    pc_id = str(uuid.uuid4())
    peer_connections[pc_id] = pc

    video_track = VideoStreamTrackFromURL(VIDEO_URL)
    pc.addTrack(video_track)

    @pc.on("icecandidate")
    async def on_icecandidate(candidate):
        await websocket.send(json.dumps({"candidate": candidate}))

    offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    return {
        "sdp": pc.localDescription.sdp,
        "type": pc.localDescription.type,
        "pc_id": pc_id
    }

@app.post("/answer")
async def answer(sdp: dict):
    pc_id = sdp["pc_id"]
    pc = peer_connections.get(pc_id)
    if not pc:
        return "RTCPeerConnection not found", 404

    await pc.setRemoteDescription(RTCSessionDescription(sdp["sdp"], sdp["type"]))
    return "OK"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)