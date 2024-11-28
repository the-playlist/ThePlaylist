"use client";
import React, { useState, Suspense } from "react";
import {
  ReportIcon,
  ChangePassIcon,
  FavSongIcon,
  AppearenceIcon,
} from "@/app/svgs";
import {
  ChangePassword,
  Reports,
  LimitAndAppearence,
  FavSongList,
} from "@/app/_components";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { useSelector } from "react-redux";

const SelectedItemContent =
  (WrappedComponent) =>
  ({ items }) => {
    const [selectedItemId, setSelectedItemId] = useState(2);
    const handleItemClick = (itemId) => {
      setSelectedItemId(itemId);
    };
    const selectedItem = items?.find((item) => item.id === selectedItemId);
    const masterViewTheme = useSelector(
      (state) => state?.playlistReducer?.masterViewTheme
    );
    return (
      <div className="container mx-auto flex flex-col   ">
        <div className="flex-grow-0 overflow-x-scroll ">
          <div className="flex lg:flex-row space-x-4 p-3">
            {items?.map((item) => (
              <button
                key={item?.id}
                onClick={() => handleItemClick(item?.id)}
                className={`p-3 border hover:cursor-pointer ${
                  selectedItem?.id == item.id
                    ? "border-[#EFC440]"
                    : "border-[#F1F1F1]"
                } ${masterViewTheme ? "bg-white text-black" : "bg-light-tile text-white"} rounded-lg w-1/4`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      selectedItem?.id == item.id
                        ? "text-[#EFC440]"
                        : `${masterViewTheme ? "text-black" : "text-white"} `
                    } font-semibold`}
                  >
                    {item?.title}
                  </span>
                  <span
                    className={`h-10 w-10 flex lg:text-lg text-base justify-center items-center rounded-full ${
                      selectedItem?.id == item.id
                        ? "bg-[#FDF9EC]"
                        : "bg-[#f2f2f2]"
                    } text-black `}
                  >
                    {item.icon(
                      selectedItem?.id == item.id ? "#EFC440" : "black"
                    )}
                  </span>
                </div>
                <div className="text-start w-full my-3">
                  <span className="text-[#989b9e] lg:text-base text-sm">
                    {item.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-3 max-h-[calc(100vh-300px)]">
          {selectedItem && <WrappedComponent item={selectedItem} />}
        </div>
      </div>
    );
  };

const ItemContent = ({ item }) => {
  return (
    <div>
      <div>{item.detail}</div>
    </div>
  );
};

const SelectableItemContent = SelectedItemContent(ItemContent);

const page = () => {
  const settingArray = [
    {
      id: 0,
      icon: (color) => <ChangePassIcon color={color} />,
      title: "Master Password",
      desc: "Such as manage master password change or update the password.",
      detail: <ChangePassword />,
    },
    {
      id: 1,
      icon: (color) => <FavSongIcon color={color} />,
      title: "Favorite Songs",
      desc: "Such as add all the songs marked favorite to the playlist.",
      detail: <FavSongList />,
    },
    {
      id: 2,
      icon: (color) => <AppearenceIcon color={color} />,
      title: "Customer Limits & Appearance",
      desc: "Such as change the customer limits and theme light to dark mode.",
      detail: <LimitAndAppearence />,
    },

    {
      id: 3,
      icon: (color) => <ReportIcon color={color} />,
      title: "Reports",
      desc: "Such as songs top vots for tonight, this week, or this month.",
      detail: <Reports />,
    },
  ];
  return (
    <SessionProvider>
      <NextUIProvider>
        <div className="  overflow-y-auto  ">
          <SelectableItemContent items={settingArray} />
        </div>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default page;
