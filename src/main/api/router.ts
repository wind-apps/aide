import { router } from './trpc'
import { itemRouter } from './schemas/item'
import { navigationRouter } from './schemas/navigation'
import { homeRouter } from './schemas/home'
import { searchRouter } from './schemas/search'
import { askRouter } from './schemas/ask'

export const appRouter = router({
  item: itemRouter,
  navigation: navigationRouter,
  home: homeRouter,
  search: searchRouter,
  ask: askRouter
})

export type AppRouter = typeof appRouter
