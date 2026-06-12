"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Home, ChevronRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isChunkError, setIsChunkError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const errorMsg = error?.message || "";
    const errorName = error?.name || "";
    const isChunk =
      errorName === "ChunkLoadError" ||
      errorMsg.includes("ChunkLoadError") ||
      errorMsg.includes("Loading chunk") ||
      errorMsg.includes("Failed to load chunk");

    if (isChunk) {
      setIsChunkError(true);
      
      // Attempt auto-reload once to recover from stale/missing chunks
      const lastReload = sessionStorage.getItem("last-chunk-reload");
      const now = Date.now();
      
      // Prevent infinite reload loop by checking if last reload was > 10 seconds ago
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem("last-chunk-reload", String(now));
        window.location.reload();
      }
    }
    console.error("Translingua App Error caught by boundary:", error);
  }, [error]);

  const handleManualReload = () => {
    sessionStorage.setItem("last-chunk-reload", String(Date.now()));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#EDE9E1] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-gray-300/60 border border-gray-100/50 flex flex-col items-center text-center animate-fade-in">
        {/* Animated Icon Container */}
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 relative group border border-red-100">
          <div className="absolute inset-0 bg-red-100/50 rounded-3xl scale-110 blur-sm opacity-50 group-hover:scale-125 transition-transform duration-300" />
          <AlertCircle className="w-10 h-10 text-red-500 relative z-10 animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {isChunkError ? "App Update Available" : "Something Went Wrong"}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md leading-relaxed">
          {isChunkError
            ? "A new version of Translingua has been deployed. Please refresh the page to load the latest features and improvements."
            : "An unexpected error occurred. Don't worry, your progress is safe. You can try resetting this page or navigating back to safety."}
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={isChunkError ? handleManualReload : reset}
            className="flex-1 bg-[#3D8F8F] hover:bg-[#06555A] text-white font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-[#6FB3B8]/30 cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw className="w-5 h-5" />
            {isChunkError ? "Reload Page" : "Try Again"}
          </button>

          <Link
            href="/dashboard"
            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Home className="w-5 h-5 text-gray-500" />
            Go to Dashboard
          </Link>
        </div>

        {/* Technical Details Accordion */}
        <div className="w-full border-t border-gray-100 pt-6 text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Technical Error Details
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                showDetails ? "rotate-90 text-gray-600" : ""
              }`}
            />
          </button>

          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl max-h-40 overflow-y-auto custom-scrollbar">
              <p className="text-[11px] font-mono text-gray-500 leading-normal break-all whitespace-pre-wrap">
                <strong>Error Name:</strong> {error?.name || "Unknown Error"}
                {"\n"}
                <strong>Message:</strong> {error?.message || "No error message provided."}
                {"\n"}
                <strong>Digest:</strong> {error?.digest || "N/A"}
                {error?.stack && (
                  <>
                    {"\n\n"}
                    <strong>Stack Trace:</strong>
                    {"\n"}
                    {error.stack}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
