export const htmlTemplate = `<div id="app"></div>`
export const jsTemplate = `document.getElementById('app').innerHTML = 'hello world by js'`
export const tsTemplate = `(document.getElementById('app') as HTMLDivElement).innerHTML = 'hello world by ts'`
export const vue2Template =
`<template>
  <div class="count" @click="addCount">click me {{count}}</div>
</template>
<script>
// import Vue from 'vue'
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addCount() {
      this.count += 1
    }
  }
}
</script>

<style>
.count {
  color: red;
}
</style>
`

export const vue3Template =
`<template>
  <div class="count" @click="addCount">click me {{count}}</div>
</template>
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const count = ref<number>(0)
    function addCount() {
      count.value += 1
    }
    return {
      count,
      addCount
    }
  }
})
</script>

<style>
.count {
  color: red;
}
</style>
`

export const reactTemplate =
`import React, { useState } from 'react'
import ReactDOM from 'react-dom'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
`

export const reactTsTemplate =
`import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0)
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
`