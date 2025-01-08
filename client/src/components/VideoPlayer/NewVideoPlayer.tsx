import React, { useState, useEffect, useRef } from 'react';
import VideoControls from './VideoControls';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  serverIp?: string;
}

const NewVideoPlayer: React.FC<VideoPlayerProps> = ({ src = "webcam", serverIp = "127.0.0.1" }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Track elapsed time since stream start
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isPlaying && videoRef.current && !videoRef.current.paused) {
        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
        setCurrentTime(elapsedSeconds);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  useEffect(() => {
    const configuration = { 
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ] 
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);
    const pc = peerConnectionRef.current;

    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    pc.ontrack = (event) => {
      console.log("Received track:", event.track.kind);
      if (videoRef.current && event.streams && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
        startTimeRef.current = Date.now(); // Reset start time when we get a new stream
        const playPromise = videoRef.current.play();
        if (playPromise) {
          playPromise.catch(error => {
            console.warn("Autoplay failed:", error);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(err => {
                console.error("Failed to play even with muted video:", err);
                setIsPlaying(false);
              });
            }
          });
        }
      }
    };

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
      }
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      console.log("ICE Connection State:", state);
      setIsConnected(state === 'connected');
      
      // Reset timer if connection is reestablished
      if (state === 'connected') {
        startTimeRef.current = Date.now();
      }
    };

    const connectToStream = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        if (!pc.localDescription) {
          throw new Error("Failed to create local description");
        }

        const response = await fetch(`http://${serverIp}:1984/api/webrtc?src=${src}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: pc.localDescription.type,
            sdp: pc.localDescription.sdp,
          })
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const answer = await response.json();
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Remote description set successfully");

      } catch (error) {
        console.error("Stream connection failed:", error);
        setIsConnected(false);
      }
    };

    connectToStream();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [serverIp, src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise) {
          playPromise.catch(err => {
            console.warn("Playback failed:", err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(err => {
                console.error("Failed to play even with muted video:", err);
              });
            }
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative">
      <video 
        ref={videoRef}
        className="w-full bg-black"
        autoPlay 
        playsInline
        muted={isMuted}
      />
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          Connecting...
        </div>
      )}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        isLive={true}
        currentTime={currentTime}
        onPlayPause={togglePlay}
        onMute={toggleMute}
        PlayIcon={Play}
        PauseIcon={Pause}
        VolumeIcon={Volume2}
        MuteIcon={VolumeX}
      />
    </div>
  );
};

export default NewVideoPlayer;