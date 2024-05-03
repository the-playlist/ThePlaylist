import React from "react";
import { FaUser } from "react-icons/fa";

const SongIcon = ({ count, isUser, onClick }) => {
  return (
    <div className="w-15 h-15">
      <div
        onClick={onClick}
        className="bg-primary w-10 h-10  rounded-full flex relative items-center justify-center cursor-pointer"
      >
        <span className="bg-white absolute -top-1 -right-1  text-xs rounded-full p-0.5 shadow-lg ">
          {count}
        </span>
        {isUser ? (
          <FaUser className="text-white cursor-pointer" />
        ) : (
          <div className="cursor-pointer">
            <svg
              width="11"
              height="18"
              viewBox="0 0 11 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2498 10.4108C10.2498 10.4108 10.2032 10.5269 9.59041 12.0108C9.56808 12.0646 9.53448 12.1138 9.49154 12.1556C9.44859 12.1974 9.39715 12.231 9.34013 12.2545C9.28312 12.2779 9.22166 12.2908 9.15926 12.2923C9.09686 12.2939 9.03474 12.2841 8.97645 12.2634C8.91816 12.2428 8.86484 12.2118 8.81954 12.1722C8.77423 12.1325 8.73783 12.0851 8.71241 12.0324C8.68698 11.9798 8.67304 11.9231 8.67137 11.8655C8.6697 11.8079 8.68034 11.7506 8.70267 11.6968C9.31081 10.228 9.3644 10.0946 9.3644 10.0946C9.94691 8.69893 11.3076 5.43441 7.34892 2.99785C7.09366 2.84484 6.85901 2.66436 6.64991 2.46022V14.9333C6.62585 15.7393 6.26838 16.5061 5.6509 17.0764C5.03343 17.6468 4.20281 17.9772 3.32962 18C2.44655 18 1.59965 17.6762 0.975222 17.0999C0.350798 16.5236 0 15.7419 0 14.9269C0 14.1118 0.350798 13.3302 0.975222 12.7539C1.59965 12.1775 2.44655 11.8538 3.32962 11.8538H5.70625V0H6.66389V0.430108C6.69788 0.801588 6.82557 1.16057 7.03677 1.47836C7.24796 1.79614 7.5368 2.06389 7.88017 2.26022C12.468 5.09462 10.7974 9.09678 10.2498 10.4108Z"
                fill="white"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongIcon;
