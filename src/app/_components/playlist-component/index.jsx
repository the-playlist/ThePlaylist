"use client";
import React, { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PlaylistComponent = ({
  playlistSongList,
  handleDragEnd,
  deleteSongFromPlaylistHandler,
  isStart,
  setIsStart,
}) => {
  return useMemo(
    () => (
      <DragDropContext
        onDragEnd={(result) => {
          if (result?.destination?.index > 1) {
            handleDragEnd(result);
          }
        }}
      >
        <Droppable droppableId="list">
          {(provided, snapshot) => (
            <div {...provided?.droppableProps} ref={provided?.innerRef}>
              {playlistSongList.map((item, index) => {
                const {
                  title,
                  upVote,
                  downVote,
                  playerName,
                  introSec,
                  category,
                  songDuration,
                  isFav,
                  sortOrder,
                } = item || {};
                const isLockedSongs = index === 0 || index === 1;
                return (
                  <Draggable
                    key={sortOrder}
                    draggableId={sortOrder.toString()}
                    index={index}
                    isDragDisabled={isLockedSongs}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div
                            key={index}
                            className={` text-center ${
                              isLockedSongs ? "bg-top-queue-bg" : "bg-white"
                            }  shadow rounded-2xl h-20 flex items-center mb-4 px-5`}
                          ></div>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ),
    [playlistSongList, handleDragEnd, isStart]
  );
};

export default React.memo(PlaylistComponent);
