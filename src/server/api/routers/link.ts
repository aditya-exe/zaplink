import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { ZodError, z } from "zod";
import { links, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { RouterOutput } from "../root";

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
      const userId = ctx.session.userId;

      const [createdLink] = await ctx.db
        .insert(links)
        .values({
          slug,
          url,
          userId,
        })
        .returning();

      if (!createdLink) {
        throw new TRPCError({
          message: "ERR: Could not create link",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return {
        id: createdLink.id,
      };
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
  getLinksByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      if (userId !== ctx.session.userId) {
        throw new TRPCError({
          message: "ERR: Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const dbLinks = (
        await ctx.db
          .select()
          .from(links)
          .where(eq(links.userId, userId))
          .orderBy(desc(links.createdAt))
          .innerJoin(users, eq(users.id, links.id))
      ).map(({ links, user }) => ({
        id: links.id,
        url: links.url,
        slug: links.slug,
        createdAt: links.createdAt,
        user: user,
      }));

      return dbLinks;
    }),
  deleteLinkById: protectedProcedure
    .input(
      z.object({
        linkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { linkId } = input;
      const userId = ctx.session.userId;

      const [deletedLink] = await ctx.db
        .delete(links)
        .where(and(eq(links.id, linkId), eq(links.userId, userId)))
        .returning()
        .catch((err) => {
          throw new TRPCError({
            message: `ERR: ${err}`,
            code: "INTERNAL_SERVER_ERROR",
          });
        });

      if (deletedLink) {
        return deletedLink.id;
      }
    }),
});

export type LinkWithUser = (RouterOutput["link"]["getLinksByUserId"])[number];
