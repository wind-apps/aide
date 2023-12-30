import { observable } from '@trpc/server/observable'
import type { VineObject } from '@vinejs/vine'
import vine from '@vinejs/vine'
import Emittery from 'emittery'
import type { ItemsRecord } from '@main/db/generated'
import xata from '@main/db/xata'
import { publicProcedure, router } from '@main/api/trpc'

const item = vine.object({
  title: vine.string().minLength(1),
  tags: vine.array(vine.string().minLength(1)).minLength(0),
  content: vine.any().optional(),
  textContent: vine.string().optional(),
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
}

const ee = new Emittery<Events>()

export const itemRouter = router({
  list: publicProcedure
    .query(async () => {
      const items = xata.db.items

      return items.getPaginated()
    }),
  itemById: publicProcedure
    .input(validateSchema(vine.object({ id: vine.string() })))
    .query(async ({ input }) => {
      return await xata.db.items.getFirst({ filter: { id: { $is: input.id } } })
    }),
  itemCreate: publicProcedure
    .input(validateSchema(item))
    .mutation(async ({ input }) => {
      const item = await xata.db.items.create(input)
      ee.emit('create', item)
      return item
    }),
  itemSub: publicProcedure.subscription(() => {
    return observable<ItemsRecord>((emit) => {
      const onCreate = (data: ItemsRecord) => emit.next(data)

      ee.on('create', onCreate)

      return () => {
        ee.off('create', onCreate)
      }
    })
  }),
})
