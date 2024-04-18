import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./url";
import { selectToken } from "../reducer/mainSlice";

const endPoints = {
  GET_SONGS_LIST: `api/songs/getAllSongs`,
  ADD_UPDATE_PLAYER: `api/players/addUpdatePlayer`,
  DELETE_PLAYER: `api/players/deletePlayerById?id=`,
  GET_STAFF_LIST: "api/duty/getAllStaff",
  UPDATE_DUTY_STATUS: "api/duty/updateDutyStatus?id=",
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
    updateDutyStatus: builder.mutation({
      query: (body) => ({
        url: `${endPoints.UPDATE_DUTY_STATUS}${body.id}`,
        method: "POST",
        body: body.status,
      }),
    }),
    addUpdatePlayer: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_UPDATE_PLAYER,
        method: "POST",
        body: body,
      }),
    }),
    deletePlayerById: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_PLAYER}${body}`,
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
} = emptySplitApi;
