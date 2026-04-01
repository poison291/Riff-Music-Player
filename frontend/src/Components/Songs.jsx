import React, { useEffect } from "react";
import { useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";

function Songs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    GetSongs().then((result) => {
      setSongs(result || []);
    });
  }, []);

  return (
   
  
        <div className="h-full overflow-y-auto bg-[#0F0F12] text-white font-mono">
          {/* Header Row */}
          <div className="flex px-6 py-2 text-xs text-[#444] border-b border-[#1a1a1a]">
            <span className="w-10">#</span>
            <span className="flex-1">TITLE</span>
            <span className="w-40">ALBUM</span>
            <span className="w-16 text-right">DURATION</span>
          </div>
    
          {/* Song Rows */}
          {songs.map((song, i) => (
            <div key={song.id} className="flex items-center px-6 py-3 border-b border-[#161616] hover:bg-white/4 cursor-pointer">
              <span className="w-10 text-xs text-[#444]">{i + 1}</span>
              <img className="w-8 h-9 rounded-xs mr-3" src={song.image} alt={song.title} />
              <span className="flex-1 text-sm text-[#ccc]">{song.title}</span>
              <span className="w-40 text-xs text-[#555] truncate">{song.album || "—"}</span>
              <span className="w-16 text-xs text-[#555] text-right"></span>
            </div>
          ))}
        </div>
  );
}

export default Songs;
