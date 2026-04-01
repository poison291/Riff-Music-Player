import React from 'react';

import NoMusicFound from './Components/Analyze';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Songs from './Components/Songs';

function App() {
  return (
    <div className='bg-[#0F0F12] min-h-screen flex'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Navbar />
        {/* <Songs/>*/}
        
      </div>
    </div>
  );
}
    
export default App;