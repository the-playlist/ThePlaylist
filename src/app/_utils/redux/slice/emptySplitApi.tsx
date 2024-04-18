import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./url";
import { selectToken } from "../reducer/mainSlice";

const endPoints = {
  GET_SONGS_LIST: `api/songs/getAllSongs`,
  ADD_UPDATE_PLAYER: `api/players/addUpdatePlayer`,
  ADD_UPDATE_SONG: `api/songs/addUpdateSong`,
  DELETE_PLAYER: `api/players/deletePlayerById?id=`,
  GET_STAFF_LIST: "api/duty/getAllStaff",
  DELETE_SONG_BYID: "api/songs/deleteSongById?id=",
  MARK_SONG_FAV: "api/songs/markAsFav",
  UPDATE_DUTY_STATUS: "api/duty/updateDutyStatus",
  GET_ONDUTY_PLAYER_SONGS: "api/songs/getOnDutyPlayerSongs",
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
    getStaffList: builder.query({
      query: () => endPoints.GET_STAFF_LIST,
    }),
    getOnDutyPlayerSongList: builder.query({
      query: () => endPoints.GET_ONDUTY_PLAYER_SONGS,
    }),
    updateDutyStatus: builder.mutation({
      query: (body: any) => ({
        url: `${
          body?.id != null
            ? `${endPoints.UPDATE_DUTY_STATUS}?id=${body.id}`
            : endPoints.UPDATE_DUTY_STATUS
        }`,
        method: "POST",
        body: body,
      }),
    }),
    addUpdatePlayer: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_UPDATE_PLAYER,
        method: "POST",
        body: body,
      }),
    }),
    markSongFav: builder.mutation({
      query: (body) => ({
        url: endPoints.MARK_SONG_FAV,
        method: "POST",
        body: body,
      }),
    }),
    addUpdateSong: builder.mutation({
      query: (body) => ({
        url: `${endPoints.ADD_UPDATE_SONG}`,
        method: "POST",
        body: body?.data,
      }),
    }),
    deletePlayerById: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_PLAYER}${body}`,
        method: "DELETE",
      }),
    }),
    deleteSongById: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_SONG_BYID}${body}`,
        method: "DELETE",
      }),
    }),
  }),

  // tag use for invalidate api
  tagTypes: [],
});

export const {
  useLazyGetSongsListQuery,
  useAddUpdatePlayerMutation,
  useDeletePlayerByIdMutation,
  useLazyGetStaffListQuery,
  useUpdateDutyStatusMutation,
  useDeleteSongByIdMutation,
  useAddUpdateSongMutation,
  useMarkSongFavMutation,
  useLazyGetOnDutyPlayerSongListQuery,
} = emptySplitApi;
