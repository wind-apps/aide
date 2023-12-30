import { router } from './trpc'
import { itemRouter } from './schemas/item'
import { navigationRouter } from './schemas/navigation'
import { homeRouter } from './schemas/home'

export const appRouter = router({
  item: itemRouter,
  navigation: navigationRouter,
  home: homeRouter,
})

export type AppRouter = typeof appRouter
