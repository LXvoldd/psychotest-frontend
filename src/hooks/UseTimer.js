import { useState, useEffect } from "react";

export default function useTimer(durationMinutes, startedAt) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!startedAt) return;

    const startedTime = new Date(startedAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - startedTime) / 1000);
    const remaining = Math.max(0, durationMinutes * 60 - elapsedSeconds);
    
    setTimeLeft(remaining);
    
    if (remaining <= 0) {
      setIsExpired(true);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationMinutes, startedAt]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return { timeLeft, isExpired, formatTime };
}