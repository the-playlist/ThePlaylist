// import { createSlice } from "@reduxjs/toolkit";
// import { persistReducer } from "redux-persist";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage: AsyncStorage,
//   blacklist: [""],
// };

// const initialState = {
//   user: null,
//   location: null,
// };

// export const mainSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, actions) => {
//       state.user = actions.payload;
//     },
//     setLocation: (state, actions) => {
//       state.location = actions.payload;
//     },
//   },
// });

// export const { setUser } = mainSlice.actions;
// export const { setLocation } = mainSlice.actions;

// export const selectToken = (state) => state.auth.user.token;

// export default mainReducer = persistReducer(persistConfig, mainSlice.reducer);

import { createSlice, configureStore } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";

const initialState = {
  user: null,
  location: null,
};

export const mainSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth, // Make sure to adjust this path based on your store structure
      };
    },
  },
});

export const { setUser, setLocation } = mainSlice.actions;

export const selectToken = (state) => state.auth.user.token;

const store = configureStore({
  reducer: {
    auth: mainSlice.reducer,
    // Add other reducers here if you have any
  },
  // Middleware and other configuration can be added here
});

// Export store and wrapper
export const wrapper = createWrapper(() => store);

export default store;
