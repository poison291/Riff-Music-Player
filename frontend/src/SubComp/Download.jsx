import React, { useState } from "react";

function Download() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const isSpotifyUrl = (value) => {
    return /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+/.test(
      value
    );
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUrl(value);

    if (!value) {
      setError("");
      return;
    }

    if (!isSpotifyUrl(value)) {
      setError("Enter a valid Spotify track, album, or playlist URL");
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!url || error) return;

    console.log("Valid Spotify URL:", url);
    // later: send to backend downloader
  };

  return (
    <div className="h-full flex items-center justify-center text-white">
      <div className="w-[420px] bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-4">

        <h1 className="text-lg font-semibold">Spotify Downloader</h1>
        <p className="text-xs text-neutral-400">
          Paste a Spotify track, album, or playlist URL
        </p>

        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="https://open.spotify.com/track/..."
          className={`w-full px-3 py-2 rounded-md bg-[#0F0F12] border text-sm outline-none
            ${
              error
                ? "border-red-500"
                : "border-neutral-800 focus:border-neutral-500"
            }`}
        />

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!url || !!error}
          className="w-full py-2 rounded-md bg-white text-black text-sm font-medium
          disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          Process URL
        </button>
      </div>
    </div>
  );
}

export default Download;