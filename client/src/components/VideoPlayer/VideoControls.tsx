import React from 'react';
import { LucideIcon } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isLive: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onMute: () => void;
  PlayIcon: LucideIcon;
  PauseIcon: LucideIcon;
  VolumeIcon: LucideIcon;
  MuteIcon: LucideIcon;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  isLive,
  currentTime,
  onPlayPause,
  onMute,
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  MuteIcon,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onPlayPause}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white" />}
          </button>
          
          <button 
            onClick={onMute}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            {isMuted ? <MuteIcon className="w-6 h-6 text-white" /> : <VolumeIcon className="w-6 h-6 text-white" />}
          </button>
          
          <span className="text-white text-sm">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;