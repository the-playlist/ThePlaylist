"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const page = () => {
  const [socket, setSocket] = useState();
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3001", { autoConnect: false });

    socket.connect();

    socket.on("message", (message) => {
      console.log("Received message:", message);
    });

    setSocket(socket);
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);
  // Function to send a message
  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      socket.emit("message", {
        recipient: "alice",
        message: currentMessage,
      });
      // socket.emit("message", currentMessage);
      setCurrentMessage("");
    }
  };
  const settingArray = [
    {
      id: 0,
      icon: "",
      title: "Master Password",
      desc: "Suc as manage master password change or update the password.",
    },
    {
      id: 1,
      icon: "",
      title: "Clear Songs",
      desc: "Suc as clear all the songs that are listed in the playlist.",
    },

    {
      id: 2,
      icon: "",
      title: "Favourite Songs",
      desc: "Suc as add all the songs marked favourite to the playlist. ",
    },
    {
      id: 3,
      icon: "",
      title: "Reports",
      desc: "Such as songs top vots for tonight, this week, or this month.",
    },
  ];
  return (
    <div className="min-h-screen   ">
      <div className=" flex lg:flex-row mt-10 overflow-x-scroll">
        {settingArray.map((item) => {
          return (
            <div className="p-3 border border-[#F1F1F1] bg-white rounded-lg w-1/4 mr-4">
              <div className="flex justify-between w-full items-center ">
                <span className="text-black font-semibold ">{item?.title}</span>
                <span className="h-10 w-10 flex justify-center items-center rounded-full bg-[#989b9e]">
                  Icon
                </span>
              </div>
              <div className="flex justify-between w-full my-3">
                <span className="text-[#989b9e]">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
      <input
        className="border border-black"
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default page;
