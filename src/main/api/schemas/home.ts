import { publicProcedure, router } from '@main/api/trpc'
import vine from '@vinejs/vine'
import { validateSchema } from '../utils'

const HomeListInput = vine.object({
  after: vine.string().optional(),
}).optional()

export const homeRouter = router({
  list: publicProcedure
    .input(validateSchema(HomeListInput))
    .query(async ({ input, ctx }) => {
      const currentItems = await ctx.xata.db.items
        .select(['id', 'title', 'tags'])
        .getPaginated({
          sort: input?.after ? undefined : { 'xata.updatedAt': 'desc' },
          pagination: {
            size: 30,
            // @ts-expect-error ugh
            after: input?.after,
          },
        })

      return {
        items: currentItems.records ?? [],
        pageInfo: currentItems.meta.page,
      }
    }),
})
