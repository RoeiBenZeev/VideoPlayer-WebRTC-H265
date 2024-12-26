import React from 'react';
import { LucideIcon } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
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
  progress,
  onPlayPause,
  onMute,
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  MuteIcon,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <div className="w-full bg-gray-200 h-1 rounded-full mb-4">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-white">
        <button
          onClick={onPlayPause}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6" />
          )}
        </button>
        
        <button
          onClick={onMute}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          {isMuted ? (
            <MuteIcon className="w-6 h-6" />
          ) : (
            <VolumeIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoControls;