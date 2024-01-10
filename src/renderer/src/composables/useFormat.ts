import { DateTime } from 'luxon'

/** Helper functions that are used throughout the app. */
export function useFormat() {
  /** Format an ISO date to a string. If no value is provided, it will default to the current time. */
  const formatDate = (value?: string) => {
    const date = typeof value === 'string' ? DateTime.fromISO(value) : DateTime.now()
    return date.toFormat('DDDD')
  }

  return {
    formatDate,
  }
}
