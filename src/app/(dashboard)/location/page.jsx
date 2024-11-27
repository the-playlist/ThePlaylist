"use client";
import React, { useEffect, useState } from "react";
import { useLazyGetLocationListQuery } from "../../_utils/redux/slice/emptySplitApi";
import { CustomLoader } from "@/app/_components/custom_loader";
import { useSelector } from "react-redux";

const Location = () => {
  const [locationListApi, { isLoading }] = useLazyGetLocationListQuery();
  const [locationContent, setLocationContent] = useState([]);

  useEffect(() => {
    locationListApiHandler();
  }, []);

  const locationListApiHandler = async () => {
    const response = await locationListApi();
    if (response && !response.error) {
      const { content } = response?.data;
      setLocationContent(content || []);
    }
  };
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );

  return isLoading ? (
    <div className=" h-[80vh] flex items-center justify-center">
      <CustomLoader />
    </div>
  ) : (
    <div className=" flex flex-col gap-2">
      <div>Locations List</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {locationContent?.map((item, index) => (
          <div
            key={index}
            className={`${masterViewTheme ? " bg-white text-black" : "bg-light-tile text-white"}  drop-shadow rounded-lg p-4 flex flex-col gap-4 items-center `}
          >
            <div className=" py-2 px-5 bg-primary w-full text-center rounded-md font-semibold text-2xl">
              {item?.symbol || ""}
            </div>
            <div className=" text-lg">{item?.standsFor || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Location;
