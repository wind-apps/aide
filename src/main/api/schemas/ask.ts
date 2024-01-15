import vine from '@vinejs/vine'
import { authenticatedProcedure, router } from '@main/api/trpc'
import { validateSchema } from '../utils'

const AskInput = vine.object({
  query: vine.string(),
})

export const askRouter = router({
  items: authenticatedProcedure
    .input(validateSchema(AskInput))
    .query(async ({ ctx, input }) => {
      const response = await ctx.xata.db.items.ask(input.query, {
        searchType: 'keyword',
        search: {
          fuzziness: 2,
          target: ['tags', 'textContent', 'title'],
          prefix: 'phrase',
        },
      })

      if (!response.records) {
        return {
          answer: response.answer,
          items: [],
        }
      }

      const records = await ctx.xata.db.items.filter({
        id: { $any: response.records },
      }).getAll()

      return {
        answer: response.answer,
        items: records,
      }
    }),
})
