"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "@/app/svgs";
import { FaVideo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import {
  useAddUpdateVoteMutation,
  useLazyGetTableViewSongsQuery,
  useCreateStreamUserMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { CustomLoader } from "@/app/_components";
import { io } from "socket.io-client";
import { Listener_URL, authToken } from "../../_utils/common/constants";
import StreamRequest from "@/app/_components/live-video";
import { toast } from "react-toastify";

const TableView = () => {
  const [getPlaylistSongTableView] = useLazyGetTableViewSongsQuery();
  const [createStreamUserApi] = useCreateStreamUserMutation();
  const [meetingId, setMeetingId] = useState(null);
  const [streamPayload, setStreamPayload] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [fontSize, setFontSize] = useState("text-sm");
  const [performer, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState();
  function generateDeviceId() {
    // Concatenate various properties to generate a unique identifier
    const combinedId =
      navigator.userAgent +
      window.screen.width +
      window.screen.height +
      Math.floor(Math.random() * (100 - 1 + 1)) +
      1;

    // Hash the combined ID to generate a more anonymized and consistent identifier
    const hashedId = hash(combinedId);
    const ID = localStorage.getItem("UNIQUE_ID");
    if (!ID) {
      localStorage.setItem("UNIQUE_ID", hashedId);
      return hashedId;
    } else {
      return ID;
    }

    // You can send this hashed ID to your server for identification or store it locally
  }

  function hash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1076) {
        setFontSize("text-lg");
      } else {
        setFontSize("text-sm");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    socket.on("addSongToPlaylistApiResponse", (item) => {
      fetchPlaylistSongList();
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchPlaylistSongList();
  }, []);

  const fetchPlaylistSongList = async () => {
    try {
      const deviceId = generateDeviceId();
      let response = await getPlaylistSongTableView(deviceId);
      if (response && !response.isError) {
        setPerformers(response?.data?.content?.list);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const createMeeting = async ({ token }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const { roomId } = await res.json();
    return roomId;
  };

  const getMeetingAndToken = async (id) => {
    const deviceId = generateDeviceId();

    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    if (meetingId) {
      let response = await fetch(
        "http://localhost:3000/api/stream/sendStreamRequest",
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            streamId: meetingId,
            userId: deviceId,
            isTrue: null,
          }),
        }
      );
      if (response.ok) {
        toast("Your Request has been sent to Master");
      } else {
        toast("Error");
      }
      setShowModal(true);
    }

    setMeetingId(meetingId);
  };

  const ButtonsAtEnd = ({ onCamPress }) => {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-[#1F1F1F] flex justify-end p-4">
        <Link
          href={"/add-song"}
          className="flex text-base w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center"
        >
          <div className="rounded-full bg-[#1F1F1F] mr-2 p-1">
            <IoAdd size={16} color="white" />
          </div>
          Add a Song
        </Link>
        <button
          onClick={() => {
            creatStreamUserHandler();
          }}
          className="ml-4 w-full text-base flex items-center bg-[#1F1F1F]  border border-white   font-bold py-3 px-4 rounded-md justify-center text-white lg:hover:bg-gray-400"
        >
          <FaVideo size={16} className="mr-2" /> Live Video
        </button>
      </div>
    );
  };
  function generateRandomStreamId(length = 12) {
    // Define the character pool
    const characterPool =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Create an empty string to store the random ID
    let randomId = "";

    // Loop for the desired length of the ID
    for (let i = 0; i < length; i++) {
      // Get a random index from the character pool
      const randomIndex = Math.floor(Math.random() * characterPool.length);

      // Extract the character at the random index and append it to the ID
      randomId += characterPool[randomIndex];
    }

    // Return the generated random stream ID
    return randomId;
  }

  const creatStreamUserHandler = async () => {
    const deviceId = generateDeviceId();
    let response = await createStreamUserApi({
      user_id: deviceId,
      callId: generateRandomStreamId(),
    });
    if (response?.data?.success) {
      setStreamPayload(response?.data?.content);
    }
  };
  const ActionButtons = ({ index, item }) => {
    const [addUpdateVoteAPI] = useAddUpdateVoteMutation();
    const toggleButton = async (isTrue) => {
      const deviceId = generateDeviceId();
      let updatedPerformer = [...performer];
      let updatedItem = { ...updatedPerformer[index] };
      updatedItem.upVote = isTrue;
      updatedPerformer[index] = updatedItem;
      setPerformers(updatedPerformer);
      await addUpdateVoteAPI({
        customerId: deviceId,
        songId: item?.songId,
        playlistItemId: item?._id,
        playerId: item?.assignedPlayerId,
        isUpVote: isTrue,
      });
      socket.emit("votingRequest", {
        customerId: deviceId,
        songId: item?.songId,
        playlistItemId: item?._id,
        playerId: item?.assignedPlayerId,
        isUpVote: isTrue,
      });
    };

    return (
      <div className="flex mr-5">
        <button
          onClick={() => toggleButton(true)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.upVote == true ? "bg-green-500" : "bg-[#3A3B3E]"
          }`}
        >
          <IoIosArrowUp
            size={18}
            // color={`${item?.upVote == true ? "white" : "black"}`}
            color={"white"}
          />
        </button>
        <button
          onClick={() => toggleButton(false)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.upVote === false ? "bg-red-500" : "bg-[#3A3B3E]"
          } ml-2`}
        >
          <IoIosArrowDown
            size={18}
            // color={`${item?.upVote === false ? "white" : "black"}`}
            color={"white"}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto bg-[#1F1F1F] h-screen overflow-y-scroll mx-auto  px-5 pt-5">
      {loading ? (
        <CustomLoader bgColor={"bg-white"} />
      ) : (
        <>
          <div className=" flex items-center justify-center m-5">
            <Logo />
          </div>

          {streamPayload ? (
            <>
              <StreamRequest
                setStreamPayload={setStreamPayload}
                streamPayload={streamPayload}
              />
            </>
          ) : (
            <div className="mb-30">
              {performer.length === 0 && (
                <div className="flex items-center text-white justify-center flex-1 mt-20 font-semibold text-lg">
                  The playlist is empty.
                </div>
              )}
              {performer?.map((item, index) => {
                return (
                  <div
                    className={`flex  ${
                      index < 2 ? "bg-top-queue-bg" : ""
                    } rounded-md flex-wrap my-2`}
                  >
                    <div className="w-1/2  text-start flex items-center">
                      {index < 2 ? (
                        <p className="mx-5 font-extrabold text-lg  ">{`${
                          index < 2 ? index + 1 : ""
                        }`}</p>
                      ) : (
                        <ActionButtons key={index} index={index} item={item} />
                      )}
                      <p
                        className={`font-semibold capitalize ${
                          index < 2 ? "text-black" : "text-white"
                        }  ${fontSize}`}
                      >
                        {item?.title}
                      </p>
                    </div>
                    <div
                      className={`w-1/2 p-4 text-end capitalize ${
                        index < 2 ? "text-black" : "text-white"
                      } ${fontSize}`}
                    >
                      {item?.artist}
                    </div>
                  </div>
                );
              })}
              <ButtonsAtEnd />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableView;
