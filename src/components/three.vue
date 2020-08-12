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

      // remove camera contorls and resize
      window.removeEventListener('resize', three.onResize, false)
      three.toggleCameraControls()
      
      const ar = AR(three.getCamera(), three.getRenderer())
      
      const arToolkitContext = ar.innit()
      three.addRenderFunction(ar.renderFunction)
      
      const marker = ar.getFlameMarkers(arToolkitContext, three.getCamera())
      console.log(marker)
    }
  }
}
</script>
