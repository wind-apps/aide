import vine from '@vinejs/vine'
import { authenticatedProcedure, publicProcedure, router } from '@main/api/trpc'
import { TRPCError } from '@trpc/server'
import { XataApiClient } from '@xata.io/client'
import { validateSchema } from '../utils'

export const authRouter = router({
  isAuthenticated: publicProcedure
    .query(async ({ ctx }) => {
      const xata = ctx.store.get('xata')

      // TODO: Move this to another setup check? We need to check if we have migrated as well.
      const hasAllKeys = xata && xata.apiKey && xata.region && xata.database && xata.workspace
      if (!hasAllKeys) return false

      const user = await ctx.xata?.api.user.getUser()
      return !!user
    }),
  authenticate: publicProcedure
    .input(validateSchema(vine.object({ apiKey: vine.string() })))
    .mutation(async ({ input, ctx }) => {
      // Make test request to Xata, to make sure key works
      try {
        const client = new XataApiClient({ apiKey: input.apiKey })

        await client.user.getUser()
      }
      catch (error) {
        throw new TRPCError({ message: 'Failed to authenticate with this key', code: 'UNAUTHORIZED' })
      }

      // Save key to store
      ctx.store.set('xata.apiKey', input.apiKey)
    }),
  listWorkspaces: authenticatedProcedure.query(async ({ ctx }) => {
    const { workspaces } = await ctx.xata.api.workspaces.getWorkspacesList()
    return workspaces
  }),
  saveWorkspace: authenticatedProcedure.input(validateSchema(vine.object({ workspaceId: vine.string() })))
    .mutation(async ({ input, ctx }) => {
      ctx.store.set('xata.workspace', input.workspaceId)
    }),
  createWorkspace: authenticatedProcedure
    .input(validateSchema(vine.object({ name: vine.string() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const workspace = await ctx.xata.api.workspaces.createWorkspace({ data: { name: input.name } })

        ctx.store.set('xata.workspace', workspace.id)
      }
      catch (err) {
        const error = err as Error
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
      }
    }),
  listDatabases: authenticatedProcedure
    .input(validateSchema(vine.object({ workspaceId: vine.string().optional() }))).query(async ({ ctx, input }) => {
      const workspaceId = input.workspaceId ?? ctx.store.get('xata.workspace')
      if (!workspaceId) {
        throw new TRPCError({ message: 'Missing the workspace ID to fetch databases for.', code: 'BAD_REQUEST' })
      }

      const { databases } = await ctx.xata.api.database.getDatabaseList({ workspace: workspaceId })
      return databases
    }),
  listDatabaseRegions: authenticatedProcedure.query(async ({ ctx }) => {
    const workspaceId = ctx.store.get('xata.workspace')
    if (typeof workspaceId !== 'string') { throw new TRPCError({ message: 'Missing required workspace ID', code: 'BAD_REQUEST' }) }

    const { regions } = await ctx.xata.api.database.listRegions({ workspace: workspaceId })

    return regions
  }),
  saveDatabase: authenticatedProcedure.input(validateSchema(vine.object({ database: vine.string() })))
    .mutation(async ({ input, ctx }) => {
      const workspaceId = ctx.store.get('xata.workspace')
      if (typeof workspaceId !== 'string') { throw new TRPCError({ message: 'Missing required workspace ID', code: 'BAD_REQUEST' }) }

      const database = await ctx.xata.api.database.getDatabaseMetadata({ workspace: workspaceId, database: input.database })

      ctx.store.set('xata.database', input.database)
      ctx.store.set('xata.region', database.region)
    }),
  createDatabase: authenticatedProcedure
    .input(validateSchema(vine.object({ name: vine.string(), region: vine.string() })))
    .mutation(async ({ ctx, input }) => {
      const workspaceId = ctx.store.get('xata.workspace')
      if (typeof workspaceId !== 'string') { throw new TRPCError({ message: 'Missing required workspace ID', code: 'BAD_REQUEST' }) }

      try {
        const database = await ctx.xata.api.database.createDatabase({
          database: input.name,
          workspace: workspaceId,
          data: {
            region: input.region,
          },
        })

        ctx.store.set('xata.database', database.databaseName)
        ctx.store.set('xata.region', input.region)
      }
      catch (err) {
        const error = err as Error
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
      }
    }),
})
