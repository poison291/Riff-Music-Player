import React, { useEffect } from "react";
import { useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";
import { useStore } from "../helper/useStore";
import {ScaleLoader} from "react-spinners" 

function Albums() {
  const activeTab = useStore((state) => state.activeTab);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);


  if (activeTab !== "albums") return null;
  
  useEffect(() => {
    setLoading(true);
    GetSongs().then((result) => {
      setSongs(result || []);
    })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ScaleLoader width={5}  margin={5} speedMultiplier={0.7}  height={64} color="white"/>
      </div>
    )
  }

  return (

        <div className="h-full overflow-y-scroll no-scrollbar bg-[#0F0F12] text-white font-mono px-2 select-none">
        
          <div className="sticky top-0 z-10 flex items-center px-6 py-2 text-xs text-[#444]  bg-[#0F0F12] border-b border-[#1a1a1a]">
            <span className="w-8 ">#</span>
            <span className="flex-1 ml-2">TITLE</span>
            <span className="w-48 hidden md:block">ALBUM</span>
            <span className="w-20 text-right">DURATION</span>
          </div>
    
          {/* Song Rows */}
          {songs.map((song, i) => (
            <div key={song.id} className="flex items-center px-4 py-3  hover:bg-white/4 cursor-pointer">
              <span className="w-10 text-xs text-[#444]">{i + 1}</span>
              <img className="w-8 h-9 rounded mr-3 object-cover bg-[#1a1a1a]" src={song.image || ""} alt={song.title} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-sm text-[#ccc] truncate group-hover:text-white">{song.title}</span>
                <span className="text-xs text-[#555] truncate">{song.artist}</span>
              </div>
              <span className="w-54 text-xs text-[#555] truncate hidden md:block">{song.album || "—"}</span>
              <span className="w-16 text-xs text-[#555] text-right"></span>
            </div>
          ))}
        </div>
  );
}

export default Albums;
