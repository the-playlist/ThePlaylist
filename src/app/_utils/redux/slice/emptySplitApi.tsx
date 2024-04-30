import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./url";
import { selectToken } from "../reducer/mainSlice";

const endPoints = {
  GET_SONGS_LIST: `api/songs/getAllSongs`,
  GET_ALL_PLAYERS: `api/players/getAllPlayers`,
  ADD_UPDATE_PLAYER: `api/players/addUpdatePlayer`,
  ADD_UPDATE_SONG: `api/songs/addUpdateSong`,
  DELETE_PLAYER: `api/players/deletePlayerById?id=`,
  GET_STAFF_LIST: "api/duty/getAllStaff",
  DELETE_SONG_BYID: "api/songs/deleteSongById?id=",
  MARK_SONG_FAV: "api/songs/markAsFav",
  UPDATE_DUTY_STATUS: "api/duty/updateDutyStatus",
  GET_ONDUTY_PLAYER_SONGS: "api/songs/getOnDutyPlayerSongs",
  GET_ASSIGN_SONGS_WITH_PLAYERS: "api/songs/getAssignSongs",
  GET_SONGS_FROM_PLAYLIST: "api/playlist/getSongsFromPlaylist",
  ADD_SONGS_TO_PLAYLIST: "api/playlist/addSongsToPlaylist",
  DELETE_SONG_FROM_PLAYLIST: "api/playlist/deleteSongFromPlaylistById?id=",
  UPDATE_SORT_ORDER_SONGS: "api/playlist/updateSongsOrder",
  UPDATE_PLAYLIST_TYPE: "api/playlist/addPlaylistType",
  ADD_UPDATE_VOTE: "api/vote/addUpdateVote",
  GET_TABLE_VIEW_SONGS: "api/playlist/getSongsForTableView?id=",
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
    getSongsFromPlaylist: builder.query({
      query: () => endPoints.GET_SONGS_FROM_PLAYLIST,
    }),
    getAssignSongsWithPlayers: builder.query({
      query: () => endPoints.GET_ASSIGN_SONGS_WITH_PLAYERS,
    }),
    getSongsList: builder.query({
      query: () => endPoints.GET_SONGS_LIST,
    }),
    getAllPlayers: builder.query({
      query: () => endPoints.GET_ALL_PLAYERS,
    }),
    getStaffList: builder.query({
      query: () => endPoints.GET_STAFF_LIST,
    }),
    getOnDutyPlayerSongList: builder.query({
      query: () => endPoints.GET_ONDUTY_PLAYER_SONGS,
    }),
    getTableViewSongs: builder.query({
      query: (body: any) => `${endPoints.GET_TABLE_VIEW_SONGS}${body}`,
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
    updatePlaylistType: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.UPDATE_PLAYLIST_TYPE}`,
        method: "POST",
        body: body,
      }),
    }),
    addUpdateVote: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.ADD_UPDATE_VOTE}`,
        method: "POST",
        body: body,
      }),
    }),
    updateSortOrderOfSongs: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.UPDATE_SORT_ORDER_SONGS}`,
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
    addSongsToPlaylist: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_SONGS_TO_PLAYLIST,
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
    deleteSongFromPlaylistById: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_SONG_FROM_PLAYLIST}${body}`,
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
  useLazyGetAllPlayersQuery,
  useLazyGetAssignSongsWithPlayersQuery,
  useLazyGetSongsFromPlaylistQuery,
  useAddSongsToPlaylistMutation,
  useDeleteSongFromPlaylistByIdMutation,
  useUpdateSortOrderOfSongsMutation,
  useUpdatePlaylistTypeMutation,
  useAddUpdateVoteMutation,
  useLazyGetTableViewSongsQuery,
} = emptySplitApi;
