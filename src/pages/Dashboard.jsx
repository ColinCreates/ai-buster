import React, { useState } from "react";
import Header from "../components/Navbar";
import MediaUpload from "../components/MediaUpload";
import AnalysisToggles from "../components/AnalysisToggles";
import ResultsDisplay from "../components/ResultsDisplay";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [genAiResult, setGenAiResult] = useState(null);
  const [deepfakeResults, setDeepfakeResults] = useState(null);
  const [genAiVideoResults, setGenAiVideoResults] = useState(null);
  const [deepfakeVideoResults, setDeepfakeVideoResults] = useState(null);
  const [overallGenAiConclusion, setOverallGenAiConclusion] = useState(null);
  const [overallDeepfakeConclusion, setOverallDeepfakeConclusion] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [checkGenAi, setCheckGenAi] = useState(true);
  const [checkDeepfake, setCheckDeepfake] = useState(true);

  const SIGHTENGINE_API_USER = import.meta.env.VITE_SIGHTENGINE_API_USER;
  const SIGHTENGINE_API_SECRET = import.meta.env.VITE_SIGHTENGINE_API_SECRET;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setImageUrl(URL.createObjectURL(selectedFile));
        setVideoUrl("");
      } else if (selectedFile.type.startsWith("video/")) {
        setVideoUrl(URL.createObjectURL(selectedFile));
        setImageUrl("");
      }
      setGenAiResult(null);
      setDeepfakeResults(null);
      setGenAiVideoResults(null);
      setDeepfakeVideoResults(null);
      setOverallGenAiConclusion(null);
      setOverallDeepfakeConclusion(null);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("image/") ||
        droppedFile.type.startsWith("video/"))
    ) {
      setFile(droppedFile);
      if (droppedFile.type.startsWith("image/")) {
        setImageUrl(URL.createObjectURL(droppedFile));
        setVideoUrl("");
      } else if (droppedFile.type.startsWith("video/")) {
        setVideoUrl(URL.createObjectURL(droppedFile));
        setImageUrl("");
      }
      setGenAiResult(null);
      setDeepfakeResults(null);
      setGenAiVideoResults(null);
      setDeepfakeVideoResults(null);
      setOverallGenAiConclusion(null);
      setOverallDeepfakeConclusion(null);
      setError(null);
    } else {
      setError("Please drop a valid image or video file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const toggleGenAi = () => setCheckGenAi(!checkGenAi);
  const toggleDeepfake = () => setCheckDeepfake(!checkDeepfake);

  const extractFrames = (videoFile) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const frameInterval = duration / 9; // Aim for 8 frames + 1 to adjust
        const frames = [];
        let frameCount = 0;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 320;
        canvas.height = 180;

        const captureFrame = (time) => {
          video.currentTime = time;
        };

        video.onseeked = () => {
          if (frameCount < 8) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameUrl = canvas.toDataURL("image/jpeg");
            frames.push(frameUrl);
            frameCount++;
            if (frameCount < 8) {
              captureFrame(frameInterval * frameCount);
            } else {
              URL.revokeObjectURL(video.src);
              resolve(frames);
            }
          }
        };

        captureFrame(frameInterval);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve([]);
      };
    });
  };

  const analyzeMedia = async () => {
    if (!file) {
      setError("Please upload or drag and drop a file first.");
      return;
    }
    if (!checkGenAi && !checkDeepfake) {
      setError("Please select at least one analysis type.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (file.type.startsWith("image/") && (checkGenAi || checkDeepfake)) {
        const imageModels = [];
        if (checkGenAi) imageModels.push("genai");
        if (checkDeepfake) imageModels.push("deepfake");

        const imageFormData = new FormData();
        imageFormData.append("media", file);
        imageFormData.append("models", imageModels.join(","));
        imageFormData.append("api_user", SIGHTENGINE_API_USER);
        imageFormData.append("api_secret", SIGHTENGINE_API_SECRET);

        const imageResponse = await fetch(
          "https://api.sightengine.com/1.0/check.json",
          {
            method: "POST",
            body: imageFormData,
          }
        );
        if (!imageResponse.ok) throw new Error("Image analysis failed");
        const imageData = await imageResponse.json();
        if (checkGenAi)
          setGenAiResult({
            type: { ai_generated: imageData.type?.ai_generated || 0 },
          });
        if (checkDeepfake)
          setDeepfakeResults([
            { frameUrl: imageUrl, probability: imageData.type?.deepfake || 0 },
          ]);
      }

      if (file.type.startsWith("video/") && (checkGenAi || checkDeepfake)) {
        const frames = await extractFrames(file);
        if (frames.length < 8)
          throw new Error("Could not extract enough frames from the video.");

        let genAiResults = [];
        let deepfakeResults = [];

        for (const frameUrl of frames) {
          const blob = await (await fetch(frameUrl)).blob();
          const frameFile = new File(
            [blob],
            `frame-${frames.indexOf(frameUrl)}.jpg`,
            { type: "image/jpeg" }
          );

          const formData = new FormData();
          formData.append("media", frameFile);
          formData.append(
            "models",
            [checkGenAi && "genai", checkDeepfake && "deepfake"]
              .filter(Boolean)
              .join(",")
          );
          formData.append("api_user", SIGHTENGINE_API_USER);
          formData.append("api_secret", SIGHTENGINE_API_SECRET);

          const response = await fetch(
            "https://api.sightengine.com/1.0/check.json",
            {
              method: "POST",
              body: formData,
            }
          );
          if (!response.ok) throw new Error("Frame analysis failed");
          const data = await response.json();

          if (checkGenAi) {
            genAiResults.push({
              frameUrl,
              probability: data.type?.ai_generated || 0,
            });
          }
          if (checkDeepfake) {
            deepfakeResults.push({
              frameUrl,
              probability: data.type?.deepfake || 0,
            });
          }
        }

        if (checkGenAi) {
          setGenAiVideoResults(genAiResults);
          const averageGenAiProbability =
            genAiResults.reduce((sum, r) => sum + r.probability, 0) /
            genAiResults.length;
          const isGenAi = averageGenAiProbability > 0.5;
          setOverallGenAiConclusion({
            averageProbability: averageGenAiProbability,
            isGenAi,
          });
        }
        if (checkDeepfake) {
          setDeepfakeVideoResults(deepfakeResults);
          const averageDeepfakeProbability =
            deepfakeResults.reduce((sum, r) => sum + r.probability, 0) /
            deepfakeResults.length;
          const isDeepfake = averageDeepfakeProbability > 0.5;
          setOverallDeepfakeConclusion({
            averageProbability: averageDeepfakeProbability,
            isDeepfake,
          });
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred during media analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-grow">
        <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-medium text-gray-200 mb-4">
            Analyze Media
          </h2>
          <MediaUpload
            file={file}
            imageUrl={imageUrl}
            videoUrl={videoUrl}
            isDragging={isDragging}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
          <AnalysisToggles
            checkGenAi={checkGenAi}
            checkDeepfake={checkDeepfake}
            toggleGenAi={toggleGenAi}
            toggleDeepfake={toggleDeepfake}
          />
          <button
            onClick={analyzeMedia}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-gray-200 transition duration-300 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-950 hover:bg-blue-900 border border-blue-900"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Media"}
          </button>
          <ResultsDisplay
            genAiResult={genAiResult}
            deepfakeResults={deepfakeResults}
            genAiVideoResults={genAiVideoResults}
            deepfakeVideoResults={deepfakeVideoResults}
            overallGenAiConclusion={overallGenAiConclusion}
            overallDeepfakeConclusion={overallDeepfakeConclusion}
            error={error}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
