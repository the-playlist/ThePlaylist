import {createSlice} from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    openModal: false,
    title: 1,
    details: "",
    type: "success",
    primaryBtnText: "OK"
  },
  reducers: {
    openModal: state => {
      state.openModal = true;
    },
    closeModal: state => {
      state.openModal = false;
    },
    setModalDetails: (state, {payload}) => {
      state.title = payload.title;
      state.details = payload.details;
      state.type = payload.type;
    }
  }
});

export const {openModal, closeModal, setModalDetails} = modalSlice.actions;
