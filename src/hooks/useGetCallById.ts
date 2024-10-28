import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCalLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      const call = client.call('default', id as string);

      setCall(call);
      setIsCalLoading(false);
    };
    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
