import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createOpenApiNextHandler } from "trpc-openapi";
import { env } from "@/../env.mjs";

// export API handler
const OpenApiNextHandler = createOpenApiNextHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

export default OpenApiNextHandler;
