import React, { useEffect, useRef } from 'react';
import VideoControls from './VideoControls';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  serverIp: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, serverIp }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    const pc = new RTCPeerConnection();
    const dataChannel = pc.createDataChannel("dummy"); // Add a dummy data channel
        
    pc.ontrack = (event) => {
      debugger;
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = event => {
      console.log("ICE Candidate:", event.candidate);
      if (event.candidate) {
          console.log("New ICE candidate:", event.candidate);
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
      
      debugger;
      const response = await fetch(`http://${serverIp}:1984/api/webrtc?src=webcam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: pc.localDescription.type,
          sdp: pc.localDescription.sdp
          ,
        })
      });
      debugger;
      const answer = await response.json();
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
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