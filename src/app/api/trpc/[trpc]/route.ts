import { appRouter } from "@/server/api/root";
import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { env } from "@/../env.mjs";

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function (
      opts: FetchCreateContextFnOptions,
    ): object | Promise<object> {
      return {};
    },
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

export { handler as GET, handler as POST };
