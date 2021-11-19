// Import three.js core
import * as THREE from "./build/three.module.js";

// Import add-ons for glTF models, orbit controls, and font loader
import {
  OrbitControls
} from "./src/OrbitControls.js";
import {
  GLTFLoader
} from "./src/GLTFLoader.js";

let container, scene, camera, renderer, mesh, mesh2, mixer, controls, clock;


let ticker = 0;

// Call init and animate functions (defined below)
init();
animate();

function init() {

  //Identify div in HTML to place scene
  container = document.getElementById("space");

  //Crate clock for animation
  clock = new THREE.Clock();

  //Create scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x7781A6);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, 900);
  // Add scene to gltf.html
  container.appendChild(renderer.domElement);

  // Material to be added to preanimated model
  var newMaterial = new THREE.MeshStandardMaterial({
    color: 0x2E5939
  });

  // Load preanimated model, add material, and add it to the scene
  const loader = new GLTFLoader().load(
    "./assets/world.glb",
    function(gltf) {
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          // child.material = newMaterial;
          //makes colors more like the blender model
          renderer.outputEncoding = THREE.sRGBEncoding;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(0, 0.5, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(1, 1, 1);
      // Add model to scene
      scene.add(mesh);
      //Check for and play animation frames
      mixer = new THREE.AnimationMixer(mesh);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

    },
    undefined,
    function(error) {
      console.error(error);
    }
  );


  // Add Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 3;
  controls.maxDistance = 12;
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 3;
  controls.maxPolarAngle = Math.PI / 1.5;
  controls.minPolarAngle = Math.PI / 2;


  // Position our camera so we can see the shape
  camera.position.y = 7;

  // Add a directional light to the scene
  const light = new THREE.DirectionalLight( 0xDFD6FF, 0.6 );
  light.position.set( 0, 10, 10 );
  light.castShadow = true;
  scene.add( light );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  const light2 = new THREE.DirectionalLight( 0xDFD6FF, 0.4, 100 );
  light2.position.set( 0, 2, 10 );
  light2.castShadow = true;
  scene.add( light2 );


  // Add an ambient light to the scene
  const ambientLight = new THREE.AmbientLight(0xAEADFF, 0.9);
  scene.add(ambientLight);

}


// Define animate loop
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  render();
}

// Define the render loop
function render() {
  renderer.render(scene, camera);
  manualAnimation();
}



// Respond to Window Resizing
window.addEventListener("resize", onWindowResize);

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  render();
}
