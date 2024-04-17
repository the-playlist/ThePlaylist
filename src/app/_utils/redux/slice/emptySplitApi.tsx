import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./url";
import { selectToken } from "../reducer/mainSlice";

const endPoints = {
  GET_SONGS_LIST: `api/songs/getAllSongs`,
  ADD_UPDATE_PLAYER: `api/players/addUpdatePlayer`,
};

// Define a service using a base URL and expected endpoints
export const emptySplitApi = createApi({
  reducerPath: "emptySplitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // custom redux toolkit query header
    prepareHeaders: async (headers, { getState }) => {
      try {
        const token = selectToken(getState());
        if (token) {
          headers.set("x-auth-token", `${token}`);
        } else {
          headers.set("x-auth-token", "");
        }
      } catch (err) {
        headers.set("x-auth-token", "");
      }
      return headers;
    },
  }),
  // just for testing
  endpoints: (builder) => ({
    getSongsList: builder.query({
      query: () => endPoints.GET_SONGS_LIST,
    }),
    addUpdatePlayer: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_UPDATE_PLAYER,
        method: "POST",
        body: body,
      }),
    }),
  }),

  // tag use for invalidate api
  tagTypes: [],
});

export const { useLazyGetSongsListQuery, useAddUpdatePlayerMutation } =
  emptySplitApi;
