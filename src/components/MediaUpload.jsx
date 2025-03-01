import React from "react";

const MediaUpload = ({
  file,
  imageUrl,
  videoUrl,
  isDragging,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
}) => {
  return (
    <div
      className={`mb-6 border-2 border-violet-800 rounded-lg p-6 text-center transition-all ${
        isDragging
          ? "border-violet-500 bg-violet-900/30"
          : "border-violet-800 bg-gray-900"
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {!file ? (
        <>
          <p className="text-gray-300 mb-2">
            Drop an image or video here or click to upload
          </p>
          <label className="cursor-pointer">
            <span className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
              Select File
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </>
      ) : (
        <>
          {file.type.startsWith("image/") && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-4 max-w-xs mx-auto rounded-lg border border-gray-800"
            />
          )}
          {file.type.startsWith("video/") && (
            <video
              controls
              src={videoUrl}
              className="mt-4 max-w-xs mx-auto rounded-lg border border-gray-800"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MediaUpload;
