// "use client";
// import { useEffect } from "react";

// export const useSocketListeners = (socket, callback) => {
//   useEffect(() => {
//     if (!socket) return;

//     const handleEvent = (event, data) => {
//       console.log(`Socket event: ${event}`, data);
//       callback(event, data); // Call the callback function with event name and data
//     };

//     socket.on("disconnect", (reason) => handleEvent("disconnect", reason));
//     socket.on("connect_error", (error) => handleEvent("connect_error", error));
//     socket.on("reconnect_error", (error) =>
//       handleEvent("reconnect_error", error)
//     );
//     socket.on("reconnect_attempt", (attempt) =>
//       handleEvent("reconnect_attempt", attempt)
//     );
//     socket.on("connect_timeout", () => handleEvent("connect_timeout"));

//     // Cleanup listeners on component unmount
//     return () => {
//       socket.off("disconnect", handleEvent);
//       socket.off("connect_error", handleEvent);
//       socket.off("reconnect_error", handleEvent);
//       socket.off("reconnect_attempt", handleEvent);
//       socket.off("connect_timeout", handleEvent);
//     };
//   }, [socket, callback]);
// };
