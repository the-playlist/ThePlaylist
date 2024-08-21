"use client";

import DraggableList from "react-draggable-list";

import { useEffect, useRef, useState } from "react";

const dummy = [
  {
    _id: "66c4e730243ee7e204eb8c5f",
    playerName: "Chris Hampton",
    assignedPlayerId: "667449a3a27353c42241cfca",
    songId: "666ad89c3487aaafd7754eea",
    title: "34+35",
    artist: "Ariana Grande",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 0,
    sortByMaster: false,
    addByCustomer: false,
    id: 0,
  },
  {
    _id: "66c4e730243ee7e204eb8c60",
    playerName: "Lainey Willis",
    assignedPlayerId: "667449b8a27353c42241cfce",
    songId: "667439681f2c5b32c4b44643",
    title: "Allentown",
    artist: "Billy Joel",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 1,
    sortByMaster: false,
    addByCustomer: false,
    id: 1,
  },
  {
    _id: "66c4e730243ee7e204eb8c62",
    playerName: "Chris Hampton",
    assignedPlayerId: "667449a3a27353c42241cfca",
    songId: "667437c01f2c5b32c4b4463a",
    title: "Bette Davis eyes",
    artist: "Kim Carnes",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 2,
    sortByMaster: false,
    addByCustomer: false,
    id: 2,
  },
  {
    _id: "66c4e730243ee7e204eb8c65",
    playerName: "Dillon Foster",
    assignedPlayerId: "667449fba27353c42241cfda",
    songId: "666ad91b3487aaafd7754ef3",
    title: "Chandelier",
    artist: "Sia",
    introSec: "1",
    songDuration: "0:03",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 3,
    sortByMaster: false,
    addByCustomer: false,
    id: 3,
  },
  {
    _id: "66c4e730243ee7e204eb8c64",
    playerName: "Bobby Watts",
    assignedPlayerId: "66744690f315e75f748a418c",
    songId: "6673c2cc663b6c71d866099f",
    title: "Boyfriend",
    artist: "Selena Gomez",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 4,
    sortByMaster: false,
    addByCustomer: false,
    id: 4,
  },
  {
    _id: "66c4e730243ee7e204eb8c63",
    playerName: "Tom Jones",
    assignedPlayerId: "66744989a27353c42241cfc6",
    songId: "666ad6633487aaafd7754ed8",
    title: "Born In The U.S.A",
    artist: "Bruce Springsteen",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Ballad",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 5,
    sortByMaster: false,
    addByCustomer: false,
    id: 5,
  },
  {
    _id: "66c4e730243ee7e204eb8c66",
    playerName: "Spring Hughes",
    assignedPlayerId: "667449e6a27353c42241cfd6",
    songId: "66744122f315e75f748a4148",
    title: "Dancing In the Dark",
    artist: "Bruce Springsteen",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 6,
    sortByMaster: false,
    addByCustomer: false,
    id: 6,
  },
  {
    _id: "66c4e730243ee7e204eb8c68",
    playerName: "Lainey Willis",
    assignedPlayerId: "667449b8a27353c42241cfce",
    songId: "667439f61f2c5b32c4b44646",
    title: "Don't Stop 'Till You Get Enough",
    artist: "Michael Jackson",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 7,
    sortByMaster: false,
    addByCustomer: false,
    id: 7,
  },
  {
    _id: "66c4e730243ee7e204eb8c69",
    playerName: "Chris Hampton",
    assignedPlayerId: "667449a3a27353c42241cfca",
    songId: "667438dd1f2c5b32c4b44640",
    title: "Don't Stop The Music",
    artist: "Rihanna",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 8,
    sortByMaster: false,
    addByCustomer: false,
    id: 8,
  },
  {
    _id: "66c4e730243ee7e204eb8c67",
    playerName: "Bobby Watts",
    assignedPlayerId: "66744690f315e75f748a418c",
    songId: "666bf54e249a3fd781d96391",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    introSec: "10",
    songDuration: "0:12",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 9,
    sortByMaster: false,
    addByCustomer: false,
    id: 9,
  },
  {
    _id: "66c4e730243ee7e204eb8c6a",
    playerName: "Dillon Foster",
    assignedPlayerId: "667449fba27353c42241cfda",
    songId: "666aef3138323ba27d086398",
    title: "Dream On",
    artist: "Areosmith",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 10,
    sortByMaster: false,
    addByCustomer: false,
    id: 10,
  },
  {
    _id: "66c4e730243ee7e204eb8c6b",
    playerName: "Lainey Willis",
    assignedPlayerId: "667449b8a27353c42241cfce",
    songId: "66743bec1f2c5b32c4b44658",
    title: "Express Yourself",
    artist: "Madonna",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 11,
    sortByMaster: false,
    addByCustomer: false,
    id: 11,
  },
  {
    _id: "66c4e730243ee7e204eb8c6c",
    playerName: "Spring Hughes",
    assignedPlayerId: "667449e6a27353c42241cfd6",
    songId: "66744100f315e75f748a4145",
    title: "Faith (2010 Remastered Version))",
    artist: "George Michael",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 12,
    sortByMaster: false,
    addByCustomer: false,
    id: 12,
  },
  {
    _id: "66c4e730243ee7e204eb8c6d",
    playerName: "Bobby Watts",
    assignedPlayerId: "66744690f315e75f748a418c",
    songId: "666ad61a3487aaafd7754ed2",
    title: "Feel Like Makin' Love",
    artist: "Bad Company",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Ballad",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 13,
    sortByMaster: false,
    addByCustomer: false,
    id: 13,
  },
  {
    _id: "66c4e730243ee7e204eb8c6e",
    playerName: "Chris Hampton",
    assignedPlayerId: "667449a3a27353c42241cfca",
    songId: "666ad8f33487aaafd7754ef0",
    title: "Flowers",
    artist: "Miley Cyrus",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 14,
    sortByMaster: false,
    addByCustomer: false,
    id: 14,
  },
  {
    _id: "66c4e730243ee7e204eb8c71",
    playerName: "Tom Jones",
    assignedPlayerId: "66744989a27353c42241cfc6",
    songId: "666bf52c249a3fd781d9638e",
    title: "Gettin' Jiggy Wit It",
    artist: "Will Smith",
    introSec: "10",
    songDuration: "0:12",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 15,
    sortByMaster: false,
    addByCustomer: false,
    id: 15,
  },
  {
    _id: "66c4e730243ee7e204eb8c72",
    playerName: "Dillon Foster",
    assignedPlayerId: "667449fba27353c42241cfda",
    songId: "66744171f315e75f748a414e",
    title: "Girl On Fire",
    artist: "Alicia Keys",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 16,
    sortByMaster: false,
    addByCustomer: false,
    id: 16,
  },
  {
    _id: "66c4e730243ee7e204eb8c6f",
    playerName: "Spring Hughes",
    assignedPlayerId: "667449e6a27353c42241cfd6",
    songId: "667441c2f315e75f748a4154",
    title: "Fortnight (feat. Post Malone)",
    artist: "Taylor Swift",
    introSec: "15",
    songDuration: "0:17",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 17,
    sortByMaster: true,
    addByCustomer: false,
    id: 17,
  },
  {
    _id: "66c4e730243ee7e204eb8c61",
    playerName: "Bobby Watts",
    assignedPlayerId: "66744690f315e75f748a418c",
    songId: "666bf5a6249a3fd781d96397",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    introSec: "10",
    songDuration: "0:12",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 18,
    sortByMaster: true,
    addByCustomer: false,
    id: 18,
  },
  {
    _id: "66c4e730243ee7e204eb8c70",
    playerName: "Spring Hughes",
    assignedPlayerId: "667449e6a27353c42241cfd6",
    songId: "666bf7f2249a3fd781d963c4",
    title: "Genie in a bottle",
    artist: "Christina Aguilera",
    introSec: "10",
    songDuration: "0:12",
    isFav: false,
    dutyStatus: true,
    category: "Standard",
    tableUpVote: 0,
    tableDownVote: 0,
    upVote: 0,
    downVote: 0,
    sortOrder: 19,
    sortByMaster: false,
    addByCustomer: false,
    id: 19,
  },
];

