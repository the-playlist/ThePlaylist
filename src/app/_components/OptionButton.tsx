"use client";
import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const OptionButton = ({ item, index }: any) => {
  const [showOptions, setShowOptions] = useState(null);
  return (
    <>
      <div className="relative">
        <button
          onBlur={() => {
            setShowOptions(null);
          }}
          onClick={() => {
            setShowOptions(showOptions == index ? null : index);
          }}
          className=" w-10 h-10  rounded-full bg-option"
        >
          <p>...</p>
        </button>
        {showOptions == index && (
          <div className="absolute z-10 right-12  bg-white  mt-2 py-2 w-40 rounded-md shadow-xl">
            <ul className="menu   rounded-box">
              <li>
                <a>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.278726 12.3837C0.56439 14.0013 2.0002 15.4365 3.61782 15.7227H3.62407C4.7392 15.9078 5.91937 15.999 7.23263 16.0003C8.54652 16.0015 9.72411 15.9078 10.8393 15.7227H10.8455C12.4631 15.4365 13.8996 14.0013 14.1846 12.3837H14.1852V12.3774C14.3703 11.2623 14.4615 10.0827 14.4628 8.76948C14.4628 8.0094 14.4315 7.27744 14.369 6.5942C14.339 6.26728 14.0502 6.02663 13.724 6.05664C13.397 6.08601 13.1564 6.3748 13.1858 6.7017C13.2445 7.34928 13.2751 8.04559 13.2758 8.76945C13.2758 10.0146 13.1895 11.1304 13.0145 12.1798C12.9176 12.7229 12.6194 13.2674 12.1744 13.7112C11.7294 14.155 11.1843 14.455 10.6417 14.5519C9.59224 14.7256 8.47653 14.8119 7.23256 14.8132C5.98867 14.8144 4.87165 14.7263 3.82226 14.5519C3.27845 14.455 2.73463 14.1568 2.29084 13.7112C1.84704 13.2655 1.54701 12.7211 1.45012 12.1785C1.27636 11.1303 1.19071 10.0146 1.18884 8.76932C1.18759 7.52481 1.27573 6.40778 1.45012 5.35902C1.54638 4.81584 1.84517 4.2714 2.29021 3.8276C2.73526 3.38319 3.2797 3.08378 3.82288 2.98751C4.87175 2.81312 5.98744 2.72748 7.23206 2.72623C7.95713 2.72623 8.65347 2.75749 9.30109 2.81624V2.81562C9.62801 2.845 9.91679 2.60372 9.94615 2.27743C9.97491 1.95051 9.73426 1.66173 9.40734 1.63237C8.72477 1.56986 7.99282 1.5386 7.23078 1.5386C5.91814 1.5386 4.73802 1.63237 3.6235 1.81614H3.61725C2.00027 2.10305 0.565067 3.53825 0.278795 5.15651V5.16276C0.0937826 6.27663 0.00126032 7.45678 1.21787e-05 8.77069C-0.00123796 10.084 0.093773 11.2634 0.277547 12.376L0.278726 12.3837Z"
                      fill="black"
                    />
                    <path
                      d="M12.5541 0.437268L12.5497 0.441019C12.4466 0.532278 12.3403 0.626031 12.2247 0.729803L12.2209 0.732928L11.7352 1.17797L11.7315 1.1811C10.9414 1.91492 7.27721 5.58655 6.53217 6.4092C6.37091 6.59296 6.27589 6.82612 6.26214 7.07052C6.23964 7.39368 6.21276 7.72059 6.18651 8.03688C6.16275 8.32504 6.14025 8.59757 6.12087 8.8651V8.86573C6.09587 9.12888 6.18401 9.39015 6.36277 9.58456C6.54217 9.77895 6.79594 9.88771 7.06036 9.88335C7.08536 9.88335 7.11036 9.88335 7.13599 9.88085C7.40352 9.86209 7.67605 9.83959 7.96359 9.81584C8.2805 9.78959 8.6074 9.76208 8.93244 9.7402H8.93307C9.17684 9.72583 9.40876 9.63019 9.59252 9.46955C10.4139 8.72447 14.0868 5.06026 14.8206 4.27025L14.8244 4.2665L15.2682 3.78145L15.2713 3.7777C15.3744 3.66269 15.4688 3.55643 15.5601 3.45268L15.5638 3.44893C16.0064 2.93637 16.1889 1.94876 15.7532 1.29236V1.29174C15.752 1.28986 15.7507 1.28736 15.7495 1.28486C15.4732 0.879827 15.1231 0.529772 14.7181 0.254125L14.7119 0.24975C14.0555 -0.186555 13.0666 -0.004653 12.5541 0.437268ZM8.83173 8.55625C8.50543 8.57876 8.18041 8.60563 7.86536 8.63189C7.67971 8.64689 7.50033 8.66314 7.32593 8.67564C7.33968 8.50062 7.35468 8.32186 7.36968 8.13558C7.39593 7.82118 7.42281 7.49676 7.44532 7.16984C8.1329 6.42288 10.9369 3.60385 12.1334 2.44116V2.44053C12.6403 2.88495 13.1172 3.36188 13.5616 3.86882C12.3978 5.06458 9.57869 7.87058 8.83173 8.55625ZM14.0529 1.23672C14.333 1.42736 14.5743 1.66864 14.7649 1.94867C14.8549 2.08993 14.8193 2.49123 14.6661 2.67C14.5786 2.76938 14.4886 2.87127 14.3899 2.98253L14.3755 2.99815H14.3748C13.9461 2.51436 13.4885 2.05618 13.0047 1.62675L13.0203 1.613C13.1303 1.51362 13.2328 1.42298 13.3329 1.33609C13.511 1.18232 13.9117 1.14608 14.0529 1.23672Z"
                      fill="black"
                    />
                  </svg>
                  Edit
                </a>
              </li>
<<<<<<< HEAD
              <li>
                <a>
                  <FaTrashAlt />
                  Delete
                </a>
              </li>
=======
              <button>
                <li>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Delete
                  </a>
                </li>
              </button>
>>>>>>> 5044cec1231e456028fdfc8cfad5b89c0ff0c954
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default OptionButton;
