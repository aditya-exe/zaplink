import { ZodError, z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { links } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const linkRouter = createTRPCRouter({
  slugCheck: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { slug } = input;

      try {
        const dbSlug = await ctx.db.query.links.findFirst({
          where: eq(links.slug, slug),
        });

        if (dbSlug) {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        if (err instanceof ZodError) {
          throw new TRPCError({
            message: "ERROR: Zod Error",
            code: "UNPROCESSABLE_CONTENT",
          });
        }
        throw new TRPCError({
          message: "ERROR: Drizzle error most probably",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  createSlug: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(5),
        url: z.string().min(3).url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { slug, url } = input;
      const userId = ctx.session.user.id;

      await ctx.db.insert(links).values({
        slug,
        url,
        userId,
      });

      return { ok: true };
      // try {

      // } catch (err) {
      //   if (err instanceof ZodError) {
      //     throw new TRPCError({
      //       message: "ERROR: Wrong Input",
      //       code: "UNPROCESSABLE_CONTENT",
      //     });
      //   }

      //   throw new TRPCError({
      //     message: "ERROR: Could not insert",
      //     code: "INTERNAL_SERVER_ERROR",
      //   });
      // }
    }),
  getLink: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { slug } = input;

      const dbLink = await ctx.db.query.links.findFirst({
        where: eq(links.slug, slug),
      });

      return dbLink;
    }),
});
