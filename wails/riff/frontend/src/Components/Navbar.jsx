import React from 'react';

function Navbar() {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4 border-b border-[#1f1f1f]">
     
      <div className="relative">
        <input
          placeholder="Search tracks, artists..."
          className="text-xs rounded-md px-4 py-2 pl-9 outline-none w-64 bg-[#1a1a1a] text-[#ccc] border border-[#2a2a2a] focus:border-gray-500 transition"
        />
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#555]">
          ⌕
        </span>
      </div>

      
      <div className="flex items-center gap-3 font-mono">
        <button className="text-gray-400 text-sm flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#1f1f1f] transition">
          <span className="text-xs opacity-60">⌘</span>
          <span className="text-xs opacity-60">K</span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
          <img
            src="/profile.jpg"
            alt="profile"
            className="w-full h-full object-cover"
          />  
        </div>
      </div>

    </div>
  );
}

export default Navbar;