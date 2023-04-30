import { z } from "zod";
import { openai } from "~/server/configuration";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  createImage: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(
      async ({ input }): Promise<{ imageUrl: string } | serverError> => {
        console.log("here");
        try {
          const response = await openai.createImage({
            prompt: input.text,
            n: 1,
            size: "512x512",
          });
          console.log(response, "this is the response");
          if (response.data.data[0]) {
            const imageUrl = response.data.data[0].url;
            if (imageUrl) {
              return { imageUrl };
            }
          }
          throw new Error("No image found");
        } catch (error) {
          return { message: "No image found" };
        }
      }
    ),
});
