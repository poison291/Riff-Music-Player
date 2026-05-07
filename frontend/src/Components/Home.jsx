import React, { useEffect, useMemo, useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";
import { ScaleLoader } from "react-spinners";
import { useStore } from "../helper/useStore";
import Recommended from "../SubComp/Recommended";
import { defaultTheme, themes } from "../helper/theme";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Home() {
  const currentSong = useStore((s) => s.currentSong);
  const setCurrentSong = useStore((s) => s.setCurrentSong);

  const theme = themes[defaultTheme];

  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const result = await GetSongs();
        if (!alive) return;

        const bundled = result?.filter((s) => s.bundled) || [];
        const user = result?.filter((s) => !s.bundled) || [];

        const shuffledUser = shuffle(user);

        setFeatured(
          [bundled?.[0], bundled?.[1]].filter(Boolean)
        );

        setRecommended([...bundled.slice(2), ...shuffledUser]);
      } catch (e) {
        console.error("Failed to load songs", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const featuredList = useMemo(() => featured, [featured]);

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
    <div className="select-none h-full overflow-y-auto no-scrollbar">

      {/* Featured */}
      <div className="px-5 my-3">
        <h1 className="text-xl text-white font-semibold mb-3">
          Featured
        </h1>

        <div className="grid grid-cols-2 gap-5">
          {featuredList.map((song) => (
            <div
              key={song.id}
              onClick={() => setCurrentSong(song)}
              className={`
                h-46 rounded-xl cursor-pointer overflow-hidden relative group
                transition-transform duration-200 hover:scale-[1.01]
                ${currentSong?.id === song.id ? "ring-2 ring-white/60" : ""}
              `}
            >
              <img
                src={song.image}
                alt={song.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-semibold truncate">
                  {song.title}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {song.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-10">
        <Recommended data={recommended} />
      </div>

    </div>
  );
}

export default Home;