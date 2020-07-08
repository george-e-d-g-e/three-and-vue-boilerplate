/* global THREEx */

import cameraParaURL from '../data/camera_para.dat'
import hiroPattURL from '../data/patt.hiro'

const AR = (camera, renderer) => {

  THREEx.ArToolkitContext.baseURL = '../'

  console.log(hiroPattURL)

  console.log(cameraParaURL)

  console.log("source")

  const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
  })

  console.log("context")

  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: cameraParaURL,
    detectionMode: 'mono',
    debug: true,
  })
  
  // const markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
  //   type: 'pattern',
  //   patternUrl: hiroPattURL,
  //   changeMatrixMode: 'cameraTransformMatrix',
  // })
  

  const onResize = () => {
    console.log("resize")
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
		}
  }

  return {
    innit(){
      
      arToolkitSource.init( () => { 
          onResize() 
      })
      
      arToolkitContext.init( function onComplete(){
        camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() )
        // camera.updateProjectionMatrix()
      })

      window.addEventListener('resize', () => onResize(), false)
      let log = info => () => { console.log(info)} 
      window.addEventListener('arjs-video-loaded', log("video loaded"))
      window.addEventListener('camera-error', log("camera error"))
      window.addEventListener('camera-init', log("camera init"))
      window.addEventListener('markerFound', log("marker Found"))
      window.addEventListener('markerLost', log("marker Lost"))

      return arToolkitContext
    },
    renderFunction: () => {
      if( arToolkitSource.ready === false) return
      arToolkitContext.update( arToolkitSource.domElement )
      camera.updateProjectionMatrix()
    },

    getMarker: (arToolkitContext, markerRoot) => {
      return new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: hiroPattURL
      })
    },
    log(){
      console.log(arToolkitSource)
      console.log(arToolkitContext)
      // console.log(markerControls)
    }
  }
}

export default AR