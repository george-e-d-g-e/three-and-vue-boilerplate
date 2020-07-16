/* global THREEx */

import cameraParaURL from '../data/camera_para.dat'
import hiroPattURL from '../data/patt.hiro'

const AR = (camera, renderer) => {

  THREEx.ArToolkitContext.baseURL = '../'

  // reset camera position
  camera.position.set( 0, 0, 0)

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
    // debug: true
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
      let log = info => () => { console.log(info) } 
      window.addEventListener('arjs-video-loaded', log("video loaded"))
      window.addEventListener('camera-error', log)
      window.addEventListener('camera-init', log)
      window.addEventListener('markerFound', log)
      window.addEventListener('markerLost', log)

      return arToolkitContext
    },

    renderFunction: () => {
      if( arToolkitSource.ready === false) return
      arToolkitContext.update( arToolkitSource.domElement )
    },

    getMarker: (arToolkitContext, markerRoot) => {
      
      // resize model
      console.log(markerRoot)
      let scale = 0.05
      markerRoot.scale.set(scale, scale, scale)

      return new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: hiroPattURL
      })
    },

    onResize: () => {
      console.log("resize")
      arToolkitSource.onResizeElement() 		
      arToolkitSource.copyElementSizeTo(renderer.domElement)

      //arToolkitSource.onResize(arToolkitContext, renderer, camera)
      //arToolkitSource.copySizeTo(renderer.domElement)
      
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