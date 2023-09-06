import { z } from "zod";
import { format, startOfWeek, endOfWeek, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import xml2js from "xml2js";
import { cookies } from 'next/headers'

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { BigBlueButtonAPI } from "../../utils/BBB-API";
import { saveSetCookies } from "./functions";
import { SupabaseAdmin } from "../../utils/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/@types/supabase/v2.types";

export const meetingRouter = createTRPCRouter({
  createRoom: handleCreateRoom(),
  joinAsModerator: handleJoinAsModerator(),
  joinAsAttendee: handleJoinAsAttendee(),
  getRoom: handleGetRoom(),
  getRecordings: handleGetRecordings(),
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

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingJoin };

      saveSetCookies(headers);

      return { ...response, cookie: headers["set-cookie"] };
    });
}

function handleJoinAsAttendee() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/join-room" } })
    .input(z.object({
      meetingID: z.string(),
      name: z.string(),
      password: z.string().optional(),
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
      const { meetingID, name, password } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const supabase = createServerActionClient<Database>({ cookies });

      const { data: userResponse } = await supabase.auth.getUser();

      const { data: meeting } = await supabase.from("meeting")
        .select("*")
        .or(`friendly_id.eq.${meetingID}`)
        .single();

      if (!meeting) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sala não encontrada",
        });
      }

      const { data: meetingResponse } = await bbb.createRoom({
        meetingID: meeting.friendly_id,
        guestPolicy: "ALWAYS_ACCEPT",
        roomName: meeting.room_name!,
        ...(meeting.configs as {}),
      });

      if (meetingResponse?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: meetingResponse.response.message,
        });
      }
      const { response: createdMeeting } = (await convertXmlToObject(meetingResponse)) as { response: MeetingCreated };

      const isMod = userResponse?.user?.id === meeting?.owner_id;

      const { data, headers } = await bbb.joinAsAttendee(name, createdMeeting.meetingID, password, isMod);

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingJoin };

      saveSetCookies(headers);

      return { ...response };
    });
}

function handleCreateRoom() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/create-room" } })
    .input(z.object({
      meetingID: z.string(),
      owner: z.string().optional(),
      roomName: z.string().optional(),
      guestPolicy: z.string().optional(),
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
      const { meetingID, guestPolicy, owner, roomName } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data } = await bbb.createRoom({
        meetingID, guestPolicy, roomName: roomName || 'Sala de Reunião', moderatorPW: "mp", owner
      });

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingCreated };
      console.log(response);

      return {
        ...response,
      };
    });
}

function handleGetRecordings() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/recordings" } })
    .input(z.object({
      meetingID: z.string().optional(),
      recordID: z.string().optional(),
    }))
    .output(
      z.object({
        returncode: z.string(),
        recordings: z.union([z.string(), z.array(z.object({
          recordID: z.string(),
          meetingID: z.string(),
          internalMeetingID: z.string(),
          name: z.string(),
          isBreakout: z.boolean(),
          published: z.boolean(),
          state: z.string(),
          startTime: z.number(),
          endTime: z.number(),
          participants: z.number(),
          metadata: z.object({
            isBreakout: z.boolean(),
            meetingName: z.string(),
            "gl-listed": z.boolean(),
            meetingId: z.string(),
          }),
          playback: z.object({
            format: z.array(z.object({
              type: z.string(),
              url: z.string().url(),
              processingTime: z.number(),
              length: z.number(),
              preview: z.object({
                images: z.array(z.object({
                  width: z.number(),
                  height: z.number(),
                  alt: z.string(),
                  content: z.string().url(),
                })),
              }).optional(),
            })),
          }),
        }))]),
        messageKey: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input: { meetingID, recordID } }) => {

      const bbb = new BigBlueButtonAPI();

      const { data: meetings } = await bbb.getMeetings();

      const { data } = await bbb.getRecordings(meetingID, recordID);

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response: resmeetings } = (await convertXmlToObject(meetings)) as { response: MeetingRecordings };
      const { response } = (await convertXmlToObject(data)) as { response: MeetingRecordings };

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
        appointment_date: z.string().nullable().refine(date => date && !isNaN(Date.parse(date)), {
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
        .eq("friendly_id", meetingID)
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

type MeetingRecordings = {
  returncode: string;
  recordings: Recording[];
};

type Recording = {
  recordID: string;
  meetingID: string;
  internalMeetingID: string;
  name: string;
  isBreakout: boolean;
  published: boolean;
  state: string;
  startTime: number;
  endTime: number;
  participants: number;
  metadata: Metadata;
  playback: Playback;
};

type Metadata = {
  isBreakout: boolean;
  meetingName: string;
  "gl-listed": boolean;
  meetingId: string;
};

type Playback = {
  format: Format[];
};

type Format = {
  type: string;
  url: string;
  processingTime: number;
  length: number;
  preview?: Preview;
};

type Preview = {
  images: Image[];
};

type Image = {
  width: number;
  height: number;
  alt: string;
  content: string;
};