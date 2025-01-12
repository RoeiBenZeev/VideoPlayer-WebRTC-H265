#### Stream FFmpeg

Python script that streams a local usb camera.

Run it like so: ```python3 streamFFmpeg.py```

You can change some of its variables using the system arguments:

| Field            | Short | Long      | Default                      |
| ---------------- |:-----:| ---------:| ----------------------------:|
| Codec            | -c    | --codec   | "libx265"                    |
| Input Device     | -i    | --input   | "/dev/video0"                |
| RTSP URL Address | -a    | --Address | "rtsp://127.0.0.1:8558/yese" |

example: ````python3 streamFFmpeg.py -c "libx265" -i "/dev/video2" -a "input.mp4"````