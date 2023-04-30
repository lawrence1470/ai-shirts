import { OpenAIApi, Configuration } from "openai";
import { env } from "~/env.mjs";

export const openai = new OpenAIApi(
  new Configuration({
    apiKey: env.OPEN_AI_API_KEY,
  })
);
