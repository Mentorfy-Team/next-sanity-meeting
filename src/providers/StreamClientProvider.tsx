"use client";

import Loader from "@/components/VideoCall/Loader";
import { useUserStore } from "@/hooks/userStore";
import { StreamVideoClient, StreamVideo, StreamTheme } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
import { tokenProvider } from "@/actions/stream.action";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { id: userId, name: userName, setToken, setApiKey } = useUserStore();

  useEffect(() => {
    const init = async () => {
      if (!userName || !userId) return;
      if (!apiKey) throw new Error("Stream API key is missing");
      const token = await tokenProvider(userId);

      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: userId,
          name: userName,
        },
        token: token,
      });

      setVideoClient(client);
      setToken(token);
      setApiKey(apiKey);
    };

    init();
  }, [userName, userId]);

  if (!videoClient) return <Loader />;
  return <StreamTheme><StreamVideo client={videoClient}>{children}</StreamVideo></StreamTheme>;
};

export default StreamVideoProvider;
