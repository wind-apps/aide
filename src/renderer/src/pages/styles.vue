import { NText } from 'naive-ui'
<template>
  <div
    container="~"
    m="x-auto"
  >
    <NPageHeader
      title="Style Previews"
      subtitle="Previews of components and their different styles/states."
    />
    <div m="t-8">
      <NH3 prefix="bar">
        Button Basic
      </NH3>
      <NSpace>
        <n-button>Default</n-button>
        <n-button type="tertiary">
          Tertiary
        </n-button>
        <n-button type="primary">
          Primary
        </n-button>
        <n-button type="info">
          Info
        </n-button>
        <n-button type="success">
          Success
        </n-button>
        <n-button type="warning">
          Warning
        </n-button>
        <n-button type="error">
          Error
        </n-button>
      </NSpace>
      <NH3 prefix="bar">
        Button Secondary
      </NH3>
      <NSpace>
        <n-button
          secondary
        >
          Default
        </n-button>
        <n-button
          secondary
          type="tertiary"
        >
          Tertiary
        </n-button>
        <n-button
          secondary
          type="primary"
        >
          Primary
        </n-button>
        <n-button
          secondary
          type="info"
        >
          Info
        </n-button>
        <n-button
          secondary
          type="success"
        >
          Success
        </n-button>
        <n-button
          secondary
          type="warning"
        >
          Warning
        </n-button>
        <n-button
          secondary
          type="error"
        >
          Error
        </n-button>
      </NSpace>
      <NH3 prefix="bar">
        Tertiary
      </NH3>
      <NSpace>
        <n-button tertiary>
          Default
        </n-button>
        <n-button
          tertiary
          type="primary"
        >
          Primary
        </n-button>
        <n-button
          tertiary
          type="info"
        >
          Info
        </n-button>
        <n-button
          tertiary
          type="success"
        >
          Success
        </n-button>
        <n-button
          tertiary
          type="warning"
        >
          Warning
        </n-button>
        <n-button
          tertiary
          type="error"
        >
          Error
        </n-button>
      </NSpace>
      <NH3 prefix="bar">
        Quaternary
      </NH3>
      <NSpace>
        <n-button quaternary>
          Default
        </n-button>
        <n-button
          quaternary
          type="primary"
        >
          Primary
        </n-button>
        <n-button
          quaternary
          type="info"
        >
          Info
        </n-button>
        <n-button
          quaternary
          type="success"
        >
          Success
        </n-button>
        <n-button
          quaternary
          type="warning"
        >
          Warning
        </n-button>
        <n-button
          quaternary
          type="error"
        >
          Error
        </n-button>
      </NSpace>
      <NH3 prefix="bar">
        Ghost (outlined)
      </NH3>
      <NSpace>
        <n-button ghost>
          Default
        </n-button>
        <n-button
          type="primary"
          ghost
        >
          Primary
        </n-button>
        <n-button
          type="info"
          ghost
        >
          Info
        </n-button>
        <n-button
          type="success"
          ghost
        >
          Success
        </n-button>
        <n-button
          type="warning"
          ghost
        >
          Warning
        </n-button>
        <n-button
          type="error"
          ghost
        >
          Error
        </n-button>
      </NSpace>
      <NH3 prefix="bar">
        Button Groups
      </NH3>
      <NSpace>
        <n-button-group>
          <n-button
            round
            ghost
          >
            <template #icon>
              <n-icon>
                <IconPlus />
              </n-icon>
            </template>
            Increase
          </n-button>
          <n-button ghost>
            <template #icon>
              <n-icon>
                <IconTarget />
              </n-icon>
            </template>
            Just Go
          </n-button>
          <n-button round>
            <template #icon>
              <n-icon>
                <IconMinus />
              </n-icon>
            </template>
            Decrease
          </n-button>
        </n-button-group>
      </NSpace>
    </div>
  </div>
</template>
