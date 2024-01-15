import { createTRPCProxyClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// eslint-disable-next-line ts/prefer-ts-expect-error
// @ts-ignore Ignore this, otherwise vue-tsc tries to typecheck all our main code as well, which is just silly
import type { AppRouter } from '@main/api/router'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()]
})

export function useTRPC() {
  return trpc
}
