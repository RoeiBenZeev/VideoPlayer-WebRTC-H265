import gi
gi.require_version('Gst', '1.0')
gi.require_version('GstRtspServer', '1.0')

from gi.repository import Gst, GstRtspServer, GLib
import subprocess

class WebcamRTSPServer:
    def __init__(self):
        self.rtsp_url = "rtsp://127.0.0.1:8558/webcam"
        self.ffmpeg_command = [
            "ffmpeg",
            "-f", "v4l2",                # Input format
            "-i", "/dev/video0",         # Input device
            "-c:v", "libx265",           # Video codec
            "-preset", "superfast",      # Encoding speed
            "-tune", "zerolatency",      # Tune for low latency
            "-b:v", "512k",              # Bitrate
            "-f", "rtsp",                # Output format
            self.rtsp_url                # Output URL
        ]

    def start(self):
        print(f"RTSP server is running at {self.rtsp_url}")
        subprocess.run(self.ffmpeg_command)

if __name__ == "__main__":
    server = WebcamRTSPServer()
    server.start()
