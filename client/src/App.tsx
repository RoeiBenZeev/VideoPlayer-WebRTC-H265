import React from 'react';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import NewVideoPlayer from './components/VideoPlayer/NewVideoPlayer';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 ">
      <h1 className="text-3xl font-bold text-white mb-8">Video Player</h1>
      <div className='relative flex gap-5'>
   {/* <VideoPlayer serverIp="127.0.0.1"/> */}
      <NewVideoPlayer src='yese'/>
      <NewVideoPlayer src='nose'/>
      <NewVideoPlayer src='shese'/>
      </div>
    </div>
  );
}

export default App;