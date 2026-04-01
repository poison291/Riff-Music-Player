import React, { useEffect, useState } from "react";

function Songs({ onSelect, currentSong }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const result = await invoke("get_songs");
        const parsed = typeof result === "string" ? JSON.parse(result) : result;
        setSongs(parsed);
      } catch (err) {
        console.error("Failed to load songs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0F0F12]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#0F0F12] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F0F12] text-[#ccc] font-mono overflow-hidden">


      {/* Column Labels */}
      <div className="flex items-center gap-3 px-6 py-2 text-[10px] tracking-[0.15em] text-[#444] border-b border-[#1a1a1a]">
        <span className="w-8">#</span>
        <span className="w-10" />
        <span className="flex-1">TITLE</span>
        <span className="w-36">ARTIST</span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-[#111] scrollbar-thumb-[#2a2a2a]">
        {songs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#444] tracking-widest">
            No songs found in ~/Music
          </div>
        ) : (
          songs.map((song, i) => {
            const isActive = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => onSelect?.(song)}
                className={`
                  flex items-center gap-3 px-6 py-2 cursor-pointer
                  border-b border-[#161616] transition-all duration-150
                  hover:bg-white/[0.04]
                  ${isActive
                    ? "bg-white/[0.06] border-l-2 border-l-white"
                    : "border-l-2 border-l-transparent"
                  }
                `}
              >
                {/* Index */}
                <span className="w-8 text-[11px] text-[#444] text-right shrink-0">
                  {isActive ? "▶" : String(i + 1).padStart(2, "0")}
                </span>

                {/* Album Art */}
                <div className="w-9 h-9 shrink-0 rounded overflow-hidden bg-[#1e1e1e]">
                  {song.image ? (
                    <img
                      src={song.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-[#333]">
                      ♪
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 overflow-hidden">
                  <span
                    className={`block text-[13px] truncate transition-colors duration-150 ${
                      isActive ? "text-white" : "text-[#ccc]"
                    }`}
                  >
                    {song.title}
                  </span>
                </div>

               
                <span className="w-36 text-[11px] text-[#555] truncate shrink-0">
                  {song.artist !== "Unknown" ? song.artist : "—"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Songs;