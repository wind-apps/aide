import type { BaseClientOptions } from '@xata.io/client'
import { XataApiClient } from '@xata.io/client'
import store from '@main/store'
import { XataClient } from './generated'

export type {
  ColumnsByValue,
} from '@xata.io/client'

function createDatabaseURL() {
  const xata = store.get('xata')
  if (!xata) { return '' }

  return `https://${xata.workspace}.${xata.region}.xata.sh/db/${xata.database}`
}

export function createClient(input: Pick<BaseClientOptions, 'apiKey' | 'branch'>) {
  const client = new XataClient({
    apiKey: input.apiKey,
    branch: input.branch,
    databaseURL: createDatabaseURL(),
  })

  const apiClient = new XataApiClient(input)

  return {
    ...client,
    api: apiClient,
  }
}

export default createClient
