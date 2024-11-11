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
  GET_ASSIGN_SONGS_WITH_PLAYERS_V2: "api/songs/getAssignSongs-v2",
  GET_SONGS_FROM_PLAYLIST:
    "api/playlist/getSongsFromPlaylist?isFirstTimeFetched=",
  ADD_SONGS_TO_PLAYLIST: "api/playlist/addSongsToPlaylist",
  ADD_SONGS_TO_PLAYLIST_V2: "api/playlist/addSongsToPlaylist-v2",
  UPDATE_PLAYERNAME_PLAYLIST: "api/playlist/updatePlayerName",
  UPDATE_PLAYERNAME_PLAYLIST_V2: "api/playlist/updatePlayerName-v2",
  DELETE_SONG_FROM_PLAYLIST: "api/playlist/deleteSongFromPlaylistById?id=",
  DELETE_SONG_FROM_PLAYLISTV2: "api/playlist/deleteSongFromPlaylistById-v2?id=",
  DISABLE_SONG: "api/songs/disableSongStatus",
  UPDATE_SORT_ORDER_SONGS: "api/playlist/updateSongsOrder",
  UPDATE_SORT_ORDER_SONGS_V2: "api/playlist/updateSongsOrder-v2",

  UPDATE_PLAYLIST_TYPE: "api/playlist/addPlaylistType",
  DELETE_ALL_SONGS_PLAYLIST: "api/playlist/deleteAllSongsFromPlaylist",
  DELETE_ALL_SONGS_PLAYLIST_V2: "api/playlist/deleteAllSongsFromPlaylist-v2",
  ADD_UPDATE_VOTE: "api/vote/addUpdateVote",
  ADD_UPDATE_VOTE_V2: "api/vote/addUpdateVote-v2",

  GET_TABLE_VIEW_SONGS: "api/playlist/getSongsForTableView",
  GET_TABLE_VIEW_SONGS_V2: "api/playlist/getSongsForTableView-v2",
  GET_SONGS_REPORT_LIST: "api/vote/getSongsReportList?reportType=",
  CHANGE_PASSWORD: "api/auth/changePassword",
  CREATE_STREAM_USER: "api/stream/createStreamUser",
  SEND_STREAM_REQUEST: "api/stream/sendStreamRequestToMaster",
  GET_STREAM_REQUEST: "api/stream/getStreamRequest",
  CHANGE_STREAM_REQUEST_STATUS: "api/stream/changeStreamStatus",
  GET_LIVE_STREAM: "api/stream/getLiveStream",
  ADD_SONG_TO_PLAYLIST_BY_CUSTOMER: "api/playlist/addSongToPlaylistByCustomer",
  ADD_SONG_TO_PLAYLIST_BY_CUSTOMER_V2:
    "api/playlist/addSongToPlaylistByCustomer-v2",
  GET_THEME_LIST: "api/theme/getThemeList",
  ADD_UPDATE_THEME: "api/theme/addUpdateTheme",
  GET_THEME_BY_TITLE: "api/theme/getThemeByTitle?title=",
  GET_LIMIT_LIST: "api/limit/getLimitList",
  ADD_UPDATE_LIMIT: "api/limit/addUpdateLimit",
  GET_LIMIT_BY_TITLE: "api/limit/getLimitByTitle?heading=",
  GET_ALL_FAV_SONGS: `api/songs/getAllFavSongs`,
  IS_PLAYLIST_EMPTY: "api/playlist/isPlaylistEmpty",
  GET_ADD_SONG_LIST_FOR_CUSTOMER: `api/songs/getOnDutyPlayerSongsForCustomer`,
  GET_ADD_SONG_LIST_FOR_CUSTOMER_V2: `api/songs/getOnDutyPlayerSongsForCustomer-v2`,
  REVERT_MASTER_CHECK: `api/playlist/revertMasterCheck`,
  REVERT_MASTER_CHECK_V2: `api/playlist/revertMasterCheck-v2`,
  GET_SONGS_FROM_PLAYLIST_V2: "api/playlist/getSongsFromPlaylist-v2",
  ADD_MULTI_SONGS_IN_PLAYLIST_V2: "api/songs/addMultipleSongsToPlaylist-v2",
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
    getSongsFromPlaylistV2: builder.query({
      query: (body: any) => `${endPoints.GET_SONGS_FROM_PLAYLIST_V2}`,
    }),
    getSongsReportList: builder.query({
      query: (body: any) => `${endPoints.GET_SONGS_REPORT_LIST}${body}`,
    }),
    getAssignSongsWithPlayers: builder.query({
      query: () => endPoints.GET_ASSIGN_SONGS_WITH_PLAYERS,
    }),
    getAssignSongsWithPlayersV2: builder.query({
      query: () => endPoints.GET_ASSIGN_SONGS_WITH_PLAYERS_V2,
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
    getAddSongListForCustomerV2: builder.query({
      query: () => endPoints.GET_ADD_SONG_LIST_FOR_CUSTOMER_V2,
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
    getTableViewSongsV2: builder.mutation({
      query: (body: any) => ({
        url: endPoints.GET_TABLE_VIEW_SONGS_V2,
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
    addUpdateVoteV2: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.ADD_UPDATE_VOTE_V2}`,
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
    updateSortOrderOfSongsV2: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.UPDATE_SORT_ORDER_SONGS_V2}`,
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
    revertMasterCheckV2: builder.mutation({
      query: (body: any) => ({
        url: `${endPoints.REVERT_MASTER_CHECK_V2}`,
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
    addSongsToPlaylistV2: builder.mutation({
      query: (body) => ({
        url: endPoints.ADD_SONGS_TO_PLAYLIST_V2,
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
    updatePlayerNamePlaylistV2: builder.mutation({
      query: (body) => ({
        url: `${endPoints.UPDATE_PLAYERNAME_PLAYLIST_V2}`,
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
    deleteAllSongsFromPlaylistV2: builder.mutation({
      query: () => ({
        url: `${endPoints.DELETE_ALL_SONGS_PLAYLIST_V2}`,
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
    deleteSongFromPlaylistByIdV2: builder.mutation({
      query: (body) => ({
        url: `${endPoints.DELETE_SONG_FROM_PLAYLISTV2}${body.id}&isDeleted=${body.isDeleted}&auto=${body.auto} `,
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
    addSongToPlaylistByCustomerV2: builder.mutation({
      query: (body) => ({
        url: `${endPoints.ADD_SONG_TO_PLAYLIST_BY_CUSTOMER_V2}`,
        method: "POST",
        body: body,
      }),
    }),
    addMultiSongToPlaylistV2: builder.mutation({
      query: (body) => ({
        url: `${endPoints.ADD_MULTI_SONGS_IN_PLAYLIST_V2}`,
        method: "POST",
        body: body,
      }),
    }),
    getThemeList: builder.query({
      query: () => endPoints.GET_THEME_LIST,
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
  useDisbaleSongFromSongBankMutation,
  useRevertMasterCheckMutation,
  useUpdatePlayerNamePlaylistMutation,
  useLazyGetSongsFromPlaylistV2Query,
  useDeleteSongFromPlaylistByIdV2Mutation,
  useDeleteAllSongsFromPlaylistV2Mutation,
  useAddSongsToPlaylistV2Mutation,
  useGetTableViewSongsV2Mutation,
  useUpdatePlayerNamePlaylistV2Mutation,
  useLazyGetAssignSongsWithPlayersV2Query,
  useRevertMasterCheckV2Mutation,
  useUpdateSortOrderOfSongsV2Mutation,
  useAddUpdateVoteV2Mutation,
  useLazyGetAddSongListForCustomerV2Query,
  useAddSongToPlaylistByCustomerV2Mutation,
  useAddMultiSongToPlaylistV2Mutation,
} = emptySplitApi;
