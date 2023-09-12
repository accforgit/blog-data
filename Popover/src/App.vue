<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import Popover from './components/popover.vue'

const content = 'content content'
</script>

<template>
  <div>
    <ul>
      <li>
        <Popover position="topLeft">
          <template v-slot:reference>
            <button>topLeft</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <li>
        <Popover position="top">
          <template v-slot:reference>
            <button>top</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <Popover position="topRight">
        <template v-slot:reference>
          <button>topRight</button>
        </template>
        {{ content }}
      </Popover>
    </ul>
    <ul>
      <li>
        <Popover position="leftTop">
          <template v-slot:reference>
            <button>leftTop</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <li>
        <Popover position="rightTop">
          <template v-slot:reference>
            <button>rightTop</button>
          </template>
          {{ content }}
        </Popover>
      </li>
    </ul>
    <ul>
      <li>
        <Popover position="left">
          <template v-slot:reference>
            <button>left</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <li>
        <Popover position="right">
          <template v-slot:reference>
            <button>right</button>
          </template>
          {{ content }}
        </Popover>
      </li>
    </ul>
    <ul>
      <li>
        <Popover position="leftBottom">
          <template v-slot:reference>
            <button>leftBottom</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <li>
        <Popover position="rightBottom">
          <template v-slot:reference>
            <button>rightBottom</button>
          </template>
          {{ content }}
        </Popover>
      </li>
    </ul>
    <ul>
      <li>
        <Popover position="bottomLeft">
          <template v-slot:reference>
            <button>bottomLeft</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <li>
        <Popover position="bottom">
          <template v-slot:reference>
            <button>bottom</button>
          </template>
          {{ content }}
        </Popover>
      </li>
      <li>
        <Popover position="bottomRight">
          <template v-slot:reference>
            <button>bottomRight</button>
          </template>
          {{ content }}
        </Popover>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
}
ul li {
  list-style-type: none;
}
button {
  /* width: 26px; */
  padding: 4px 8px;
  word-wrap: break-word;
}
</style>
