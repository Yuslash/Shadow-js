import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()
/**
 * GUI Instanstaite
 */
const gui = new GUI()


/**
 * Textures
 */
const textureloader = new THREE.TextureLoader()
const texture = textureloader.load('/textures/simpleShadow.jpg')

/**
 * Size
 */
const size = {
    width : window.innerWidth,
    height : window.innerHeight
}

/**
 * resize
 */
window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    
    renderer.setSize(size.width , size.height)

})

/**
 * Lights
 */
const ambientLights = new THREE.AmbientLight(0xffffff,1.8)
const spotlight = new THREE.SpotLight(0xffffff,1.4)
spotlight.castShadow = true
spotlight.position.set(0, 2, 2)
gui.add(spotlight.position, 'x').min(-5).max(5).step(0.001)
gui.add(spotlight.position, 'y').min(-5).max(5).step(0.001)
gui.add(spotlight.position, 'z').min(-5).max(5).step(0.001)

scene.add(spotlight)

const directionalLights = new THREE.DirectionalLight(0xffffff,1)
directionalLights.shadow.mapSize.width = 1024
directionalLights.shadow.mapSize.height = 1024
directionalLights.castShadow = true
directionalLights.position.set(2,2,-1)
directionalLights.shadow.camera.near = 1
directionalLights.shadow.camera.far = 6
scene.add(directionalLights,ambientLights)

/**
 * Lights camera helper
 */
const directionalLightscamerahelper = new THREE.CameraHelper(directionalLights.shadow.camera)
scene.add(directionalLightscamerahelper)
directionalLightscamerahelper.visible = false


/**
 * Material
 */
const material = new THREE.MeshStandardMaterial(
    {
        roughness : 0.5
    }
)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5,5),
    material
)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5,1.5),
    new THREE.MeshBasicMaterial(
        {
            color : 0x000000,
            transparent : true,
            alphaMap : texture
        }
    )
)
scene.add(sphereShadow)
plane.receiveShadow = true
plane.rotation.x = - Math.PI / 2
plane.position.y = - 0.5
sphereShadow.rotation.x = - Math.PI / 2
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphere,plane)


/**
 * GUI Debug
 */

gui.add(ambientLights, 'intensity').min(0).max(5).step(0.001).name('Ambiend Intensity')
gui.add(directionalLights, 'intensity').min(0).max(5).step(0.001).name('Directional Intensity')


gui.add(directionalLights.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLights.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLights.position, 'z').min(-5).max(5).step(0.001)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75,size.width / size.height)
camera.position.set(1, 1, 2)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas : canvas
})
renderer.setSize(size.width,size.height)
renderer.shadowMap.enabled = false

/**
 * Time
 */
const clock = new THREE.Clock()

/**
 * Animation Frame
 */
const tick =()=>
{

    const time = clock.getElapsedTime()

    sphere.position.x = Math.cos(time) * 1.5
    sphere.position.z = Math.sin(time) * 1.5

    sphere.position.y = Math.abs(Math.sin(time) * 1.5)
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    controls.update()
    requestAnimationFrame(tick)
    renderer.render(scene,camera)

}
tick()


