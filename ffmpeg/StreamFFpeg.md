#### Stream FFmpeg

Python script that streams a local usb camera.

Run it like so: ```python3 streamFFmpeg.py```

You can change some of its variables using the system arguments:

| Field            | Short | Long      |
| ---------------- |:-----:| ---------:|
| Codec            | -c    | --codec   |
| Input Device     | -i    | --input   |
| RTSP URL Address | -a    | --Address |
    -c , --codec
You can also change the codec with -c or --codec and inpiut device with -i or --input, 
example: ````python3 streamFFmpeg.py -c "libx265" -i "/dev/video2" -a "input.mp4"````

Codec defaults to "libx265", which is h265
Input device defaults to "/dev/video0" which is the first camera detected