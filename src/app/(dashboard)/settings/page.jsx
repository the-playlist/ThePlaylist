"use client";
import React, { useState, Suspense } from "react";
import {
  ReportIcon,
  ChangePassIcon,
  ClearSongIcon,
  FavSongIcon,
} from "@/app/svgs";
import { ChangePassword, Reports } from "@/app/_components";

const SelectedItemContent =
  (WrappedComponent) =>
  ({ items }) => {
    const [selectedItemId, setSelectedItemId] = useState(3);

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
                    ? "border-[#EFC440] "
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
                    className={`h-10 w-10 flex lg:text-lg text-base justify-center items-center rounded-full ${
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
                <div className="text-start w-full my-3">
                  <span className="text-[#989b9e] lg:text-base text-sm">
                    {item.desc}
                  </span>
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
      desc: "Suc as manage master password change or update the password.",
      detail: <ChangePassword />,
    },
    {
      id: 1,
      icon: (color) => <ClearSongIcon color={color} />,
      title: "Clear Songs",
      desc: "Suc as clear all the songs that are listed in the playlist.",
      detail: "",
    },

    {
      id: 2,
      icon: (color) => <FavSongIcon color={color} />,
      title: "Favourite Songs",
      desc: "Suc as add all the songs marked favourite to the playlist. ",
      detail: "",
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
    <div className="min-h-screen   ">
      <SelectableItemContent items={settingArray} />
    </div>
  );
};

export default page;
