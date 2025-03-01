import React from "react";

const LearnMore = () => {
  return (
    <section className="bg-grid-violet-900/[0.1] bg-black py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-bold text-violet-300 mb-8 text-center">
          Learn More About AI Buster
        </h2>
        <div className="space-y-12">
          {/* Purpose Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium text-blue-300 mb-4">
                Unveiling the Truth
              </h3>
              <p className="text-gray-300">
                AI Buster is your tool to detect AI-generated content and
                deepfakes in images and videos. Powered by cutting-edge
                technology, we help you distinguish real media from synthetic
                creations with precision and ease.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <p className="text-gray-400 italic text-center">
                  "In an era of misinformation, AI Buster stands as your shield
                  against deception."
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium text-violet-300 mb-4">
                Key Features
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">•</span> Analyze images
                  for AI-generated content.
                </li>
                <li className="flex items-center">
                  <span className="text-violet-400 mr-2">•</span> Detect
                  deepfakes in videos with frame-by-frame precision.
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">•</span> Fast, reliable
                  results powered by advanced AI models.
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
                <p className="text-gray-400">
                  Built with state-of-the-art technology to keep you one step
                  ahead.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-blue-950 text-gray-200 font-medium py-3 px-6 rounded-lg border border-blue-900 hover:bg-blue-900 transition duration-300"
          >
            Back to Top
          </button>
        </div>
      </div>
    </section>
  );
};

export default LearnMore;