const data = Array(10)
  .fill(null)
  .map((item, index) => ({ id: index }));

const Item = ({ item, itemSelected, dragHandleProps }) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const {
    title,
    upVote,
    downVote,
    playerName,
    introSec,
    category,
    isFav,
    sortOrder,
    sortByMaster,
    songDuration,
    id: index,
  } = item || {};
  const isLockedSongs = index == 0 || index == 1;
  return (
    <div
      key={index}
      className={` text-center  shadow rounded-2xl h-20 flex items-center  px-5`}
      onTouchStart={(e) => {
        e.preventDefault();
        console.log("touchStart");

        // e.target.style.backgroundColor = "blue";
        document.body.style.overflow = "hidden";
        onTouchStart(e);
      }}
      onMouseDown={(e) => {
        console.log("mouseDown");
        document.body.style.overflow = "hidden";
        onMouseDown(e);
      }}
      onTouchEnd={(e) => {
        // e.target.style.backgroundColor = "black";
        document.body.style.overflow = "visible";
        console.log("touchEnd");
      }}
      onMouseUp={() => {
        document.body.style.overflow = "visible";
      }}
    >
      {title}
    </div>
    // <div
    //   className="disable-select"
    //   style={{
    //     border: "1px solid black",
    //     margin: "4px",
    //     padding: "10px",
    //     display: "flex",
    //     justifyContent: "space-around",
    //     background: "#fff",
    //     userSelect: "none",
    //   }}
    // >
    //   {item.id}
    //   <div
    //     className="disable-select dragHandle"
    //     style={{
    //       fontWeight: "600",
    //       transform: "rotate(90deg)",
    //       width: "20px",
    //       height: "20px",
    //       backgroundColor: "black",
    //     }}
    //     onTouchStart={(e) => {
    //       e.preventDefault();
    //       console.log("touchStart");
    //       e.target.style.backgroundColor = "blue";
    //       document.body.style.overflow = "hidden";
    //       onTouchStart(e);
    //     }}
    //     onMouseDown={(e) => {
    //       console.log("mouseDown");
    //       document.body.style.overflow = "hidden";
    //       onMouseDown(e);
    //     }}
    //     onTouchEnd={(e) => {
    //       e.target.style.backgroundColor = "black";
    //       document.body.style.overflow = "visible";
    //     }}
    //     onMouseUp={() => {
    //       document.body.style.overflow = "visible";
    //     }}
    //   ></div>
    // </div>
  );
};

const List = () => {
  const [list, setList] = useState(data);
  const [showBorder, setShowBorder] = useState(false);

  const containerRef = useRef();

  const _onListChange = (newList) => {
    setList(newList);
  };

  return (
    <div className="App">
      <div
        id="scrollableContainer"
        ref={containerRef}
        className={` overflow-y-auto md:h-[630px] sm:h-[560px] ${
          showBorder && "border border-red"
        }`}
        // style={{ touchAction: "pan-y", background: "beige" }}
      >
        <DraggableList
          itemKey="id"
          template={Item}
          list={dummy}
          onMoveEnd={(newList) => _onListChange(newList)}
          container={() => containerRef.current}
          onDragStart={() => {
            setShowBorder(true);
          }}
          onDragEnd={() => {
            setShowBorder(false);
          }}
        />
      </div>
    </div>
  );
};

export default List;
