import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";

export const ucpRouter = createTRPCRouter({
  playerucp: protectedProcedure
    .query(async ({ ctx }) => {
      const playerucp = await ctx.db.characterUcp.findUnique({
        where: {
          userid: ctx.session.user.id,
        },
        select: {
          id: true,
          ucp: true,
          active: true,
          codeverify: true,
          coin: true,
        }
      });
      return playerucp ?? null;
    }),

  CreateUcp: protectedProcedure
    .input(z.object({ username: z.string().min(3).max(20) }))
    .mutation(async ({ ctx, input }) => {
      const existingUcp = await ctx.db.characterUcp.findUnique({
        where: {
          userid: ctx.session.user.id,
        },
      });

      if (existingUcp) {
        throw new Error("UCP already exists for this user.");
      }

      const codeverify = Math.floor(100000 + Math.random() * 900000);

      const newUcp = await ctx.db.characterUcp.create({
        data: {
          userid: ctx.session.user.id,
          ucp: input.username,
          active: 0,
          codeverify: codeverify,
          coin: 0,
        },
      });

      return newUcp;
    })

  // getCharacter: protectedProcedure
  // .input(z.object({ uuid: z.string()}))
  // .query(async ({ ctx, input }) => {
  //   const character = await ctx.db.character.findMany({
  //     where: {
  //       uuid: input.uuid,
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       level: true,
  //       levelup: true,
  //       job: true,
  //       money: true,
  //     }
  //   });
  //   return character ?? null;
  // }),
});
