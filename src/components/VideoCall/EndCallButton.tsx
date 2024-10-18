"use client";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/userStore";

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const { isModerator } = useUserStore();

  // const isMeetingOwner =
  //   localParticipant &&
  //   call?.state.createdBy &&
  //   localParticipant.userId === call.state.createdBy.id;

  if (!isModerator) return null;
  return (
    <Button
      onClick={async () => {
        await call.endCall();
        router.push("/");
      }}
      className="bg-red-500"
    >
      Encerrar reunião
    </Button>
  );
};

export default EndCallButton;
