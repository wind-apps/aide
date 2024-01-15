<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <Transition mode="out-in">
        <KeepAlive>
          <Suspense>
            <!-- main content -->
            <div>
              <TheHeader v-if="$route.name !== '/setup/'" />
              <component :is="Component" />
            </div>

            <!-- loading state -->
            <template #fallback>
              Loading...
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
const { $t } = useFluent()
const router = useRouter()
const route = useRoute()
const message = useMessage()

tryOnBeforeMount(async () => {
  const isAuthenticated = await trpc.auth.isAuthenticated.query()
  if (!isAuthenticated) { return router.push('/setup') }
})

// TODO: Probably a better way to handle this.
onErrorCaptured((error) => {
  console.log('checking error', error.name)
  if (error.name === 'TRPCClientError') {
    if (error.message === 'UNAUTHORIZED' && route.name !== '/setup/') {
      message.error($t('unauthorized-error'))
      router.push('/setup')
    }
  }
})
</script>

<fluent locale="en">
unauthorized-error = You are not logged in - redirecting to setup page.
</fluent>
