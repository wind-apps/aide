import Store from 'electron-store'

const schema = {
  initialSetup: {
    type: 'boolean'
  },
  xata: {
    type: 'object',
    properties: {
      apiKey: {
        type: 'string',
      },
      branch: {
        type: 'string',
        default: 'main',
      },
      workspace: {
        type: 'string',
      },
      database: {
        type: 'string',
      },
      region: {
        type: 'string',
      },
    },
  },
}

export interface StoreShape {
  initialSetup?: boolean
  xata?: {
    apiKey: string
    /** The database branch - usually `main` */
    branch: string
    /** The workspace ID */
    workspace: string
    /** The database name */
    database: string
    /** The database region */
    region: string
  }
}

export const store = new Store<StoreShape>({
  clearInvalidConfig: true,
  // @ts-expect-error Not sure what this is shouting about - maybe incorrect typings?
  schema,
})

// Wipe the store
// store.clear()

export default store
