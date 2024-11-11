"use client";

import { store } from "../app/_utils/redux/store";
import { Provider } from "react-redux";

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
