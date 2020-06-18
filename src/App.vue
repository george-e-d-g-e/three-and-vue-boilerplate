<template>
  <div id="app">
    <Three/>
  </div>
</template>

<script>
import Three from './components/three.vue'

export default {
  name: 'App',
  components: {
    Three
  }
}
</script>

<style>
body {
  margin: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 0px;
  position: fixed;
}
</style>
