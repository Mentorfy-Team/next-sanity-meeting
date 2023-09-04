import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "./api/root";

/* 👇 */
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  description: "OpenAPI compliant REST API built using tRPC with Next.js",
  version: "1.0.0",
  baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL + "/api",
});
