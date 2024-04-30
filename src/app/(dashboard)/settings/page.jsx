"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  ReportIcon,
  ChangePassIcon,
  ClearSongIcon,
  FavSongIcon,
} from "@/app/svgs";

const SelectedItemContent =
  (WrappedComponent) =>
  ({ items }) => {
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleItemClick = (itemId) => {
      setSelectedItemId(itemId);
    };

    const selectedItem = items?.find((item) => item.id === selectedItemId);

    return (
      <div>
        <div className=" flex lg:flex-row mt-10 overflow-x-scroll">
          {items?.map((item) => {
            return (
              <button
                onClick={() => {
                  handleItemClick(item?.id);
                }}
                className={`p-3 border hover:cursor-pointer ${
                  selectedItem?.id == item.id
                    ? "border-[#EFC440]"
                    : " border-[#F1F1F1]"
                } bg-white rounded-lg w-1/4 mr-4`}
              >
                <div className="flex justify-between w-full items-center ">
                  <span
                    className={`${
                      selectedItem?.id == item.id
                        ? "text-[#EFC440]"
                        : "text-black"
                    } font-semibold `}
                  >
                    {item?.title}
                  </span>
                  <span
                    className={`h-10 w-10 flex justify-center items-center rounded-full ${
                      selectedItem?.id == item.id
                        ? "bg-[#FDF9EC]"
                        : "bg-[#f2f2f2]"
                    } text-black`}
                  >
                    {item.icon(
                      selectedItem?.id == item.id ? "#EFC440" : "black"
                    )}
                  </span>
                </div>
                <div className="flex justify-between w-full my-3">
                  <span className="text-[#989b9e]">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
        {selectedItem && <WrappedComponent item={selectedItem} />}
      </div>
    );
  };

const ItemContent = ({ item }) => {
  return (
    <div>
      <div>{item.title}</div>
      <div>{item.desc}</div>
    </div>
  );
};

const SelectableItemContent = SelectedItemContent(ItemContent);

const page = () => {
  const [socket, setSocket] = useState();
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState();

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
      icon: (color) => <ChangePassIcon color={color} />,
      title: "Master Password",
      desc: "Suc as manage master password change or update the password.",
    },
    {
      id: 1,
      icon: (color) => <ClearSongIcon color={color} />,
      title: "Clear Songs",
      desc: "Suc as clear all the songs that are listed in the playlist.",
    },

    {
      id: 2,
      icon: (color) => <FavSongIcon color={color} />,
      title: "Favourite Songs",
      desc: "Suc as add all the songs marked favourite to the playlist. ",
    },
    {
      id: 3,
      icon: (color) => <ReportIcon color={color} />,
      title: "Reports",
      desc: "Such as songs top vots for tonight, this week, or this month.",
    },
  ];
  return (
    <div className="min-h-screen   ">
      <SelectableItemContent items={settingArray} />
      {/* <input
        className="border border-black"
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button> */}
    </div>
  );
};

export default page;
