import React, { useEffect, useRef } from "react";
import { useStore } from "../helper/useStore";
import { UpdatePresence } from "../../wailsjs/go/main/App";

export default function Player() {
  const currentSong = useStore((state) => state.currentSong);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong) {
      UpdatePresence(currentSong.title, currentSong.artist || "");
    }
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <div>
      <div className="text-white py-4 px-3 bg-[#0F0F12] font-semibold flex">
        <img
          className="w-14 h-14 rounded-md"
          src={currentSong.image}
          alt={currentSong.title}
        />
        <div className="flex-1 mt-3 ml-3 justify-center">
          <p className="text-sm">{currentSong.title}</p>
          <p className="text-sm">{currentSong.Duration}</p>
          <p className="text-xs text-gray-400 font-normal">{currentSong.artist}</p>
        </div>
        <div>
          <audio ref={audioRef} src={currentSong.streamUrl} autoPlay controls />
        </div>
      </div>
    </div>
  );
}