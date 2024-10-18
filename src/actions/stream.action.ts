"use server";

import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async (userId: string) => {
  if (!userId) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("No API key");
  if (!apiSecret) throw new Error("No API secret");

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  const issued = Math.floor(Date.now() / 1000) - 60;

  const validity_in_seconds = 60 * 60 * 24;

  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds,
    exp,
    issued,
  });
  return token;
};
