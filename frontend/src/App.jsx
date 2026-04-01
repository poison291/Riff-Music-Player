import React from 'react';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Songs from './Components/Songs';
import { useStore } from "./helper/useStore";


function App() {
  const activeTab = useStore((state) => state.activeTab);
  
  const Albums = () => <div className="p-10 text-white font-mono">Albums View</div>;
  const Artists = () => <div className="p-10 text-white font-mono">Artists View</div>;
  const Liked = () => <div className="p-10 text-white font-mono">Liked Songs View</div>;
  
  const renderContent = () => {
      switch (activeTab) {
        case "library":
          return <Songs />;
        case "albums":
          return <Albums />;
        case "artists":
          return <Artists />;
        case "liked":
          return <Liked />;
        default:
          return <Songs />;
      }
    };
  
  return (
    <div className='bg-[#0F0F12] h-screen flex overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <nav className="shrink-0">
          <Navbar />
        </nav>
        <div className="flex-1 overflow-hidden">

                  {renderContent()}
             
        </div>
      </div>
    </div>
  );
}

export default App;