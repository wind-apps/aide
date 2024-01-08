import { observable } from '@trpc/server/observable'
import type { VineObject } from '@vinejs/vine'
import vine from '@vinejs/vine'
import Emittery from 'emittery'
import type { ItemsRecord } from '@main/db/generated'
import xata from '@main/db/xata'
import { publicProcedure, router } from '@main/api/trpc'

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

// @ts-expect-error We can't pull in the base types from Vine, but this works anyway
function validateSchema<T extends VineObject>(schema: T) {
  return (data: any) => vine.validate({
    schema,
    data,
  })
}

interface Events {
  'create': ItemsRecord
  'update': ItemsRecord
  'delete': ItemsRecord
}

const ee = new Emittery<Events>()

export const itemRouter = router({
  list: publicProcedure
    .query(async () => {
      const items = xata.db.items

      return items.getPaginated()
    }),
  item: publicProcedure
    .input(validateSchema(vine.object({ id: vine.string() })))
    .query(async ({ input }) => {
      return await xata.db.items.getFirst({ filter: { id: { $is: input.id } } })
    }),
  create: publicProcedure
    .input(validateSchema(createInput))
    .mutation(async ({ input }) => {
      const item = await xata.db.items.create(input)
      ee.emit('create', item)
      return item
    }),
  update: publicProcedure
    .input(validateSchema(updateInput))
    .mutation(async ({ input }) => {
      const item = await xata.db.items.update(input)
      if (item) { ee.emit('update', item) }
      return item
    }),
  delete: publicProcedure
    .input(validateSchema(deleteInput))
    .mutation(async ({ input }) => {
      const item = await xata.db.items.delete(input)
      if (item) { ee.emit('delete', item) }
      return item
    }),
  subscribe: publicProcedure.subscription(() => {
    return observable<ItemsRecord>((emit) => {
      const onCreate = (data: ItemsRecord) => emit.next(data)
      const onUpdate = (data: ItemsRecord) => emit.next(data)
      const onDelete = (data: ItemsRecord) => emit.next(data)

      ee.on('create', onCreate)
      ee.on('update', onUpdate)
      ee.on('delete', onDelete)

      return () => {
        ee.off('create', onCreate)
        ee.off('update', onUpdate)
        ee.off('delete', onDelete)
      }
    })
  }),
  tags: publicProcedure
    .input(validateSchema(vine.object({ query: vine.string().optional() })))
    .query(async ({ input }) => {
      if (typeof input.query === 'string') {
        // If we have a query, search for tags with this value
        const { records } = await xata.search.byTable(input.query, {
          tables: [{ table: 'items', target: [{ column: 'tags' }] }],
          fuzziness: 2,
          prefix: 'phrase',
        })

        if (!records.items) { return [] }

        const uniqueTags = new Set(records.items?.flatMap(item => item.tags ?? []))
        return Array.from(uniqueTags)
      }

      // If no query, get some recently used tags
      const items = await xata.db.items.sort('xata.updatedAt', 'desc').select(['tags']).getMany()

      const uniqueTags = new Set(items.flatMap(item => item.tags ?? []))
      return Array.from(uniqueTags)
    }),
})
