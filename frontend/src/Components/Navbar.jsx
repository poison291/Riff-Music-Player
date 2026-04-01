import React from 'react';
import { WindowMinimise, WindowToggleMaximise, Quit } from "../../wailsjs/runtime/runtime";

function Navbar() {
  return (
    <div
      className="flex items-center justify-between px-4 h-16 bg-[#0F0F12] select-none border-b border-[#1f1f1f]"
      style={{ "--wails-draggable": "drag" }}
    >
      {/* Left — Search */}
      <div style={{ "--wails-draggable": "no-drag" }} className="flex items-center">
        <div className="relative">
          <input
            placeholder="Search tracks, artists..."
            className="text-xs rounded-md px-3 py-2 pl-8 outline-none w-64 bg-[#1a1a1a] text-[#ccc] border border-[#2a2a2a] focus:border-gray-500 transition"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#555]">
            ⌕
          </span>
        </div>
      </div>

      <div
        className="flex items-center gap-2"
        style={{ "--wails-draggable": "no-drag" }}
      >
 
        <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 mr-3">
          <img
            src="/profile.jpg"
            alt="profile"
            className="w-full h-full object-cover"
          />
      
        </div>

        {/* Window Controls */}
        <button
          onClick={WindowMinimise}
          className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white hover:bg-white/10 rounded transition"
        >
          ─
        </button>

        <button
          onClick={WindowToggleMaximise}
          className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white hover:bg-white/10 rounded transition"
        >
          □
        </button>

        <button
          onClick={Quit}
          className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white hover:bg-red-500 rounded transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Navbar;