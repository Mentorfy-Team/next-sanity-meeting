import { homeRouter } from "./routers/home";
import { meetingRouter } from "./routers/meeting";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  // routes
  home: homeRouter,
  meeting: meetingRouter,
});

export type AppRouter = typeof appRouter;