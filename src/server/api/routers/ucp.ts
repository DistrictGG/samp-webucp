import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";

export const ucpRouter = createTRPCRouter({
  playerucp: protectedProcedure
    .input(z.object({ uuid: z.string()}))
    .query(async ({ ctx, input }) => {
      const playerucp = await ctx.db.characterUcp.findUnique({
        where: {
          userid: input.uuid,
        },
        select: {
          ucp: true,
          password: true,
        }
      });
      return playerucp ?? null;
    }),
});
