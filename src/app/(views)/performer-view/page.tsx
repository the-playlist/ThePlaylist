import React from "react";
import { Logo } from "../../svgs";

const PerformerView = () => {
  const performer = [
    { id: 0, songName: "Imagine", artistName: "John Lennon", intro: 20 },
    { id: 1, songName: "Born to run", artistName: "Savannah R.", intro: 15 },
    { id: 2, songName: "Hey Jude", artistName: "Shawn T.", intro: 18 },
    { id: 3, songName: "Respect", artistName: "Alice K.", intro: 16 },
    { id: 4, songName: "Hey Ya!", artistName: "Tom M.", intro: 30 },
    { id: 5, songName: "Hey Ya!", artistName: "Tom M.", intro: 5 },
    { id: 6, songName: "Hey Ya!", artistName: "Tom M.", intro: 10 },
  ];
  return (
    <div className="overflow-x-auto max-w-4xl mx-auto p-4">
      <div className="  flex items-center justify-center m-5">
        <Logo />
      </div>
      <table className="table table-lg border-separate border-spacing-y-2 ">
        <thead className="">
          <tr className=" text-black  text-base">
            <th>#Sr</th>
            <th>Songs</th>
            <th>Players</th>
            <th>Intro</th>
          </tr>
        </thead>
        {performer?.map((item: any, index: number) => (
          <tbody
            className={`h-20  text-base rounded-tl-lg    
              ${
                index < 2
                  ? "bg-yellow-400 text-white font-medium"
                  : "bg-gray-200 text-black font-medium"
              }`}
          >
            <tr>
              <td>{index + 1}</td>
              <td>{item?.songName}</td>
              <td>{item?.artistName}</td>
              <td className="text-black">
                <div className=" h-10 w-10 text-sm bg-white rounded-full justify-center items-center flex">
                  {item?.intro}
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default PerformerView;
