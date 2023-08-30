import { z } from "zod";
import { format, startOfWeek, endOfWeek, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const homeRouter = createTRPCRouter({
  getStatus: handleGetStatus(),
});

function handleGetStatus() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/home" } })
    .input(z.object({}))
    .output(
      z.object({
        status: z.string(),
      }).required()
    )
    .query(async ({ ctx }) => {
      return {
        status: "ok",
      };
    });
}
