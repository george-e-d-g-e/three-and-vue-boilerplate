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
  AnimationUtils,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Raycaster,
  Vector2,
  SphereGeometry,
  Color,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfPath from '../assets/models/gltf/rubber-dingy/RubberDingy_animClips_V15.gltf'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'


const Three = () => {

  let camera, scene, renderer, clock, delta, loader, light, markerGroup
  let mixer
  let raycaster, mouse
  let cameraControls

  let params = {
    shiftX: 140,
    shiftY: 60,
  }

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

      cameraControls = new OrbitControls(camera, renderer.domElement)
      cameraControls.enableDamping = true
      cameraControls.dampingFactor = 0.25
      cameraControls.enableZoom = true

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

          // Make clips to additive
          AnimationUtils.makeClipAdditive( clip )

          actions[clip.name] = mixer.clipAction(clip)

          // uncomment to log names
          console.log(clip.name)
        })

        // play specific clips
        actions['Jump_AnimClip'].play()
        actions['Legs_CrossOver_AnimClip'].play()

      })

      light = new AmbientLight(0xffffff, 1.0)
      scene.add(light)

      light = new DirectionalLight(0xffffff, 1.0)
      light.position.set(0.75, 1, 0)
      scene.add(light)


      // Floor 
      let geometry = new PlaneGeometry(5, 5)
      let material = new MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 1.0,
        visible: true
      })
      let floor = new Mesh(geometry, material)
      floor.rotateX(-Math.PI / 2)

      markerGroup.add(floor)

      // Raycaster
      raycaster = new Raycaster()
      mouse = new Vector2()
      geometry = new SphereGeometry( 0.2, 12, 12)
      material = material.clone()
      material.color = new Color( 0x000000 )
      material.opacity = 1.0
      let dot = new Mesh(geometry, material)
      scene.add(dot)

      this.addRenderFunction( () =>{

        camera.updateMatrixWorld()

        raycaster.setFromCamera( mouse, camera )

        let intersects = raycaster.intersectObject( floor )
        floor.material.color.set( 0xff0000)
        for ( var i = 0; i < intersects.length; i++ ) {
          intersects[ i ].object.material.color.set( 0x0000ff)
        }

        if(intersects.length){
          dot.position.copy(intersects[0].point)
        }
      })

      window.addEventListener('mousemove', this.onMouseMove, false)
      window.addEventListener('resize', this.onResize, false)

      this.createGUI()

      // Render
      this.render()
    },

    render,

    addRenderFunction(callback) {
      renderFunctions.push(callback)
    },

    onMouseMove( event ){
      if(renderer.domElement){
        let x = event.clientX
        let y = event.clientY
        let canvas = renderer.domElement

        let style = window.getComputedStyle(canvas)

        // I think its here that is'nt correct
        
        x -= parseInt(style.getPropertyValue('margin-left'))
        y -= parseInt(style.getPropertyValue('margin-top'))

        // TODO: work out params.Shift values ... 
        /*
          seems to be effected by width of window when 
        */

        mouse.x = (( x  / canvas.offsetWidth ) * 2 - 1) * (params.shiftX * 0.01)
        mouse.y = (- ( y / canvas.offsetHeight ) * 2 + 1) * (params.shiftY * 0.01)
        //mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
        //mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
        
        // console.log(`mouseX: ${event.clientX} mouseY: ${event.clientY}`)
        console.log(`x: ${mouse.x} y: ${mouse.y}`)
        console.log(`width: ${canvas.offsetWidth} height: ${canvas.offsetHeight}`)
      }
    },

    onResize() {
      console.log("three resize")
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
    },

    toggleCameraControls(){
      cameraControls.enabled != cameraControls.enabled
    },

    createGUI() {
      const gui = new GUI()
      gui.add(params, 'shiftX').name('Shift X')
      gui.add(params, 'shiftY').name('Shift Y')
    }

  }

}

export default Three

