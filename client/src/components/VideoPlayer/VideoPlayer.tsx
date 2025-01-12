import React, { useState, useEffect, useRef } from 'react';
import VideoControls from './VideoControls';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  serverIp: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, serverIp = "127.0.0.1" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    const pc = new RTCPeerConnection(configuration);
    const dataChannel = pc.createDataChannel("dummy"); // Add a dummy data channel
        
    pc.ontrack = (event) => {
      console.log("ontrack");
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = event => {
      const candidate = event.candidate;
      console.log("ICE Candidate:", candidate);
      if (candidate) {
          console.log("New ICE candidate:", candidate);
          fetch(`http://${serverIp}:1984/api/candidates`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidate),
          });
          // Here you would typically send the ICE candidate to the other peer
      } else {
          console.log("ICE gathering finished.");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
    };

    const start = async () => {
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      const response = await fetch(`http://${serverIp}:1984/api/webrtc?src=yese`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: pc.localDescription.type,
          sdp: pc.localDescription.sdp,
          configuration,
        })
      });
      const answer = await response.json();
      await pc.setRemoteDescription(new RTCSessionDescription(answer)).then(() => {
        console.log("Remote SDP set successfully.");
      })
      .catch((error) => {
        console.error("Failed to set remote SDP:", error);
      });
    };

    start();

    return () => {
      // Cleanup code if necessary
      pc.close();
    };
  }, [serverIp]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
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
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        progress={progress}
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

export default VideoPlayer;