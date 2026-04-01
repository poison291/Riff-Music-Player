import React, { useState, useEffect } from "react";
import { FolderClosed } from "lucide-react";

export default function NoMusicFound() {
  const [machineName, setMachineName] = useState("...");
  const [homeDir, setHomeDir] = useState("~");

  invoke('get_machine_name').then(setMachineName).catch(() => setMachineName("Unknown"));
  invoke('get_home_dir').then(setHomeDir).catch(() => setHomeDir("~"));

  const onReScan = () => {
    alert("Rescaning the folder");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div
        className="text-white flex justify-center"
        style={{ animation: "floating 1.7s ease-in-out infinite" }}>
        <FolderClosed size={90} absoluteStrokeWidth color="#6e6e6e" />
      </div>

      <div>
        <h1 className="text-center text-white text-2xl font-semibold mt-5">
          No music found
        </h1>
        <p className="text-gray-400 text-center mt-4 text-lg">
          We couldn't find any audio files on <span className="text-white font-medium">{machineName}</span>
        </p>

        <div className="flex justify-center mt-3">
          <p className="text-gray-400 text-center text-sm bg-[#17171C] border border-[#222230] rounded-md px-4 py-2 font-mono">
            {homeDir}\Music
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={onReScan}
            className="text-gray-400 text-center text-xl border border-[#222230] rounded-md px-8 py-2">
            Rescan this folder
          </button>
        </div>
      </div>
    </div>
  );
}