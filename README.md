# Video H265 P.O.C 

This repository should implement a simple proof of concept of streaming a rtsp stream in h265 codec and
transcode/manipulate it so a chrome client could play it.
Should also be able to 

## Benchmarking

There should be multiple methods to achieve the P.O.C, for example:

   - WebRTC: transcode h265 to 264 with/without hardware acceleration
   - Raw Data: Instead of transcoding to h264, the video server could send raw data
   - RTMP: Real-Time Messaging Protocol (needs further investigating)

### Building Blocks and Startup

#### 1. RTSP-SIMPLE-SERVER

A ready to use rtsp server that reads the ffmpeg rtsp stream and publishes it to go2rtc

Turn on by running rtsp-simple-server executable

#### 2. Stream FFmpeg

Python script that streams a local usb camera.

Run it like so: ```python3 streamFFmpeg.py```

You can also change the codec with -c or --codec and inpiut device with -d or --device, 
example: ```python3 streamFFmpeg.py -c "libx265" -d "/dev/video2"```

Codec defaults to "libx265", which is h265
Input device defaults to "/dev/video0" which is the first camera detected

#### 3. go2rtc

go2rtc is a lightweight, open-source streaming server designed for real-time video and audio streaming.

We are using it to read a stream in h265, manipulate and publish it so chrome could read and play it.

Run it with the docker compose provided (docker-compose up)

Config can be changed from go2rtc.yaml or from the web GUI in http://localhost:1984

#### 4. Web RTC Client

A client that holds one or more real time video players

On first startup run ```npm install``` which will download all the needed dependencies.
Afterwards just run ```npm run dev```