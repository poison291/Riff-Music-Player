import React, { useState } from "react";
import { defaultTheme, themes } from "../helper/theme";
import { useStore } from "../helper/useStore";
import {
  House,
  Library,
  LucideDisc,
  LucideDownload,
  LucideHeart,
  LucideUsers,
} from "lucide-react";

function Sidebar() {
  const [themeName, setThemename] = useState(defaultTheme);
  const theme = themes[themeName];

  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  const navItem = [
    { id: "home", icon: <House size={18} />, label: "Home" },
    { id: "library", icon: <Library size={18} />, label: "Library" },
    { id: "albums", icon: <LucideDisc size={18} />, label: "Albums" },
    { id: "artists", icon: <LucideUsers size={18} />, label: "Artists" },
    { id: "liked", icon: <LucideHeart size={18} />, label: "Liked" },
    { id: "download", icon: <LucideDownload size={18} />, label: "Download" },
  ];

  return (
    <div className="bg-[#09090b] flex flex-col w-64 h-screen p-2 select-none overflow-hidden">
      <div className="flex items-center gap-2 mb-3 mt-3">
        <img
          src="./icon.png"
          className="w-10 object-contain "
          alt="riff logo"
        />
        <h1 className="text-white text-md font-bold  ">RIFF</h1>
      </div>

      <div className="mt-5 flex flex-col gap-1">
        {navItem.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150
              ${activeTab === item.id ? "bg-white/10 text-white" : "text-[#666] hover:bg-[#1e1e20]"}
            `}
          >
            {activeTab === item.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-[#34D399] rounded-r-full" />
            )}
            <span
              className={
                activeTab === item.id ? "text-[#34D399] " : "text-[#666]"
              }
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
      <h1>{theme.accent}</h1>
    </div>
  );
}

export default Sidebar;
