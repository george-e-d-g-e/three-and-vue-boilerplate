<template>
  <canvas id="three-container"/>
</template>

<script>

import Three from '../services/three'
const three = Three()

export default {
  name: 'Three',
  mounted(){
    const canvas = document.getElementById('three-container')
    console.log(canvas)
    three.innit( canvas )
  }
}
</script>

<style scoped>
</style>
