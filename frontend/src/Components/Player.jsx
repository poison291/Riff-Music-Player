import React from "react";
import { useStore } from "../helper/useStore";
import { useEffect, useRef } from "react";

export default function Player() {
  const currentSong = useStore((state) => state.currentSong);

  if (!currentSong) {
    return null;
  }
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

          <p className="text-xs text-gray-400 font-normal">
            {currentSong.artist}
          </p>
        </div>

        <div>
          <audio
          src={currentSong.streamUrl}
           autoPlay controls />
        </div>
      </div>
    </div>
  );
}
