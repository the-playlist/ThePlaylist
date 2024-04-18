"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "@/app/svgs";
import { FaVideo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown, IoIosCloseCircle } from "react-icons/io";
import Webcam from "react-webcam";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import Link from "next/link";

const TableView = () => {
  const [showCam, setShowCam] = useState(false);
  const [fontSize, setFontSize] = useState("text-lg");
  const [performer, setPerformers] = useState([
    { id: 0, songName: "Imagine", artistName: "John Lennon", isVote: null },
    { id: 1, songName: "Born to run", artistName: "Savannah R.", isVote: null },
    { id: 2, songName: "Hey Jude", artistName: "Shawn T.", isVote: null },
    { id: 3, songName: "Respect", artistName: "Alice K.", isVote: null },
    { id: 4, songName: "Hey Ya!", artistName: "Tom M.", isVote: null },
    {
      id: 5,
      songName: "Dancing Queen",
      artistName: "Eric Clapton",
      isVote: null,
    },
    { id: 6, songName: "Waterfalls", artistName: "Madonna", isVote: null },
    { id: 7, songName: "Pretty Woman", artistName: "Bruno Mars", isVote: null },
    {
      id: 8,
      songName: "Superstition",
      artistName: "Stevie Wonder",
      isVote: null,
    },
    { id: 9, songName: "Billie Jean", artistName: "Outkast", isVote: null },
  ]);

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

  const ButtonsAtEnd = ({ onCamPress }: any) => {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white flex justify-end p-4">
        <Link
          href={"/add-song"}
          className="flex w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-white font-bold py-5 px-4 rounded-md justify-center"
        >
          <div className="rounded-full bg-add-bg mr-2 p-1">
            <IoAdd size={18} />
          </div>
          Add a Song
        </Link>
        <button
          onClick={onCamPress}
          className="ml-4 w-full flex items-center bg-white border border-black  text-black font-bold py-5 px-4 rounded-md justify-center hover:bg-active-tab"
        >
          <FaVideo size={20} className="mr-2" /> Live Video
        </button>
      </div>
    );
  };

  const ActionButtons = ({ index, item }: any) => {
    const toggleButton = (isTrue: boolean) => {
      setPerformers((prevPerformer: any) => {
        const updatedPerformer = [...prevPerformer];
        updatedPerformer[index].isVote = isTrue;
        return updatedPerformer;
      });
    };

    return (
      <div className="flex mr-5">
        <button
          onClick={() => toggleButton(true)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.isVote == true ? "bg-green-500" : "bg-white"
          }`}
        >
          <IoIosArrowUp
            size={18}
            color={`${item?.isVote == true ? "white" : "black"}`}
          />
        </button>
        <button
          onClick={() => toggleButton(false)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.isVote == false ? "bg-red-500" : "bg-white"
          } ml-2`}
        >
          <IoIosArrowDown
            size={18}
            color={`${item?.isVote == false ? "white" : "black"}`}
          />
        </button>
      </div>
    );
  };
  return (
    <div className="overflow-x-auto bg-white h-screen overflow-y-scroll mx-auto  px-5 pt-5">
      <div className=" flex items-center justify-center m-5">
        <Logo />
      </div>
      {showCam ? (
        <>
          <button
            className="flex items-center justify-center"
            onClick={() => {
              setShowCam(false);
            }}
          >
            <IoIosCloseCircle size={30} /> Close
          </button>
          <Webcam />
        </>
      ) : (
        <div className="mb-30">
          {performer?.map((item, index) => {
            return (
              <div
                className={`flex  ${
                  index < 2 ? "bg-top-queue-bg" : ""
                } rounded-md flex-wrap my-2`}
              >
                <div className="w-1/2  text-start flex items-center">
                  {index < 2 ? (
                    <p className="mx-5 font-extrabold text-xl  ">{`${
                      index < 2 ? index + 1 : ""
                    }`}</p>
                  ) : (
                    <ActionButtons key={index} index={index} item={item} />
                  )}
                  <p className={`font-semibold text-lg ${fontSize}`}>
                    {item?.songName}
                  </p>
                </div>
                <div className={`w-1/2 p-4 text-end ${fontSize}`}>
                  {item?.artistName}
                </div>
              </div>
            );
          })}
          <ButtonsAtEnd
            onCamPress={() => {
              setShowCam(true);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TableView;
