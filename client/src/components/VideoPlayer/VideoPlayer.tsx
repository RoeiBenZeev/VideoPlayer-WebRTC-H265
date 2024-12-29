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
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    const start = async () => {
      const response = await fetch(`http://${serverIp}:8000/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const offer = await response.json();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await fetch(`http://${serverIp}:8000/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sdp: pc.localDescription.sdp,
          type: pc.localDescription.type,
          pc_id: offer.pc_id
        })
      });
    };

    start();

    return () => {
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