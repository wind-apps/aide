import { initTRPC } from '@trpc/server'
import { errors } from '@vinejs/vine'

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create({
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
