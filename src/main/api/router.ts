import { router } from './trpc'
import { itemRouter } from './schemas/item'
import { navigationRouter } from './schemas/navigation'
import { homeRouter } from './schemas/home'
import { searchRouter } from './schemas/search'
import { askRouter } from './schemas/ask'
import { authRouter } from './schemas/auth'
import { migrationsRouter } from './schemas/migrations'

export const appRouter = router({
  auth: authRouter,
  item: itemRouter,
  navigation: navigationRouter,
  home: homeRouter,
  search: searchRouter,
  ask: askRouter,
  migrations: migrationsRouter,
})

export type AppRouter = typeof appRouter
