import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialMinutes = 20) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((minutes = initialMinutes) => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(minutes * 60);
  }, [initialMinutes]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  return {
    timeLeft,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    formatTime,
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60
  };
}

export default useTimer;
