from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import requests

app = FastAPI()

VIDEO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"

def stream_video(url: str):
    response = requests.get(url, stream=True)
    for chunk in response.iter_content(chunk_size=1024):
        yield chunk

@app.get("/video")
async def get_video():
    return StreamingResponse(stream_video(VIDEO_URL), media_type="video/mp4")
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
