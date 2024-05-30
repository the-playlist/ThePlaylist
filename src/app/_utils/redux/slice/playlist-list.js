import { createSlice } from "@reduxjs/toolkit";
import { PLAYING_STAE } from "../../common/constants";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

const initialState = {
  playlistSongList: [],
  isStart: false,
  songsListUpdate: false,
  isAdvanceTheQuee: false,
  playingState: false,
  playlistLength: 0,
  currentSong: {
    title: "",
    player: "",
    id: 0,
    duration: 0,
  },
  currentSongSecond: 0,
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
    setSongsListUpdate: (state, { payload }) => {
      state.songsListUpdate = !state.songsListUpdate;
    },
    setPlayingState: (state, { payload }) => {
      state.playingState = payload;
    },
    setIsAdvanceTheQuee: (state, { payload }) => {
      state.isAdvanceTheQuee = payload;
    },
    setPlaylistLength: (state, { payload }) => {
      state.playlistLength = payload;
    },
    setCurrentSong: (state, { payload }) => {
      state.currentSong = payload;
    },
    setCurrentSongSecond: (state, { payload }) => {
      state.currentSongSecond = payload;
    },
  },
});

const persistConfig = {
  key: "playlistPersist", // Key to store data under in localStorage
  storage,
  whitelist: [
    "playlistLength",
    "currentSong",
    "playlistSongList",
    "currentSongSecond",
    "playingState",
  ], // Only persist the 'playingState' slice
  blacklist: ["isStart", "songsListUpdate", "isAdvanceTheQuee"], // Alternatively, blacklist slices you don't want persisted
};

export const {
  setPlaylistSongList,
  setCurrentSongSecond,
  setIsStart,
  setSongsListUpdate,
  setPlayingState,
  setIsAdvanceTheQuee,
  setPlaylistLength,
  setCurrentSong,
} = playlistSlice.actions;

export const persistedReducer = persistReducer(
  persistConfig,
  playlistSlice.reducer
);

// export default playlistSlice.reducer;
