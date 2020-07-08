<template>
  <a href="#" id="ar-button" @click="loadARjs()">AR mode</a>
</template>

<script>
import * as THREE from 'three'

export default {
  name: "ARButton",
  methods: {
    loadARjs(){
      console.log("HELLO")
      // Make THREE global
      window.THREE = THREE
      // load AR.js
      this.$loadScript('https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js')
      .then( ()=> {
        console.log("ARjs Loaded")
        this.$emit('ARjsLoaded')
      })        
      .catch( error => {
        console.log("downloading AR.js failed")
        console.log(error) 
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #ar-button{
    position: fixed;
    top: 0;
    right: 0;
    padding: 0.5rem;
    color: rgb(10,10,10);
    opacity: 0.5;
    padding: 1em;
  }
</style>