"use client";
import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { MdClear } from "react-icons/md";

interface Performer {
  id: number;
  songName: string;
  artistName: string;
}

const Typeahead: React.FC<{ options: Performer[] }> = ({ options }) => {
  const [inputValue, setInputValue] = useState("");

  const [filteredOptions, setFilteredOptions] = useState<Performer[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = options.filter((option) =>
      option.songName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };
  useEffect(() => {
    if (inputValue?.length == 0) {
      setIsOpen(true);
    }
  }, [inputValue]);

  const handleClearClick = () => {
    setInputValue("");
  };

  return (
    <>
      <div className="relative ">
        <div className="flex border border-gray-300 rounded-lg">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="border border-gray-300  text-gray-900 text-base rounded-lg px-4 py-5 w-full focus:ring-black "
            placeholder="Type something..."
          />
          {inputValue && (
            <button
              className="absolute right-0 top-4 hover:pointer rounded-r-lg px-4 py-2 "
              onClick={handleClearClick}
            >
              <MdClear size={20} />
            </button>
          )}
        </div>

        {inputValue?.length > 0 && isOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-t-lg mt-1 ">
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                className="px-4 py-2 cursor-pointer hover:bg-top-queue-bg"
                onClick={() => {
                  setInputValue(option.songName);
                  setIsOpen(false);
                }}
              >
                {option.songName} - {option.artistName}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white flex justify-end p-4">
        <button
          onClick={() => {
            setInputValue("");
          }}
          className="flex w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-black font-bold py-5 px-4 rounded-md justify-center"
        >
          <div className="rounded-full bg-add-bg mr-2 p-1">
            <IoAdd size={25} />
          </div>
          <span className="text-xl text-black ml-5">Add a Song</span>
        </button>
      </div>
    </>
  );
};
const AddSong = () => {
  const performer = [
    { id: 0, songName: "Imagine", artistName: "John Lennon" },
    { id: 1, songName: "Born to run", artistName: "Savannah R." },
    { id: 2, songName: "Hey Jude", artistName: "Shawn T." },
    { id: 3, songName: "Respect", artistName: "Alice K." },
    { id: 4, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 5, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 6, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 7, songName: "Imagine", artistName: "John Lennon" },
    { id: 8, songName: "Born to run", artistName: "Savannah R." },
    { id: 9, songName: "Hey Jude", artistName: "Shawn T." },
    { id: 10, songName: "Respect", artistName: "Alice K." },
    { id: 11, songName: "Hey Ya!", artistName: "Tom M." },
    {
      id: 12,
      songName: "Dancing Queen",
      artistName: "Eric Clapton",
    },
    { id: 13, songName: "Waterfalls", artistName: "Madonna" },
    { id: 14, songName: "Pretty Woman", artistName: "Bruno Mars" },
    {
      id: 15,
      songName: "Superstition",
      artistName: "Stevie Wonder",
    },
    { id: 16, songName: "Billie Jean", artistName: "Outkast" },
  ];

  return (
    <div className="overflow-x-auto bg-white h-screen overflow-y-scroll mx-auto  px-10 pt-10">
      <div className="mb-2 text-base font-medium text-black">Search Song</div>
      <Typeahead options={performer} />
    </div>
  );
};

export default AddSong;
