import React from "react";

const ResultsDisplay = ({
  genAiResult,
  deepfakeResults,
  genAiVideoResults,
  deepfakeVideoResults,
  overallGenAiConclusion,
  overallDeepfakeConclusion,
  error,
}) => {
  if (
    !genAiResult &&
    !deepfakeResults &&
    !genAiVideoResults &&
    !deepfakeVideoResults &&
    !error
  )
    return null;

  return (
    <div className="mt-6 space-y-6 text-gray-300">
      {error && (
        <div className="bg-gray-900 border-l-4 border-red-700 text-red-300 p-4 rounded-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
      {genAiResult && (
        <div className="bg-gray-900 p-4 rounded-lg border border-blue-950">
          <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center">
            <span className="mr-2">🤖</span> AI-Generated Image
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Probability:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  genAiResult.type?.ai_generated > 0.5
                    ? "bg-red-950 text-red-300"
                    : "bg-green-950 text-green-300"
                }`}
              >
                {(genAiResult.type?.ai_generated * 100 || 0).toFixed(2)}%
              </span>
            </p>
            <p>
              <span className="font-medium">Verdict:</span>{" "}
              {genAiResult.type?.ai_generated > 0.5
                ? "Likely AI-Generated"
                : "Likely Real"}
            </p>
          </div>
        </div>
      )}
      {deepfakeResults && (
        <div className="bg-gray-900 p-4 rounded-lg border border-violet-950">
          <h3 className="text-lg font-medium text-violet-300 mb-2 flex items-center">
            <span className="mr-2">🎭</span> Deepfake Image
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Probability:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  deepfakeResults[0].probability > 0.5
                    ? "bg-red-950 text-red-300"
                    : "bg-green-950 text-green-300"
                }`}
              >
                {(deepfakeResults[0].probability * 100).toFixed(2)}%
              </span>
            </p>
            <p>
              <span className="font-medium">Verdict:</span>{" "}
              {deepfakeResults[0].probability > 0.5
                ? "Likely Deepfake"
                : "Likely Real"}
            </p>
          </div>
        </div>
      )}
      {(genAiVideoResults || deepfakeVideoResults) && (
        <div>
          <h3 className="text-xl font-medium text-gray-200 mb-4">
            Video Analysis
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(genAiVideoResults || deepfakeVideoResults).map((_, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-lg border border-gray-800"
              >
                <img
                  src={
                    genAiVideoResults?.[index]?.frameUrl ||
                    deepfakeVideoResults?.[index]?.frameUrl
                  }
                  alt={`Frame ${index + 1}`}
                  className="w-full h-auto rounded mb-2 border border-gray-700"
                />
                {genAiVideoResults && (
                  <div className="mb-2">
                    <p className="text-gray-300">
                      <span className="font-medium">AI:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          genAiVideoResults[index].probability > 0.5
                            ? "bg-red-950 text-red-300"
                            : "bg-green-950 text-green-300"
                        }`}
                      >
                        {(genAiVideoResults[index].probability * 100).toFixed(
                          2
                        )}
                        %
                      </span>
                    </p>
                    <p className="text-gray-300">
                      {genAiVideoResults[index].probability > 0.5
                        ? "Likely AI"
                        : "Likely Real"}
                    </p>
                  </div>
                )}
                {deepfakeVideoResults && (
                  <div>
                    <p className="text-gray-300">
                      <span className="font-medium">Deepfake:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          deepfakeVideoResults[index].probability > 0.5
                            ? "bg-red-950 text-red-300"
                            : "bg-green-950 text-green-300"
                        }`}
                      >
                        {(
                          deepfakeVideoResults[index].probability * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </p>
                    <p className="text-gray-300">
                      {deepfakeVideoResults[index].probability > 0.5
                        ? "Likely Deepfake"
                        : "Likely Real"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {(overallGenAiConclusion || overallDeepfakeConclusion) && (
            <div className="mt-4 space-y-4">
              {overallGenAiConclusion && (
                <div className="bg-gray-900 p-4 rounded-lg border border-blue-950">
                  <h4 className="text-lg font-medium text-blue-300">
                    Overall AI Conclusion
                  </h4>
                  <p className="text-gray-300">
                    Avg Probability:{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm ${
                        overallGenAiConclusion.averageProbability > 0.5
                          ? "bg-red-950 text-red-300"
                          : "bg-green-950 text-green-300"
                      }`}
                    >
                      {(
                        overallGenAiConclusion.averageProbability * 100
                      ).toFixed(2)}
                      %
                    </span>
                  </p>
                  <p className="text-gray-300 font-medium">
                    {overallGenAiConclusion.isGenAi
                      ? "Likely AI-Generated"
                      : "Likely Real"}
                  </p>
                </div>
              )}
              {overallDeepfakeConclusion && (
                <div className="bg-gray-900 p-4 rounded-lg border border-violet-950">
                  <h4 className="text-lg font-medium text-violet-300">
                    Overall Deepfake Conclusion
                  </h4>
                  <p className="text-gray-300">
                    Avg Probability:{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm ${
                        overallDeepfakeConclusion.averageProbability > 0.5
                          ? "bg-red-950 text-red-300"
                          : "bg-green-950 text-green-300"
                      }`}
                    >
                      {(
                        overallDeepfakeConclusion.averageProbability * 100
                      ).toFixed(2)}
                      %
                    </span>
                  </p>
                  <p className="text-gray-300 font-medium">
                    {overallDeepfakeConclusion.isDeepfake
                      ? "Likely Deepfake"
                      : "Likely Real"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
