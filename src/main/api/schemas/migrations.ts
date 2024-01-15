import { authenticatedProcedure, router } from '@main/api/trpc'
import { TRPCError } from '@trpc/server'

const migrationsJSON = import.meta.glob('../../../../.xata/migrations/*.json', { eager: true, import: 'default' })

export const migrationsRouter = router({
  initialise: authenticatedProcedure
    .mutation(async ({ ctx }) => {
      const xata = ctx.store.get('xata')
      if (!xata) { throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing required Xata config.' }) }

      try {
        const migrations = Object.values(migrationsJSON)

        await ctx.xata.api.migrations.pushBranchMigrations({
          branch: xata.branch ?? 'main',
          workspace: xata.workspace,
          region: xata.region,
          database: xata.database,
          // @ts-expect-error Xata don't expose the MigrationObject type :(
          migrations,
        })
      }
      catch (err) {
        const error = err as Error
        throw new TRPCError({ message: error.message, code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
})
