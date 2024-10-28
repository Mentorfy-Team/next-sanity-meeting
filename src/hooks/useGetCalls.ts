import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = (user_id: string) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const client = useStreamVideoClient();

  useEffect(() => {
    const loadCalls = async () => {
      if (!client) return;
      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user_id },
              { members: { $in: [user_id] } },
            ],
          },
        });
        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();
  }, [client, user_id]);

  const now = new Date();

  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  };
};
