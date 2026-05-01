import { useStore } from "../helper/useStore";

function Settings() {
  const setShowSettings = useStore((state) => state.setShowSettings);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setShowSettings(false)}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-100 bg-[#121212] z-50 shadow-xl p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-lg font-semibold">Settings</h1>
          <button
            onClick={() => setShowSettings(false)}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-white/80">
          <div>General</div>  
          <div>Appearance</div>
          <div>Integrations</div>
        </div>
      </div>
    </>
  );
}

export default Settings;