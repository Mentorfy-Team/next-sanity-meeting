import { z } from "zod";
import { format, startOfWeek, endOfWeek, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import xml2js from "xml2js";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { BigBlueButtonAPI } from "../../utils/BBB-API";

export const meetingRouter = createTRPCRouter({
  createRoom: handleCreateRoom(),
  joinAsModerator: handleJoinAsModerator(),
  joinAsAttendee: handleJoinAsAttendee(),
});

function handleJoinAsModerator() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/room/:meetingID" } })
    .input(z.object({ meetingID: z.string() }))
    .output(z.object({
      returncode: z.string(),
      messageKey: z.string(),
      message: z.string(),
      meeting_id: z.string(),
      user_id: z.string(),
      auth_token: z.string(),
      session_token: z.string(),
      guestStatus: z.string(),
      url: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { meetingID } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data } = await bbb.joinAsModerator("Teste", meetingID);
      console.log('data', data)

      if(data?.response?.message){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const {response} = (await convertXmlToObject(data)) as {response: MeetingJoin};
      console.log('response', response)
      return response;
    });
}

function handleJoinAsAttendee() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/room/:meetingID" } })
    .input(z.object({ meetingID: z.string() }))
    .output(z.object({
      returncode: z.string(),
      messageKey: z.string(),
      message: z.string(),
      meeting_id: z.string(),
      user_id: z.string(),
      auth_token: z.string(),
      session_token: z.string(),
      guestStatus: z.string(),
      url: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { meetingID } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data, request } = await bbb.joinAsAttendee("Teste", meetingID);
      console.log('data', data);
      console.log('data', request.path);

      if(data?.response?.message){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const {response} = (await convertXmlToObject(data)) as {response: MeetingJoin};
      console.log('response', response)
      return response;
    });
}

function handleCreateRoom() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/room" } })
    .input(z.object({
      name: z.string(),
      owner: z.string().optional(),
    }))
    .output(
      z.object({
        returncode: z.string(),
        meetingID: z.string(),
        internalMeetingID: z.string(),
        parentMeetingID: z.string(),
        attendeePW: z.string().optional(),
        moderatorPW: z.string().optional(),
        createTime: z.string(),
        voiceBridge: z.string().optional(),
        dialNumber: z.string().optional(),
        createDate: z.string(),
        hasUserJoined: z.string(),
        duration: z.string().optional(),
        hasBeenForciblyEnded: z.string().optional(),
        messageKey: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { name } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const meetingID = format(new Date(), "yyyyMMddHHmmss", {
        locale: ptBR,
      });

      const { data } = await bbb.createRoom(name);
      
      if(data?.response?.message){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const {response} = (await convertXmlToObject(data)) as {response: MeetingCreated};
      console.log(response);

      return {
        ...response,
      };
    });
}

function convertXmlToObject(xmlString: string) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, { explicitArray: false }, (err: any, result: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export type MeetingCreated = {
  returncode: string;
  meetingID: string;
  internalMeetingID: string;
  parentMeetingID: string;
  attendeePW: string;
  moderatorPW: string;
  createTime: string;
  voiceBridge: string;
  dialNumber: string;
  createDate: string;
  hasUserJoined: string;
  duration: string;
  hasBeenForciblyEnded: string;
  messageKey: string;
  message: string;
};

type MeetingJoin = {
  returncode: string;
  messageKey: string;
  message: string;
  meeting_id: string;
  user_id: string;
  auth_token: string;
  session_token: string;
  guestStatus: string;
  url: string;
};
