import { createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const GoldRouter = createTRPCRouter({
    GoldList: publicProcedure
    .query(async ({ ctx }) => {
        const GoldList = await ctx.db.goldStore.findMany();
        return GoldList;
    }),
})