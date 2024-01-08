import vine from '@vinejs/vine'
import { publicProcedure, router } from '@main/api/trpc'
import { validateSchema } from '../utils'

const SearchItemInput = vine.object({
  query: vine.string(),
})

export const searchRouter = router({
  items: publicProcedure
    .input(validateSchema(SearchItemInput))
    .query(async ({ ctx, input }) => {
    // TODO: Update to add pagination
      const items = await ctx.xata.db.items.search(input.query, {
        fuzziness: 2,
        prefix: 'phrase',
        target: ['title', 'tags'],
      })

      return items.records
    }),
})
