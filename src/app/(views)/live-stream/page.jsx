"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCreateStreamUserMutation } from "@/app/_utils/redux/slice/emptySplitApi";
import { LiveVideo } from "@/app/_components";
import { Logo } from "@/app/svgs";

const Livestream = () => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const callId = searchParams.get("callId");
  const tableNo = searchParams.get("tableNo");
  const [createStreamUserApi] = useCreateStreamUserMutation();
  const [streamPayload, setStreamPayload] = useState(null);

  useEffect(() => {
    if (user_id && callId) {
      creatStreamUserHandler();
    }
  }, [user_id, callId, tableNo]);

  const creatStreamUserHandler = async () => {
    let payload = {
      user_id: user_id,
      callId: callId,
      tableNo: tableNo,
    };
    let response = await createStreamUserApi(payload);
    if (response?.data?.success) {
      setStreamPayload(response?.data?.content);
    }
  };

  return (
    <div className="bg-black min-h-screen ">
      <div className=" flex items-center justify-center p-5">
        <Logo />
      </div>
      {streamPayload && (
        <LiveVideo
          setStreamPayload={setStreamPayload}
          streamPayload={streamPayload}
        />
      )}
    </div>
  );
};

export default Livestream;
