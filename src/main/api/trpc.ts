import { initTRPC } from '@trpc/server'
import { errors } from '@vinejs/vine'
import xata from '@main/db/xata'

export async function createContext() {
  // TODO: Adding Xata here, as later we will want to pass in our own API key
  return {
    xata
  }
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createContext>().create({
  errorFormatter: ({shape, error}) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        validation: error.cause?.cause instanceof errors.E_VALIDATION_ERROR ? error.cause.cause.messages : error
      }
    }
  }
})

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router
export const publicProcedure = t.procedure
