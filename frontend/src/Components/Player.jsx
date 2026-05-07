import React, { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "../helper/useStore";
import { UpdatePresence, ClearPresence } from "../../wailsjs/go/main/App";
import { SkipBack, SkipForward } from "lucide-react";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Player() {
  const currentSong = useStore((state) => state.currentSong);
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);


  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    audio.currentTime = 0; // simple fallback
    audio.play();
  }, []);
  
  const handleNext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    audio.pause();
    audio.currentTime = 0; // replace with queue logic later
  }, []);
  
  // Sync audio time to state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(0);
    };
    const onPlay = () => {
      setIsPlaying(true);
      UpdatePresence(currentSong?.title, currentSong?.artist || "");
    };
    const onPause = () => {
      setIsPlaying(false);
      ClearPresence();
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      ClearPresence();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong, isSeeking]);

  // Reset on song change
  useEffect(() => {
    setCurrentTime(0);
    setSeekValue(0);
    setDuration(0);
  }, [currentSong?.streamUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }, []);

  const handleSeekStart = useCallback(() => {
    setIsSeeking(true);
    setSeekValue(currentTime);
  }, [currentTime]);

  const handleSeekChange = useCallback((e) => {
    setSeekValue(Number(e.target.value));
  }, []);

  const handleSeekEnd = useCallback((e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
    setIsSeeking(false);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  if (!currentSong) return null;

  const displayTime = isSeeking ? seekValue : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;
  const volumePct = volume * 100;

  return (
    <div
      style={{
        background: "#0F0F12",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "10px 20px 12px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        fontFamily: "'DM Sans', sans-serif",
        userSelect: "none",
      }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong.streamUrl}
        autoPlay
        style={{ display: "none" }}
      />

      {/* Album art + info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: "0 0 220px" }}>
        <img
          src={currentSong.image}
          alt={currentSong.title}
          style={{
            width: 48,
            height: 48,
            borderRadius: 6,
            objectFit: "cover",
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <p style={{
            margin: 0,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {currentSong.title}
          </p>
          <p style={{
            margin: 0,
            color: "#9a9a9a",
            fontSize: 11,
            fontWeight: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Center: play button + seeker */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          style={{
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "transform 0.1s ease, background 0.15s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isPlaying ? (
            // Pause icon
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1.5" y="1" width="3.5" height="10" rx="1" fill="#0F0F12" />
              <rect x="7" y="1" width="3.5" height="10" rx="1" fill="#0F0F12" />
            </svg>
          ) : (
            // Play icon
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" fill="#0F0F12" />
            </svg>
          )}
        </button>

        {/* Seeker row */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#9a9a9a", fontSize: 11, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}>
            {formatTime(displayTime)}
          </span>

          {/* Smooth range seeker */}
          <div style={{ flex: 1, position: "relative", height: 16, display: "flex", alignItems: "center" }}>
            {/* Track background */}
            <div style={{
              position: "absolute",
              left: 0, right: 0,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.12)",
              overflow: "hidden",
            }}>
              {/* Fill */}
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "#1DB954",
                borderRadius: 2,
              
              }} />
            </div>

            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.01}
              value={displayTime}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              style={{
                position: "absolute",
                left: 0, right: 0,
                width: "100%",
                opacity: 0,
                height: 16,
                cursor: "pointer",
                margin: 0,
              }}
            />

            {/* Thumb dot — shown on hover via parent group trick */}
            <div style={{
              position: "absolute",
              left: `calc(${progress}% - 6px)`,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              transition: isSeeking ? "none" : "left 0.25s linear",
            }} />
          </div>

          <span style={{ color: "#9a9a9a", fontSize: 11, fontVariantNumeric: "tabular-nums", minWidth: 32 }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "0 0 130px", justifyContent: "flex-end" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 5.5H4.5L8 2.5V13.5L4.5 10.5H2V5.5Z" fill="#9a9a9a" />
          {volume > 0 && <path d="M10 5.5C11.1 6.2 11.8 7.1 11.8 8C11.8 8.9 11.1 9.8 10 10.5" stroke="#9a9a9a" strokeWidth="1.4" strokeLinecap="round" />}
          {volume > 0.5 && <path d="M12 3.5C13.8 4.8 14.8 6.3 14.8 8C14.8 9.7 13.8 11.2 12 12.5" stroke="#9a9a9a" strokeWidth="1.4" strokeLinecap="round" />}
        </svg>
        <div style={{ position: "relative", width: 80, height: 16, display: "flex", alignItems: "center" }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: 3,
            borderRadius: 2, background: "rgba(255,255,255,0.12)", overflow: "hidden",
          }}>
            <div style={{
              width: `${volumePct}%`, height: "100%",
              background: "#9a9a9a", borderRadius: 2, transition: "width 0.05s",
            }} />
          </div>
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            style={{ position: "absolute", left: 0, right: 0, width: "100%", opacity: 0, height: 16, cursor: "pointer", margin: 0 }}
          />
          <div style={{
            position: "absolute",
            left: `calc(${volumePct}% - 5px)`,
            width: 10, height: 10,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            transition: "left 0.05s",
          }} />
        </div>
      </div>
    </div>
  );
}