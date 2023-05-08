import { OpenAIApi, Configuration } from "openai";
import { env } from "~/env.mjs";
import Stripe from "stripe";

export const openai = new OpenAIApi(
  new Configuration({
    apiKey: env.OPEN_AI_API_KEY,
  })
);

export const stripe = new Stripe(env.STRIPE_SK, {
  apiVersion: "2022-11-15",
});
