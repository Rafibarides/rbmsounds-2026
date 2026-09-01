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

export default function SamplePreviews({ samples }) {
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
      setProgress(0);
      return;
    }
    audio.src = samples[index].src;
    audio.play();
    setCurrent(index);
    setProgress(0);
  }

  return (
    <div className="samples-card">
      <audio ref={audioRef} preload="none" />
      {samples.map((sample, index) => (
        <div
          className={`sample-row${current === index ? " playing" : ""}`}
          key={sample.src}
        >
          <span
            className="sample-progress"
            style={{ width: `${current === index ? progress * 100 : 0}%` }}
          />
          <button
            className="play"
            type="button"
            onClick={() => toggle(index)}
            aria-label={
              current === index ? `Pause ${sample.title}` : `Play ${sample.title}`
            }
          >
            {current === index ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="sample-id">
            <span className="sample-title">{sample.title}</span>
            <span className="sample-pack">{sample.pack}</span>
          </div>
          <div className="sample-tags">
            <span className="sample-chip">{sample.type}</span>
            <span className="sample-meta">{sample.info}</span>
            <span className="sample-meta">{sample.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
