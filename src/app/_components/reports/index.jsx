import React from "react";
import { BadgeOne, BadgeTwo } from "@/app/svgs";

const Reports = () => {
  const viewByOption = [
    {
      key: 0,
      value: "Today",
    },
    {
      key: 1,
      value: "This Week",
    },
    {
      key: 2,
      value: "This month",
    },
  ];
  return (
    <div className="bg-[#fbfbfb]  shadow-lg rounded-lg my-10 p-5">
      <div className="flex justify-between items-center">
        <div className="text-black font-semibold text-lg">Most voted songs</div>
        <div className="text-black font-semibold text-lg">
          <select
            onChange={(e) => {
              console.log(e);
            }}
            className="select select-bordered w-full max-w-xs"
          >
            {viewByOption?.map((item) => {
              return <option value={item?.key}>{`${item.value}`}</option>;
            })}
          </select>
        </div>
      </div>
      <div>
        <div className="text-base font-medium text-black flex text-center my-5  px-5 ">
          <div className="w-1/12"></div>
          <div className="w-2/12 ">Title</div>
          <div className="w-3/12">Player</div>
          <div className="w-6/12"></div>
        </div>
        <div className="overflow-y-auto h-[530px]  pb-20">
          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
            <div
              className={` text-center bg-white shadow-sm  rounded-2xl h-16 flex items-center mb-4 px-5`}
            >
              <div className="w-1/12 text-start">
                {index == 0 ? (
                  <BadgeOne />
                ) : index == 1 ? (
                  <BadgeTwo />
                ) : (
                  <div className=" font-semibold ml-3">{index + 1}</div>
                )}
              </div>
              <div className="w-2/12 ">Hey Jude</div>
              <div className="w-3/12">Aretha Franklin</div>
              <div className="w-6/12 text-end ">274</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
