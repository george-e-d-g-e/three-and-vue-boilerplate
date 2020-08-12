<template>
  <a href="#" id="ar-button" @click="loadARjs()"> {{label}} </a>
</template>

<script>
import * as THREE from 'three'

export default {
  name: "ARButton",
  data: function() {
    return {
      label: 'AR'
    }
  },
  methods: {
    loadARjs(){

      this.label = 'Loading'

      // Make THREE global
      window.THREE = THREE
      // load AR.js
      this.$loadScript('https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js')
      .then( ()=> {
        this.label = 'Look for marker'
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
    bottom: 1em;
    right: 1em;
    color: rgb(250,250,250);
    font-weight: 900;
    text-decoration: none;
    padding: 1em;
    background: rgba(255,255,255,0.2);
    border-radius: 2em;
  }
</style>