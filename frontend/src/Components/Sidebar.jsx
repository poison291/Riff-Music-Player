import React, { useState } from "react";
import { defaultTheme, themes } from "../helper/theme";
import { useStore } from "../helper/useStore";
import Navbar from "./Navbar";

function Sidebar() {
  const [themeName, setThemename] = useState(defaultTheme);
  const theme = themes[themeName];
  
  const activeTab = useStore((state) => state.activeTab);
    const setActiveTab = useStore((state) => state.setActiveTab);

  const navItem = [
    { id: "library", icon: "▤", label: "Library" },
    { id: "albums", icon: "◫", label: "Albums" },
    { id: "artists", icon: "◎", label: "Artists" },
    { id: "liked", icon: "♥", label: "Liked" },
  ];

  return (
    <div className="bg-[#121212] flex flex-col w-64 h-screen p-2 select-none overflow-hidden">
 
      <div className="flex items-center gap-2 mb-3 mt-3">
        <img
          src="./icon.png"
          className="w-10 object-contain "
          alt="riff logo"
        />
        <h1 className="text-white text-md font-bold font-mono ">RIFF</h1>
      </div>
      <hr className="text-[#222222] -m-2" />

      <div className="mt-5 flex flex-col gap-1">
        {navItem.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex items-center gap-3 px-3 py-2 rounded-md font-mono text-xs tracking-[0.08em] uppercase transition-colors duration-150 text-left hover:bg-white/5 "
            style={{
              color: activeTab === item.id ? theme.accent : "#666",
              backgroundColor:
                activeTab === item.id ? theme.accentMuted : "transparent",
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
