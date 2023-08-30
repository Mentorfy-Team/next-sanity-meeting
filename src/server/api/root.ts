import { homeRouter } from "./routers/home";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  // routes
  home: homeRouter,
});

export type AppRouter = typeof appRouter;