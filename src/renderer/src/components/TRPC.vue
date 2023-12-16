<script lang="ts" setup>
  import { createTRPCProxyClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import { usePrimeVue } from 'primevue/config'

const PrimeVue = usePrimeVue()

// @ts-ignore Ignore this, otherwise vue-tsc tries to typecheck all our main code as well, which is just silly
import type { AppRouter } from '../../../main/api/router'

import { ref } from 'vue'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()],
})

const initial = await trpc.userList.query()

const users = ref(initial)

trpc.userSub.subscribe(undefined, {onData: (user) => {
  console.log('got data!', user)
  users.value.push(user)
}})

const name = ref('')
async function addUser () {
  const res = await trpc.userCreate.mutate({
    id: Math.round(Math.random() * 100),
    name: name.value
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
        v-for="user in users"
        :key="user.id"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
