import { useEffect, useState } from "react";

const audio = typeof Audio !== "undefined" ? new Audio() : null;
let currentSrc = null;
const subscribers = new Set();

function broadcast() {
  subscribers.forEach((fn) => fn(currentSrc));
}

if (audio) {
  audio.preload = "none";
  audio.addEventListener("ended", () => {
    currentSrc = null;
    broadcast();
  });
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4.6 2.6v10.8L13.8 8 4.6 2.6Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.6h3v10.8h-3zM9.4 2.6h3v10.8h-3z" />
    </svg>
  );
}

export default function PreviewButton({ src, label, className = "preview-btn" }) {
  const [playing, setPlaying] = useState(currentSrc === src);

  useEffect(() => {
    const fn = (cur) => setPlaying(cur === src);
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }, [src]);

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!audio) return;
    if (currentSrc === src && !audio.paused) {
      audio.pause();
      currentSrc = null;
      broadcast();
      return;
    }
    audio.src = src;
    audio.play();
    currentSrc = src;
    broadcast();
  }

  return (
    <button
      type="button"
      className={`${className}${playing ? " playing" : ""}`}
      onClick={onClick}
      aria-label={playing ? `Pause ${label}` : `Play ${label} preview`}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
  );
}
