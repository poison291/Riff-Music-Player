import React from "react";
import { useEffect, useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";
import { ScaleLoader } from "react-spinners";
import { useStore } from "../helper/useStore";
import Recommended from "../SubComp/Recommended";
import { defaultTheme, themes } from "../helper/theme";

function Home() {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [themeName, setThemename] = useState(defaultTheme);
  const theme = themes[themeName];
  const [featured, setFeatured] = useState([]);
  const [recommended, setRecommended] = useState([]);
  
  const currentSong = useStore((state) => state.currentSong)
  const setCurrentSong = useStore((state) => state.setCurrentSong);

  useEffect(() => {
      setLoading(true);
      GetSongs()
          .then((result) => {
              const bundled = result.filter(s => s.bundled);
              const userSongs = result.filter(s => !s.bundled);
              const shuffledUser = [...userSongs].sort(() => Math.random() - 0.5);
  
              setFeatured([bundled[8], bundled[0]].filter(Boolean));
              setRecommended([...bundled.slice(2), ...shuffledUser]);
          })
          .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ScaleLoader
          width={5}
          margin={5}
          speedMultiplier={0.7}
          height={64}
          color={theme.accent}
        />
      </div>
    );
  }

  return (
    <>
      <div className="select-none h-full overflow-y-auto no-scrollbar">
        {/* Featured Section*/}
        <div className="px-5 my-3 ">
          <h1 className="text-xl text-white font-semibold mb-3">Featured</h1>
          <div className="grid grid-cols-2 gap-5">
            {featured.map((song) => (
              <div onClick={() => setCurrentSong(song)} key={song.id}>
                <div className={`h-46 rounded-xl cursor-pointer overflow-hidden relative group transition-transform duration-200 hover:scale-[1.01] ${currentSong?.id === song.id ? "ring-2 ring-white/60" : ""}`}>
                  <img
                  className="w-full h-full object-cover"
                    src={song.image} alt={song.title} />
                   <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                         <p className="text-xs text-white/50 truncate">{song.artist}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Recommended component*/}
        <div className="mt-10">
        <Recommended/>
    
        </div>
      </div>
    </>
  );
}

export default Home;
