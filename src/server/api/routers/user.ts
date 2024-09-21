import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  editProfile: protectedProcedure
    .input(
      z.object({
        newUsername: z.string().optional(),
        newAvatar: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { newUsername, newAvatar } = input;
      const userId = ctx.session.userId;

      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          username: newUsername,
          image: newAvatar,
        })
        .where(eq(users.id, userId))
        .returning()
        .catch((err) => {
          console.error(err);
          throw new TRPCError({
            message: "ERROR: Could not update user details",
            code: "INTERNAL_SERVER_ERROR",
          });
        });

      return updatedUser;
    }),
});
