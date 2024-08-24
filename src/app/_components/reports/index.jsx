"use client";
import React, { useEffect, useState } from "react";
import { BadgeOne, BadgeTwo } from "@/app/svgs";
import { useLazyGetSongsReportListQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const Reports = () => {
  const viewByOption = [
    {
      key: 2,
      value: "This month",
    },
    {
      key: 1,
      value: "This Week",
    },
    {
      key: 0,
      value: "Today",
    },
  ];

  const [reportsList, setReportsList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [reportsSongsApi, reportsSongsApiResponse] =
    useLazyGetSongsReportListQuery();

  useEffect(() => {
    fetchReportList();
  }, [selectedFilter]);

  const fetchReportList = async () => {
    let response = await reportsSongsApi(selectedFilter);

    if (response && !response.isError) {
      setReportsList(response?.data?.content);
    }
  };

  return (
    <div className="bg-[#fbfbfb]  shadow  rounded-lg my-5  px-5">
      <div className="flex justify-between items-center">
        <div className="text-black font-semibold text-lg">Most voted songs</div>
        <div className="text-black font-semibold text-lg">
          <select
            onChange={(e) => {
              setSelectedFilter(e.target.value);
            }}
            className="select select-bordered w-full max-w-xs"
          >
            {viewByOption?.map((item) => {
              return <option value={item?.key}>{`${item.value}`}</option>;
            })}
          </select>
        </div>
      </div>
      {reportsList?.length > 0 ? (
        <div>
          <div className="text-base font-medium text-black flex text-center my-5  px-5 ">
            <div className="w-1/12"></div>
            <div className="w-2/12 ">Title</div>
            <div className="w-3/12">Artist</div>
            <div className="w-3/12">Category</div>
            <div className="w-3/12">Votes</div>
          </div>
          {reportsSongsApiResponse?.isFetching ? (
            <div className="flex items-center justify-center h-[560px]">
              <span className="loading loading-bars loading-xs"></span>
              <span className="loading loading-bars loading-sm"></span>
              <span className="loading loading-bars loading-md"></span>
              <span className="loading loading-bars loading-lg"></span>
            </div>
          ) : (
            <div className="overflow-y-auto h-[560px]   pb-20 px-1">
              {reportsList.map((item, index) => (
                <div
                  className={` text-center bg-white drop-shadow rounded-2xl h-16 flex items-center mb-4 px-5`}
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
                  <div className="w-2/12 ">{item?.title}</div>
                  <div className="w-3/12">{item?.artist}</div>
                  <div className="w-3/12">
                    <div className=" flex items-center justify-center">
                      <div className={`bg-[#F7F7F7] rounded-3xl px-5 py-2`}>
                        {item?.category}
                      </div>
                    </div>
                  </div>
                  <div className="w-3/12  ">
                    <div className="flex items-center justify-center">
                      <div className="bg-[#f2f8ef] px-7 mr-2 py-2 flex items-center rounded-3xl">
                        <div className="flex items-center justify-center bg-[#479815] rounded-full shadow w-6 h-6 mr-2">
                          <IoIosArrowUp size={18} color={"white"} />
                        </div>
                        {item?.upVoteCount}
                      </div>
                      <div className="bg-[#fbeceb] px-7 py-2 flex items-center rounded-3xl">
                        <div className="flex items-center justify-center bg-[#D70000] rounded-full shadow w-6 h-6 mr-2">
                          <IoIosArrowDown size={18} color={"white"} />
                        </div>
                        {item?.downVoteCount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]  text-black font-semibold text-lg">
          No Reports found
        </div>
      )}
    </div>
  );
};

export default Reports;
