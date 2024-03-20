import { useEffect, useState } from "react";

const threshold = 160;
const interval = 500;

const types = {
  vertical: "vertical",
  horizontal: "horizontal",
};

const useIsDevToolsOpen = () => {
  const [consoleOpen, setConsoleOpen] = useState(false);

  useEffect(() => {
    setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? types.vertical : types.horizontal;

      if (orientation === types.vertical || heightThreshold) {
        setConsoleOpen(true);
      } else {
        setConsoleOpen(false);
      }
    }, interval);
  }, []);

  return consoleOpen;
};

export default useIsDevToolsOpen;
