import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  AmbientLight,
  DirectionalLight,
  AnimationMixer,
  SkeletonHelper,
  Group,
} from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfPath from '../assets/models/gltf/rubber-dingy/RubberDingy_animClips_V15.gltf'

const Three = () => {

  let camera, scene, renderer, clock, delta, loader, light, markerGroup
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

      renderer = new WebGLRenderer({ antialias: true, alpha: true, canvas: canvas })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x282828, 0.2)

      clock = new Clock()
      delta = clock.getDelta()

      // cameraControls = new OrbitControls(camera, renderer.domElement)
      // cameraControls.enableDamping = true
      // cameraControls.dampingFactor = 0.25
      // cameraControls.enableZoom = true

      markerGroup = new Group()
      scene.add(markerGroup)

      // load GLTF
      loader = new GLTFLoader()
      loader.load(gltfPath, (gltf) => {

        const model = gltf.scene
        const animations = gltf.animations

        // resize
        const size = 0.05
        model.scale.set(size, size, size)

        // model.updateMatrixWorld()

        model.traverse(object => {
          if (object.name === 'Skeleton_RIG_GRP') {
            // TODO: skeleton not showing and cant work out why
            let helper = new SkeletonHelper(object)
            scene.add(helper)
          }
        })

        // add to scene
        markerGroup.add(model)

        let helper = new SkeletonHelper(model)
        scene.add(helper)

        // setup animationsMixer
        mixer = new AnimationMixer(model)
        this.addRenderFunction((delta) => {
          mixer.update(delta)
        })

        // add animations to mixer and actions object
        const actions = {}
        animations.forEach(clip => {
          actions[clip.name] = mixer.clipAction(clip)

          // uncomment to log names
          console.log(clip.name)
        })

        // play specific clips
        actions['Run_Medium_AnimClip'].play()
        actions['ArmsRotate_Y_axis_360_AnimClip'].play()

      })

      light = new AmbientLight(0xffffff, 1.0)
      scene.add(light)

      light = new DirectionalLight(0xffffff, 1.0)
      light.position.set(0.75, 1, 0)
      scene.add(light)

      window.addEventListener('resize', this.onResize, false)

      // Render
      this.render()
    },

    render,

    addRenderFunction(callback) {
      renderFunctions.push(callback)
    },

    onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },

    getCamera(){
      return camera
    },

    getRenderer(){
      return renderer
    },

    getMarkerGroup(){
      return markerGroup
    }

  }

}

export default Three

