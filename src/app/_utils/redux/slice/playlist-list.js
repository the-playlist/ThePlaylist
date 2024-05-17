import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  playlistSongList: [],
  isStart: false,
};

const playlistSlice = createSlice({
  name: "playlistReducer",
  initialState,
  reducers: {
    setPlaylistSongList: (state, { payload }) => {
      state.playlistSongList = payload;
    },
    setIsStart: (state, { payload }) => {
      state.isStart = payload;
    },
  },
});

export const { setPlaylistSongList, setIsStart } = playlistSlice.actions;
export default playlistSlice.reducer;
