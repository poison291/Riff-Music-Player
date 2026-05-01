import React from "react";
import { useEffect, useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";
import { ScaleLoader } from "react-spinners";
import { useStore } from "../helper/useStore";

function Recommended() {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  const currentSong = useStore((state) => state.currentSong);
  const setCurrentSong = useStore((state) => state.setCurrentSong);

  useEffect(() => {
    setLoading(true);
    GetSongs()
      .then((result) => {
        const shuffled = [...(result || [])].sort(() => Math.random() - 0.5);
        setSongs(shuffled.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="overflow-y-auto">
        {/* Recommended section*/}
        <div className="px-5 my-3 ">
          <h1 className="text-xl text-white font-semibold mb-5">Recommended For You</h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 px-2">
            {songs.slice(0, 8).map((song) => (
              <div onClick={() => setCurrentSong(song)} key={song.id}>
                <div
                  className={`h-36 rounded-xl overflow-auto cursor-pointer relative group transition-transform duration-200 hover:scale-[1.01] ${currentSong?.id === song.id ? "ring-2 ring-white/60" : ""}`}
                >
                  <img
                    className="w-full h-full object-cover  "
                    src={song.image}
                    alt={song.title}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Recommended;
