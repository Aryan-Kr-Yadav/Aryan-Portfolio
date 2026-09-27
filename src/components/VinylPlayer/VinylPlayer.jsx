import { useCallback, useEffect, useRef, useState } from 'react';
import './VinylPlayer.css';

const TRACK = {
  title: 'Rao Sahab Retro',
  src: '/music/rao-sahab-retro.mp3',
  collection: "ARYAN'S RECORDS · VOL. 01",
};

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function VinylPlayer() {
  const audioRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleLoadedMetadata = () => {
      const nextDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
      setDuration(nextDuration);
      if (!Number.isFinite(audio.currentTime) || audio.currentTime <= 0) {
        setCurrentTime(0);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setAudioError('');
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
      setAudioError('');
    } catch (error) {
      setIsPlaying(false);
      setAudioError('Audio unavailable');
    }
  }, []);

  const handleVinylClick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasStarted) {
      setHasStarted(true);
      setIsCardOpen(true);
      startPlayback();
      return;
    }

    setIsCardOpen((prev) => !prev);
  }, [hasStarted, startPlayback]);

  const handleCardToggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setAudioError('');
    } catch (error) {
      setIsPlaying(false);
      setAudioError('Audio unavailable');
    }
  }, [isPlaying]);

  const handleSeek = useCallback((event) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(event.target.value);
    if (!Number.isFinite(nextTime)) return;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const progressPercent = safeDuration > 0 ? (Math.min(Math.max(currentTime, 0), safeDuration) / safeDuration) * 100 : 0;

  return (
    <div className="vinyl-player" aria-live="polite">
      <div className={`vinyl-card ${isCardOpen ? 'open' : ''}`} aria-hidden={!isCardOpen}>
        <div className="vinyl-card__inner">
          <p className="vinyl-card__eyebrow">NOW SPINNING</p>
          <h3 className="vinyl-card__title">{TRACK.title}</h3>
          <p className="vinyl-card__meta">{TRACK.collection}</p>

          <div className="vinyl-card__progress-row">
            <span className="vinyl-card__time">{formatTime(currentTime)}</span>

            <div className="vinyl-card__track-wrap">
              <input
                type="range"
                min="0"
                max={safeDuration || 0}
                step="0.1"
                value={Math.min(currentTime, safeDuration || 0)}
                onChange={handleSeek}
                aria-label="Seek within Rao Sahab Retro"
                className="vinyl-card__range"
              />
              <span className="vinyl-card__track-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <span className="vinyl-card__time">{formatTime(safeDuration)}</span>
          </div>

          <button
            type="button"
            className="vinyl-card__toggle"
            onClick={(event) => {
              event.stopPropagation();
              handleCardToggle();
            }}
            aria-label={isPlaying ? 'Pause Rao Sahab Retro' : 'Resume Rao Sahab Retro'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          {audioError && <p className="vinyl-card__error">Audio unavailable</p>}
        </div>
      </div>

      <button
        type="button"
        className="vinyl-button"
        onClick={handleVinylClick}
        aria-label={
          !hasStarted
            ? 'Play Rao Sahab Retro'
            : isCardOpen
              ? 'Close song information'
              : 'Open song information'
        }
      >
        <div className={`vinyl-record ${isPlaying ? 'playing' : ''}`}>
          <span className="vinyl-record__shine" aria-hidden="true" />
          <span className="vinyl-record__label" aria-hidden="true" />
          <span className="vinyl-record__hole" aria-hidden="true" />
        </div>
      </button>

      <audio ref={audioRef} src={TRACK.src} preload="metadata" />
    </div>
  );
}
