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
  GET_SONGS_FROM_PLAYLIST:
    "api/playlist/getSongsFromPlaylist?isFirstTimeFetched=",
  ADD_SONGS_TO_PLAYLIST: "api/playlist/addSongsToPlaylist",
  UPDATE_PLAYERNAME_PLAYLIST: "api/playlist/updatePlayerName",
  DELETE_SONG_FROM_PLAYLIST: "api/playlist/deleteSongFromPlaylistById?id=",
  DISABLE_SONG: "api/songs/disableSongStatus",
  UPDATE_SORT_ORDER_SONGS: "api/playlist/updateSongsOrder",
  UPDATE_PLAYLIST_TYPE: "api/playlist/addPlaylistType",
  DELETE_ALL_SONGS_PLAYLIST: "api/playlist/deleteAllSongsFromPlaylist",
  ADD_UPDATE_VOTE: "api/vote/addUpdateVote",
  GET_TABLE_VIEW_SONGS: "api/playlist/getSongsForTableView",
  GET_SONGS_REPORT_LIST: "api/vote/getSongsReportList?reportType=",
  CHANGE_PASSWORD: "api/auth/changePassword",
  CREATE_STREAM_USER: "api/stream/createStreamUser",
  SEND_STREAM_REQUEST: "api/stream/sendStreamRequestToMaster",
  GET_STREAM_REQUEST: "api/stream/getStreamRequest",
  CHANGE_STREAM_REQUEST_STATUS: "api/stream/changeStreamStatus",
  GET_LIVE_STREAM: "api/stream/getLiveStream",
  ADD_SONG_TO_PLAYLIST_BY_CUSTOMER: "api/playlist/addSongToPlaylistByCustomer",
  GET_THEME_LIST: "api/theme/getThemeList",
  ADD_UPDATE_THEME: "api/theme/addUpdateTheme",
  GET_THEME_BY_TITLE: "api/theme/getThemeByTitle?title=",
  GET_LIMIT_LIST: "api/limit/getLimitList",
  ADD_UPDATE_LIMIT: "api/limit/addUpdateLimit",
  GET_LIMIT_BY_TITLE: "api/limit/getLimitByTitle?heading=",
  GET_ALL_FAV_SONGS: `api/songs/getAllFavSongs`,
  IS_PLAYLIST_EMPTY: "api/playlist/isPlaylistEmpty",
  GET_ADD_SONG_LIST_FOR_CUSTOMER: `api/songs/getOnDutyPlayerSongsForCustomer`,
  REVERT_MASTER_CHECK: `api/playlist/revertMasterCheck`,
  CREATE_ERROR: `api/error/create-error`,
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
      query: (body: any) => `${endPoints.GET_SONGS_FROM_PLAYLIST}${body}`,
    }),
    getSongsReportList: builder.query({
      query: (body: any) => `${endPoints.GET_SONGS_REPORT_LIST}${body}`,
    }),
    getAssignSongsWithPlayers: builder.query({
      query: () => endPoints.GET_ASSIGN_SONGS_WITH_PLAYERS,
    }),
    getSongsList: builder.query({
      query: () => endPoints.GET_SONGS_LIST,
    }),
    getFavSongList: builder.query({
      query: () => endPoints.GET_ALL_FAV_SONGS,
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
    getAddSongListForCustomer: builder.query({
      query: () => endPoints.GET_ADD_SONG_LIST_FOR_CUSTOMER,
    }),
    getIsPlaylistEmpty: builder.query({
      query: () => endPoints.IS_PLAYLIST_EMPTY,
    }),
    getStreamRequest: builder.query({
      query: () => endPoints.GET_STREAM_REQUEST,
    }),

    getTableViewSongs: builder.mutation({
      query: (body: any) => ({
        url: endPoints.GET_TABLE_VIEW_SONGS,
        method: "POST",
        body: body,
      }),
    }),

    disbaleSongFromSongBank: builder.mutation({
      query: (body: any) => ({
        url: endPoints.DISABLE_SONG,
        method: "POST",
        body: body,
      }),
    }),
    getLiveStream: builder.query({
      query: () => endPoints.GET_LIVE_STREAM,
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
    changeUserPassword: builder.mutation({
      query: (body: any) => ({
        url: endPoints.CHANGE_PASSWORD,
        method: "POST",
        body: body,
      }),
    }),
    createStreamUser: builder.mutation({
      query: (body: any) => ({
        url: endPoints.CREATE_STREAM_USER,
        method: "POST",
        body: body,
      }),
    }),
    changeStreamRequestStatus: builder.mutation({
      query: (body: any) => ({
        url: endPoints.CHANGE_STREAM_REQUEST_STATUS,
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
    revertMasterCheck: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.REVERT_MASTER_CHECK}`,
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
    sendStreamRequest: builder.mutation({
      query: (body) => ({
        url: `${endPoints.SEND_STREAM_REQUEST}`,
        method: "POST",
        body: body,
      }),
    }),
    updatePlayerNamePlaylist: builder.mutation({
      query: (body) => ({
        url: `${endPoints.UPDATE_PLAYERNAME_PLAYLIST}`,
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
    deleteSongById: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_SONG_BYID}${body}`,
        method: "DELETE",
      }),
    }),
    deleteAllSongsFromPlaylist: builder.mutation({
      query: () => ({
        url: `${endPoints.DELETE_ALL_SONGS_PLAYLIST}`,
        method: "DELETE",
      }),
    }),
    undoDeletedSongsFromPlaylist: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_ALL_SONGS_PLAYLIST}`,
        method: "POST",
        body: body,
      }),
    }),
    deleteSongFromPlaylistById: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_SONG_FROM_PLAYLIST}${body.id}&isDeleted=${body.isDeleted} `,
        method: "DELETE",
      }),
    }),
    addSongToPlaylistByCustomer: builder.mutation({
      query: (body) => ({
        url: `${endPoints.ADD_SONG_TO_PLAYLIST_BY_CUSTOMER}`,
        method: "POST",
        body: body,
      }),
    }),
    getThemeList: builder.query({
      query: () => endPoints.GET_THEME_LIST,
    }),
    createError: builder.mutation({
      query: (body: any) => ({
        url: endPoints.CREATE_ERROR,
        method: "POST",
        body: body,
      }),
    }),
    addUpdateTheme: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_UPDATE_THEME,
        method: "POST",
        body: body,
      }),
    }),
    getThemeByTitle: builder.query({
      query: (body: any) => `${endPoints.GET_THEME_BY_TITLE}${body}`,
    }),
    getLimitList: builder.query({
      query: () => endPoints.GET_LIMIT_LIST,
    }),
    addUpdateLimit: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_UPDATE_LIMIT,
        method: "POST",
        body: body,
      }),
    }),
    getLimitByTitle: builder.query({
      query: (body: any) => `${endPoints.GET_LIMIT_BY_TITLE}${body}`,
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
  useGetTableViewSongsMutation,
  useLazyGetSongsReportListQuery,
  useChangeUserPasswordMutation,
  useDeleteAllSongsFromPlaylistMutation,
  useCreateStreamUserMutation,
  useLazyGetStreamRequestQuery,
  useSendStreamRequestMutation,
  useUndoDeletedSongsFromPlaylistMutation,
  useChangeStreamRequestStatusMutation,
  useLazyGetLiveStreamQuery,
  useAddSongToPlaylistByCustomerMutation,
  useLazyGetThemeListQuery,
  useAddUpdateThemeMutation,
  useLazyGetThemeByTitleQuery,
  useLazyGetLimitListQuery,
  useAddUpdateLimitMutation,
  useLazyGetLimitByTitleQuery,
  useLazyGetFavSongListQuery,
  useLazyGetIsPlaylistEmptyQuery,
  useLazyGetAddSongListForCustomerQuery,
  useCreateErrorMutation,
  useDisbaleSongFromSongBankMutation,
  useRevertMasterCheckMutation,
  useUpdatePlayerNamePlaylistMutation,
} = emptySplitApi;
