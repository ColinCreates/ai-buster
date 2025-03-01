import React from "react";

const AnalysisToggles = ({
  checkGenAi,
  checkDeepfake,
  toggleGenAi,
  toggleDeepfake,
}) => {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      <button
        onClick={toggleGenAi}
        className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
          checkGenAi
            ? "bg-blue-950 text-blue-200 border border-blue-800 hover:bg-blue-900"
            : "bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800"
        }`}
      >
        {checkGenAi ? "AI Image On" : "AI Image Off"}
      </button>
      <button
        onClick={toggleDeepfake}
        className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
          checkDeepfake
            ? "bg-violet-950 text-violet-200 border border-violet-800 hover:bg-violet-900"
            : "bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800"
        }`}
      >
        {checkDeepfake ? "Deepfake On" : "Deepfake Off"}
      </button>
    </div>
  );
};

export default AnalysisToggles;
