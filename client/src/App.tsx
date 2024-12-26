import React from 'react';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Video Player</h1>
      <VideoPlayer />
    </div>
  );
}

export default App;