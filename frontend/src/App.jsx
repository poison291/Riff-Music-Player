import React from 'react';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Songs from './Components/Songs';
import Analyze from './Components/Analyze';

function App() {
  return (
    <div className='bg-[#0F0F12] h-screen flex overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <nav className="shrink-0">
          <Navbar />
        </nav>
        <div className="flex-1 overflow-hidden">
          <Songs />
        </div>
      </div>
    </div>
  );
}

export default App;