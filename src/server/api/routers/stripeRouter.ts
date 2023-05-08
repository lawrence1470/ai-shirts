import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { stripe } from "../../configuration";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure.mutation(async () => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1N3Vf5G3GNklxqpo33rWf7wE",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });
    return session.url;
  }),
});
