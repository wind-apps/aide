import Store from 'electron-store'

const schema = {
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
    },
  },
}

export const store = new Store({
  clearInvalidConfig: true,
  // @ts-expect-error Not sure what this is shouting about - maybe incorrect typings?
  schema,
})

// Wipe the store
// store.clear()

export default store
