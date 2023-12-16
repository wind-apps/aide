<script lang="ts" setup>
import { createTRPCProxyClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import { usePrimeVue } from 'primevue/config'

import { ref } from 'vue'

// eslint-disable-next-line ts/prefer-ts-expect-error
// @ts-ignore Ignore this, otherwise vue-tsc tries to typecheck all our main code as well, which is just silly
import type { AppRouter } from '../../../main/api/router'

const PrimeVue = usePrimeVue()

const trpc = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()],
})

const initial = await trpc.itemsList.query()

const items = ref(initial)

trpc.itemSub.subscribe(undefined, {
  onData: (user) => {
  console.log('got data!', user)
  items.value.push(user)
}
})

const name = ref('')
async function addUser() {
  const res = await trpc.itemCreate.mutate({
    title: name.value,
  })

  console.log(res)
}

function changeTheme() {
  PrimeVue.changeTheme('lara-light-purple', 'lara-dark-purple', 'lara-dark-purple')
}
</script>

<template>
  <div>
    <p-button @click="changeTheme">
      Change Theme
    </p-button>
    <br>
    <p-input-text
      v-model="name"
      type="text"
      placeholder="name"
    />
    <p-button @click="addUser">
      Add User
    </p-button>
    <br>
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
