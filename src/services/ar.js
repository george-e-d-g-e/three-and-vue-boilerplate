/* global THREEx */

import cameraParaURL from '../data/camera_para.dat'
import hiroPattURL from '../data/hiro.patt'
import flameMarkers from '../services/flameMarkers'

const AR = (camera, renderer) => {

  THREEx.ArToolkitContext.baseURL = '../'

  const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
    sourceWidth: 480,
    sourceHeight: 640,
    displayWidth: window.innerWidth,
    displayHeight: window.innerHeight,
  })

  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: cameraParaURL,
    detectionMode: 'mono',
    debug: true
  })

  return {
    innit(){
      
      arToolkitSource.init( () => { 
          this.onResize() 
          setTimeout( () => {
            this.onResize() 
          }, 500)
      })
      
      arToolkitContext.init( function onComplete(){
        camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() )
      })

      

      window.addEventListener('resize', () => this.onResize())
      
      // let log = info => () => { console.log(info) } 
      // window.addEventListener('arjs-video-loaded', log("video loaded"))
      // window.addEventListener('camera-error', log)
      // window.addEventListener('camera-init', log)
      // window.addEventListener('markerFound', log)
      // window.addEventListener('markerLost', log)

      return arToolkitContext
    },

    renderFunction: () => {
      if( arToolkitSource.ready === false) return
      arToolkitContext.update( arToolkitSource.domElement )
    },

    getMarker: (arToolkitContext, camera) => {
      
      const marker = new THREEx.ArMarkerControls(arToolkitContext, camera, {
        type: "pattern",
        patternUrl: hiroPattURL,
        changeMatrixMode: 'cameraTransformMatrix'
      })

      marker.addEventListener('markerFound', () => {
        camera.updateMatrix()
      })
      
      return marker
    },

    getFlameMarkers: (arToolkitContext, camera) => {
      const markers = []
      Object.keys(flameMarkers).forEach( patt => {
        const marker = new THREEx.ArMarkerControls(arToolkitContext, camera, {
          type: "pattern",
          patternUrl: flameMarkers[patt],
          changeMatrixMode: 'cameraTransformMatrix'
        })
  
        marker.addEventListener('markerFound', () => {
          console.log(`marker: ${patt}`)
          camera.updateMatrix()
        })

        markers.push(marker)
      })

      return markers
    },

    onResize: () => {
      console.log("resize")
      arToolkitSource.onResizeElement() 		
      arToolkitSource.copyElementSizeTo(renderer.domElement)
      
      if( arToolkitContext.arController !== null ){
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
      }
    },

    log(){
      console.log(arToolkitSource)
      console.log(arToolkitContext)
      // console.log(markerControls)
    }
  }
}

export default AR