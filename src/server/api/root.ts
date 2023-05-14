import { createTRPCRouter } from "~/server/api/trpc";
import { imageRouter } from "~/server/api/routers/imageRouter";
import { printfulRouter } from "~/server/api/routers/printfulRouter";
import { stripeRouter } from "~/server/api/routers/stripeRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  imageRouter: imageRouter,
  printfulRouter: printfulRouter,
  stripeRouter: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
