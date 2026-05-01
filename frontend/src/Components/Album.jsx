import React, { useEffect } from "react";
import { useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";
import { useStore } from "../helper/useStore";
import { ScaleLoader } from "react-spinners";
import { themes, defaultTheme } from "../helper/theme";

function Albums() {
  const activeTab = useStore((state) => state.activeTab);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const currentSong = useStore((state) => state.currentSong);
  const setCurrentSong = useStore((state) => state.setCurrentSong);
  const [themeName, setThemename] = useState(defaultTheme);
  const theme = themes[themeName];

  useEffect(() => {
    setLoading(true);
    GetSongs()
      .then((result) => {
        // grouped lives HERE where result exists
        const grouped = (result || []).reduce((acc, song) => {
          const key = song.album || "Unknown Album";
          if (!acc[key]) {
            acc[key] = {
              name: key,
              image: song.image,
              artist: song.artist,
              songs: [],
            };
          }
          acc[key].songs.push(song);
          return acc;
        }, {});
        setAlbums(Object.values(grouped));
      })
      .finally(() => setLoading(false));
  }, []);

  if (activeTab !== "albums") return null;

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
    <div className="h-full overflow-y-scroll no-scrollbar bg-[#0F0F12] text-white font-mono px-2 select-none">
      {/* Albums Rows */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 px-2">
        {albums.map((album) => (
          <div
            key={album.name}
            onClick={() => setCurrentSong(album.songs[0])}
            className="cursor-pointer group"
          >
            <div
              className={`relative h-36 rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] ${currentSong && album.songs.some((s) => s.id === currentSong.id) ? "ring-2 ring-white/60" : ""}`}
            >
              <img
                className="w-full h-full object-cover"
                src={album.image}
                alt={album.name}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>
            <div className="mt-2 px-1">
              <p className="text-sm font-semibold truncate">{album.name}</p>
              <p className="text-xs text-white/50 truncate">{album.artist}</p>
              <p className="text-xs text-white/30">
                {album.songs.length} songs
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albums;
