import { useState, useEffect } from "react";

export const convertTimeToSeconds = (timeString) => {
  if (timeString?.length < 3) {
    return timeString;
  } else {
    const [minutes, seconds] = timeString?.split(":").map(Number);
    return minutes * 60 + seconds;
  }
};
export const formatTime = (seconds) => {
  const minutes = Math.floor(parseInt(seconds) / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
