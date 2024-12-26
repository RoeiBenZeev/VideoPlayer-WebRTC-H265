import React from 'react';
import VideoControls from './VideoControls';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        src={src || "http://localhost:8000/video"}
        controls
      />
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