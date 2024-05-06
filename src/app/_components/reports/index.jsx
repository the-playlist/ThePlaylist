"use client";
import React, { useEffect, useState } from "react";
import { BadgeOne, BadgeTwo } from "@/app/svgs";
import { useLazyGetSongsReportListQuery } from "@/app/_utils/redux/slice/emptySplitApi";

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
  const [reportsList, setReportsList] = useState([]);
  useEffect(() => {
    fetchReportList();
  }, []);

  const [reportsSongsApi, reportsSongsApiResponse] =
    useLazyGetSongsReportListQuery();

  const fetchReportList = async () => {
    let response = await reportsSongsApi();
    if (response && !response.isError) {
      setReportsList(response?.data?.content);
    }
  };
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
          <div className="w-3/12">Artist</div>
          <div className="w-3/12">Up Vote</div>
          <div className="w-3/12">Down Vote</div>
        </div>
        {reportsSongsApiResponse?.isFetching ? (
          <div className="flex items-center justify-center h-[555px]">
            <span className="loading loading-bars loading-xs"></span>
            <span className="loading loading-bars loading-sm"></span>
            <span className="loading loading-bars loading-md"></span>
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-y-auto h-[555px]  pb-20 px-1">
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
                <div className="w-3/12  ">{item?.upVoteCount}</div>
                <div className="w-3/12 ">{item?.downVoteCount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
