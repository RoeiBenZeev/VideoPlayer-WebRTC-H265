import sys, getopt;
import gi
gi.require_version('Gst', '1.0')
gi.require_version('GstRtspServer', '1.0')

from gi.repository import Gst, GstRtspServer, GLib
import subprocess

options = "hc:d:"
long_options= ["codec", "device"]

class WebcamFFmpegStreamCommand:
    def __init__(self):
        self.codec =  "libx265"
        self.device =  "/dev/video0"
        # Parsing argument
        arguments, values = getopt.getopt(sys.argv[1:], options, long_options)

        print(arguments)
    
        # checking each argument
        for currentArgument, currentValue in arguments:
            if currentArgument in ("-c", "--codec"):
                print(f"Setting codec {currentValue}")
                self.codec =  currentValue if currentValue else self.codec
                
            elif currentArgument in ("-d", "--device"):
                print(f"Setting input device {currentValue}")
                self.device =  currentValue if currentValue else self.device

        
        self.rtsp_url = "rtsp://127.0.0.1:8558/yese"

        self.ffmpeg_command = [
            "ffmpeg",
            "-f", "v4l2",                # Input format
            "-i", self.device ,         # Input device
            "-c:v", self.codec ,           # Video codec
            "-preset", "superfast",      # Encoding speed
            "-tune", "zerolatency",      # Tune for low latency
            "-b:v", "512k",              # Bitrate
            "-f", "rtsp",                # Output format
            self.rtsp_url                # Output URL
        ]

    def start(self):
        print(f"RTSP server is running at {self.rtsp_url}")
        print(f"Codec: {self.codec}")
        print(f"Input Device: {self.device}")
        subprocess.run(self.ffmpeg_command)

if __name__ == "__main__":
    server = WebcamFFmpegStreamCommand()
    server.start()
