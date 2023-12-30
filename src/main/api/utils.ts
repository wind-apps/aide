import type { VineObject } from '@vinejs/vine'
import vine from '@vinejs/vine'

/**
 * A simple factory function that can be used by TRPC to validate a schema
 */
// @ts-expect-error We can't pull in the base types from Vine, but this works anyway
export function validateSchema<T extends VineObject>(schema: T) {
  return (data: any) => vine.validate({
    schema,
    data,
  })
}
