import type { ItemsRecord } from '@main/db/generated'
import vine from '@vinejs/vine'
import { observable } from '@trpc/server/observable'
import { publicProcedure, router } from '@main/api/trpc'
import { validateSchema } from '../utils'

const createInput = vine.object({
  title: vine.string().minLength(1),
  tags: vine.array(vine.string().minLength(1)).minLength(0),
  content: vine.any().optional(),
  textContent: vine.string().optional(),
})

const updateInput = vine.object({
  id: vine.string(),
  title: vine.string().minLength(1).optional(),
  tags: vine.array(vine.string().minLength(1)).minLength(0).optional(),
  content: vine.any().optional(),
  textContent: vine.string().optional(),
})

const deleteInput = vine.object({
  id: vine.string(),
})

export const itemRouter = router({
  list: publicProcedure
    .query(async ({ ctx }) => {
      const items = ctx.xata.db.items

      return items.getPaginated()
    }),
  item: publicProcedure
    .input(validateSchema(vine.object({ id: vine.string() })))
    .query(async ({ input, ctx }) => {
      return await ctx.xata.db.items.getFirst({ filter: { id: { $is: input.id } } })
    }),
  create: publicProcedure
    .input(validateSchema(createInput))
    .mutation(async ({ input, ctx }) => {
      // TODO: Handle upserting + joining tags

      const item = await ctx.xata.db.items.create(input)
      ctx.events.item.emit('create', item)
      return item
    }),
  update: publicProcedure
    .input(validateSchema(updateInput))
    .mutation(async ({ input, ctx }) => {
      // TODO: Handle upserting + joining tags

      const item = await ctx.xata.db.items.update(input)
      if (item) {
        ctx.events.item.emit('update', item)
      }
      return item
    }),
  delete: publicProcedure
    .input(validateSchema(deleteInput))
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.xata.db.items.delete(input)
      if (item) {
        ctx.events.item.emit('delete', item)
      }
      return item
    }),
  subscribe: publicProcedure.subscription(({ ctx }) => {
    return observable<ItemsRecord>((emit) => {
      const onChange = (data: ItemsRecord) => emit.next(data)

      ctx.events.item.on(['create', 'update', 'delete'], onChange)

      return () => {
        ctx.events.item.off(['create', 'update', 'delete'], onChange)
      }
    })
  }),
  tags: publicProcedure
    .input(validateSchema(vine.object({ query: vine.string().optional() })))
    .query(async ({ input, ctx }) => {
      if (typeof input.query === 'string') {
        // If we have a query, search for tags with this value
        const { records } = await ctx.xata.search.byTable(input.query, {
          tables: [{ table: 'items', target: [{ column: 'tags' }] }],
          fuzziness: 2,
          prefix: 'phrase',
        })

        if (!records.items) { return [] }

        const uniqueTags = new Set(records.items?.flatMap(item => item.tags ?? []))
        return Array.from(uniqueTags)
      }

      // If no query, get some recently used tags
      const items = await ctx.xata.db.items.sort('xata.updatedAt', 'desc').select(['tags']).getMany()

      const uniqueTags = new Set(items.flatMap(item => item.tags ?? []))
      return Array.from(uniqueTags)
    }),
})
