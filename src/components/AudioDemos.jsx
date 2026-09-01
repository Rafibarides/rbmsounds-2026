import { useEffect, useRef, useState } from "react";

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.4v11.2L13.6 8 4 2.4Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.2 2.4h3.2v11.2H3.2zM9.6 2.4h3.2v11.2H9.6z" />
    </svg>
  );
}

export default function AudioDemos({ demos }) {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onTime = () => {
      if (!audio.duration) return;
      setProgress(audio.currentTime / audio.duration);
    };
    const onEnd = () => {
      setCurrent(null);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle(index) {
    const audio = audioRef.current;
    if (!audio) return;
    if (current === index && !audio.paused) {
      audio.pause();
      setCurrent(null);
      return;
    }
    audio.src = demos[index].src;
    audio.play();
    setCurrent(index);
    setProgress(0);
  }

  return (
    <div className="audio-list">
      <audio ref={audioRef} preload="none" />
      {demos.map((demo, index) => (
        <div className="audio-row" key={demo.src}>
          <button
            className="play"
            type="button"
            onClick={() => toggle(index)}
            aria-label={current === index ? `Pause ${demo.title}` : `Play ${demo.title}`}
          >
            {current === index ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div>
            <div className="track-title">{demo.title}</div>
            <div className="track-bar">
              <span style={{ width: `${current === index ? progress * 100 : 0}%` }} />
            </div>
          </div>
          <span className="meta">WAV</span>
        </div>
      ))}
    </div>
  );
}
