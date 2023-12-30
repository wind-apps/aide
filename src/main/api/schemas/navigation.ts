import { publicProcedure, router } from '@main/api/trpc'

/**
 * I decided I should try splitting routers up into what part of the UI they relate to,
 * instead of creating generic routers + procedures for each record type (item.list, item.getById etc.),
 * and then having to pass those input params in on the frontend.
 *
 * This isn't a public API, I don't need those generic methods, so I think this way works quite well!
 */

export const navigationRouter = router({
  header: publicProcedure.query(async ({ ctx }) => {
    const recentItems = await ctx.xata.db.items
    .select(['id', 'title'])
    .getMany({
      pagination: { size: 10 },
      sort: { 'xata.updatedAt': 'desc' },
    })

    return {
      recent: recentItems,
    }
  }),
})
