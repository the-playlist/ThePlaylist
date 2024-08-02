function ToggleButton(elementRef, isFullScreen, setIsFullScreen) {
  const element = elementRef.current;

  try {
    if (element) {
      if (!isFullScreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          // Firefox
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          // Chrome, Safari and Opera
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          // IE/Edge
          element.msRequestFullscreen();
        } else {
          throw new Error("Fullscreen API is not supported");
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          // Firefox
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          // Chrome, Safari and Opera
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          // IE/Edge
          document.msExitFullscreen();
        } else {
          throw new Error("Fullscreen API is not supported");
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to toggle fullscreen mode:",
      error.message
    );
    alert("Fullscreen mode is not supported on this device.");
  }
}

export default ToggleButton;
