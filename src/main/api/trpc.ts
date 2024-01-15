import store from '@main/store'
import { createClient } from '@main/db/xata'
import { errors } from '@vinejs/vine'
import { TRPCError, initTRPC } from '@trpc/server'
import { events } from './events'

export async function createContext() {
  // TODO: May want to watch for this to update CTX, or move to a middleware so it runs every request?
  const xataOptions = store.get('xata')
  console.log({ xataOptions })
  /**
   * As we initialise Xata with the users provided API key, we need to instantiate with that key on load,
   * then pass it to context - rather than importing the Xata client directly, which would try to use keys from the ENV
   */
  const xata = xataOptions ? createClient(xataOptions) : undefined

  return {
    xata,
    store,
    events,
  }
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createContext>().create({
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        validation: error.cause?.cause instanceof errors.E_VALIDATION_ERROR ? error.cause.cause.messages : error,
      },
    }
  },
})

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure

export const authenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.store.has('xata.apiKey') || !ctx.xata) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      xata: ctx.xata!
    }
  })
})
