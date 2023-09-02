import { z } from "zod";
import { format, startOfWeek, endOfWeek, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import xml2js from "xml2js";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { BigBlueButtonAPI } from "../../utils/BBB-API";
import { saveSetCookies } from "./functions";
import { SupabaseAdmin } from "../../utils/supabase";

export const meetingRouter = createTRPCRouter({
  createRoom: handleCreateRoom(),
  joinAsModerator: handleJoinAsModerator(),
  joinAsAttendee: handleJoinAsAttendee(),
  getRoom: handleGetRoom(),
});

function handleJoinAsModerator() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/join-room-mod" } })
    .input(z.object({ 
      meetingID: z.string(),
      name: z.string(),
    }))
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
      cookie: z.any(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { meetingID, name } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data, headers } = await bbb.joinAsModerator(name, meetingID);

      if(data?.response?.message){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const {response} = (await convertXmlToObject(data)) as {response: MeetingJoin};
      
      saveSetCookies(headers);

      return {...response, cookie: headers["set-cookie"]};
    });
}

function handleJoinAsAttendee() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/join-room" } })
    .input(z.object({ 
      meetingID: z.string(),
      name: z.string(),
    }))
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
      cookie: z.any(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { meetingID, name } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data, headers } = await bbb.joinAsAttendee(name, meetingID);

      if(data?.response?.message){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const {response} = (await convertXmlToObject(data)) as {response: MeetingJoin};
      
      saveSetCookies(headers);

      return {...response};
    });
}

function handleCreateRoom() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/create-room" } })
    .input(z.object({
      meetingID: z.string(),
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
      const { meetingID } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data } = await bbb.createRoom(meetingID);
      
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

function handleGetRoom() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/room/:meetingID" } })
    .input(z.object({
      meetingID: z.string(),
    }))
    .output(
      z.object({
        appointment_date: z.string().nullable().refine(date => !isNaN(Date.parse(date)), {
          message: 'Data inválida'
        }),
        appointment_finished_at: z.null().optional(),
        date_created: z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Data inválida'
        }),
        date_updated: z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Data inválida'
        }),
        friendly_id: z.string(),
        id: z.string().uuid(),
        invite_url: z.string().url().nullable().optional(),
        owner_id: z.string().uuid(),
        recording_url: z.string().url().nullable().optional(),
        room_name: z.string(),
        sort: z.null().optional(),
        status: z.any(),
        type: z.string(),
        url: z.string().url()
      })
    )
    .query(async ({ input: { meetingID } }) => {
      const supabase = SupabaseAdmin();

      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("id", meetingID)
        .single();


      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
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
