# Import necessary modules
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
from aiortc.contrib.media import MediaPlayer
from fastapi import FastAPI

app = FastAPI()

# Peer connection storage
pcs = set()

VIDEO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"

# Function to create a media player from a URL
def create_media_player(url):
    return MediaPlayer(url)

# A custom Video Stream Track that wraps the MediaPlayer
class VideoStream(VideoStreamTrack):
    def __init__(self, player):
        super().__init__()
        self.player = player

    async def recv(self):
        frame = await self.player.video.recv()
        return frame

# New class to handle WebRTC streaming
class WebRTCStreamer:
    def __init__(self):
        self.pc = RTCPeerConnection()
        pcs.add(self.pc)

    async def handle_offer(self, sdp: dict):
        # Parse the incoming SDP offer
        offer = RTCSessionDescription(sdp["sdp"], sdp["type"])
        print("1")
        # Use a URL to create a media player
        video_url = sdp.get("video_url", VIDEO_URL)
        player = create_media_player(video_url)

        # Add tracks from the media player
        if player.video:
            self.pc.addTrack(VideoStream(player))

        # Set the remote description and create an answer
        await self.pc.setRemoteDescription(offer)
        answer = await self.pc.createAnswer()
        await self.pc.setLocalDescription(answer)

        # Return the SDP answer
        return {"sdp": self.pc.localDescription.sdp, "type": self.pc.localDescription.type}

# Endpoint to handle the offer
@app.post("/offer")
async def offer(sdp: dict):
    streamer = WebRTCStreamer()
    return await streamer.handle_offer(sdp)