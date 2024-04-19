"use client";
import { useEffect } from "react";

import { store } from "../app/_utils/redux/store";
import { Provider } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

export default function ReduxProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (pathname == "/") {
      router.push("/players");
    }
  }, []);

  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
