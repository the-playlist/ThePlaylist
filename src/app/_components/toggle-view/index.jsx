import React from "react";

function ToggleButton(elementRef, isFullScreen, setIsFullScreen) {
  const element = elementRef.current;

  if (element) {
    if (!isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  }
}

export default ToggleButton;
