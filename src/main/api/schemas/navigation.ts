import { publicProcedure, router } from '@main/api/trpc'
import type { XataClient } from '@main/db/generated'
import { observable } from '@trpc/server/observable'

/**
 * I decided I should try splitting routers up into what part of the UI they relate to,
 * instead of creating generic routers + procedures for each record type (item.list, item.getById etc.),
 * and then having to pass those input params in on the frontend.
 *
 * This isn't a public API, I don't need those generic methods, so I think this way works quite well!
 */

async function getRecentItems(xata: XataClient) {
  const recentItems = await xata.db.items
    .select(['id', 'title'])
    .getMany({
      pagination: { size: 10 },
      sort: { 'xata.updatedAt': 'desc' },
    })

  return recentItems
}

export const navigationRouter = router({
  recentItems: publicProcedure.query(async ({ ctx }) => {
    return await getRecentItems(ctx.xata)
  }),
  subscribeRecentItems: publicProcedure.subscription(({ ctx }) => {
    return observable<Awaited<ReturnType<typeof getRecentItems>>>((emit) => {
      const onChange = async () => {
        const recentItems = await getRecentItems(ctx.xata)

        emit.next(recentItems)
      }

      ctx.events.item.on(['create', 'update', 'delete'], onChange)

      return () => {
        ctx.events.item.off(['create', 'update', 'delete'], onChange)
      }
    })
  }),
})
