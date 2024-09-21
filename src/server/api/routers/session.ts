import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { sessions } from "~/server/db/schema";

export const sessionRouter = createTRPCRouter({
  getAllSessionFromIp: publicProcedure
    .input(z.object({ ip: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      const { ip } = input;

      // if(!ip) {
      //   return [];
      // }

      return await ctx.db
        .select()
        .from(sessions)
        .where(eq(sessions.ip, ip!));
    }),
});
