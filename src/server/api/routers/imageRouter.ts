import { z } from "zod";
import { openai } from "~/server/configuration";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import ServerError from "ServerError";
import axios, { AxiosResponse } from 'axios';
import { env } from "process";

var sampleImageURL = "https://upload.wikimedia.org/wikipedia/commons/0/06/Ercole_de%27_roberti%2C_san_michele_arcangelo_louvre_01.jpg"

var printfulMockData = (image_url: string) => {
  return {
    "variant_ids": [
        4035
    ],
    "files": [
      {
        "type": "front",
        "image_url": image_url,
        "position": {
          "area_width": 1800,
          "area_height": 2400,
          "width": 1800,
          "height": 1800,
          "top": 300,
          "left": 0
        }
      }
    ]
  }
}

export const imageRouter = createTRPCRouter({
  createImage: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(
      async ({ input }): Promise<{ imageUrl: string } | ServerError> => {
        try {
          const response = await openai.createImage({
            prompt: input.text,
            n: 1,
            size: "1024x1024",
          });
          console.log(response, "this is the response");
          
          if (response.data.data[0]) {
            const imageUrl = response.data.data[0].url ?? "";
            return { imageUrl };
          }
          console.log("createImage RPC throwing");
          throw new Error();
        } catch (error) {
          console.log("createImage RPC catch");
          console.log(error)
          return new ServerError("No image found");
        }
      }
    ),
});
