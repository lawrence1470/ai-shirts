import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { stripe } from "../../configuration";
import { env } from "~/env.mjs";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const newProduct = await stripe.products.create({
        name: "T-shirt",
        images: [input.url],
      });

      const productID = newProduct.id;

      const newPrice = await stripe.prices.create({
        unit_amount: 2000,
        currency: "usd",
        product: productID,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: newPrice.id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url:
          env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://example.com/cancel",
        cancel_url:
          env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://example.com/cancel",
      });
      return session.url;
    }),
});
