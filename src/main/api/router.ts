import { observable } from '@trpc/server/observable'
import { type } from 'arktype'
import Emittery from 'emittery'
import type { ItemsRecord } from '../db/generated'
import xata from '../db/xata'
import { publicProcedure, router } from './trpc'

const item = type({
  title: 'string',
})

interface Events {
  'create': ItemsRecord
}

const ee = new Emittery<Events>()

export const appRouter = router({
  itemsList: publicProcedure
    .query(async () => {
      const items = await xata.db.items.getAll()

      return items
    }),
  itemById: publicProcedure
    .input(type({ id: 'string' }).assert)
    .query(async ({ input }) => {
      return await xata.db.items.getFirst({ filter: { id: { $is: input.id } } })
    }),
  itemCreate: publicProcedure
    .input(item.assert)
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

export type AppRouter = typeof appRouter
