import { router } from './trpc'
import { itemRouter } from './schemas/item'
import { navigationRouter } from './schemas/navigation'

export const appRouter = router({
  item: itemRouter,
  navigation: navigationRouter,
})

export type AppRouter = typeof appRouter
