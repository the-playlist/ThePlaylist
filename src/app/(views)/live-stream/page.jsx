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
  const tableno = searchParams.get("tableno");
  const [createStreamUserApi] = useCreateStreamUserMutation();
  const [streamPayload, setStreamPayload] = useState(null);

  useEffect(() => {
    if (user_id && callId) {
      creatStreamUserHandler();
    }
  }, [user_id, callId, tableno]);

  const creatStreamUserHandler = async () => {
    let payload = {
      user_id: user_id,
      callId: callId,
      tableno: tableno,
    };

    let response = await createStreamUserApi(payload);
    if (response.data.success) {
      setStreamPayload(response.data.content);
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
          tableno={tableno}
        />
      )}
    </div>
  );
};

export default Livestream;
