import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  AmbientLight,
  DirectionalLight,
  AnimationMixer,
  SkeletonHelper,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  gltfPath from '../assets/models/gltf/rubber-dingy/RubberDingy_animClips_V12.gltf'

const Three = () => {

  let camera, scene, renderer, clock, delta, loader, cameraControls, light
  let mixer
  const renderFunctions = []

  const render = () => {
    requestAnimationFrame(render)
    delta = clock.getDelta()
    renderFunctions.forEach((renderFunction) => {
      renderFunction(delta)
    })
    renderer.render(scene, camera)
  }
  
  return {

    innit(canvas) {
      
      camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100)
      camera.position.z = 15
      camera.position.y = 5

      scene = new Scene()
      
      renderer = new WebGLRenderer( { antialias: true, canvas: canvas })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x282828, 1)

      clock = new Clock()
      delta = clock.getDelta()
      
      cameraControls = new OrbitControls(camera, renderer.domElement)
      cameraControls.enableDamping = true
      cameraControls.dampingFactor = 0.25
      cameraControls.enableZoom = true

      // skeletons 
      

      // load GLTF
      loader = new GLTFLoader()
      loader.load(gltfPath, (gltf) =>{
        
        const model = gltf.scene
        const animations = gltf.animations

        // resize
        const size = 0.05   
        model.scale.set(size, size, size)

        // model.updateMatrixWorld()

        model.traverse( object => {
          if (object.name === 'Skeleton_RIG_GRP') {
            // TODO: skeleton not showing and cant work out why
            let helper = new SkeletonHelper( object )
            scene.add( helper )
          }
        })
        
        // add to scene
        scene.add(model)

        // setup animationsMixer
        mixer = new AnimationMixer(model)
        this.addRenderFunction((delta) => {
          mixer.update(delta)
        })

        // add animations to mixer and actions object
        const actions = {}
        animations.forEach( clip => {
          actions[clip.name] = mixer.clipAction(clip)
        })

        console.log(actions)
        // play specific clips
        actions['LegsRotate_Y_axis_360_AnimClip'].play()
        actions['Jump_AnimClip'].play()
        

      })

      light = new AmbientLight(0xffffff, 1.0)
      scene.add(light)

      light = new DirectionalLight(0xffffff, 1.0)
      light.position.set(0.75, 1, 0)
      scene.add(light)

      window.addEventListener( 'resize', this.onResize, false)

      // Render
      this.render()
    },

    render,

    addRenderFunction( callback ){
      renderFunctions.push(callback)
    },

    onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

  }

}

export default Three

