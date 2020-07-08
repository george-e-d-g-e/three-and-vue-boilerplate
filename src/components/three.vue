<template>
  <div>
    <arButton @ARjsLoaded="onArjsLoaded"></arButton>
    <canvas id="three-container"/>
  </div>
</template>

<script>

import arButton from '@/components/arButton.vue'
import Three from '../services/three'
import AR from '../services/ar'

const three = Three()

export default {
  name: 'Three',
  components: {
    arButton
  },
  mounted(){
    const canvas = document.getElementById('three-container')
    three.innit( canvas )
  },
  methods: {
    onArjsLoaded(){
      const ar = AR(three.getCamera(), three.getRenderer())
      console.log("AR setup")
      const arToolkitContext = ar.innit()
      three.addRenderFunction(ar.renderFunction)
      console.log("AR innit")
      const marker = ar.getMarker(arToolkitContext, three.getMarkerGroup())
      marker.addEventListener('markerFound', ()=>{
        console.log("marker found")
      })
    }
  }
}
</script>
