#### Stream FFmpeg

Python script that streams a local usb camera.

Run it like so: ```python3 streamFFmpeg.py```

You can also change the codec with -c or --codec and inpiut device with -d or --device, 
example: "python3 streamFFmpeg.py -c "libx265" -d "/dev/video2"" 

Codec defaults to "libx265", which is h265
Input device defaults to "/dev/video0" which is the first camera detected