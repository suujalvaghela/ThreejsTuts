import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as lil from "lil-gui";

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create box
const geometry = new THREE.BoxGeometry(3, 1.8, 2);

const loader = new THREE.TextureLoader();
const color = loader.load("./text/color.jpg");
const roughness = loader.load("./text/roughness.jpg");
const normal = loader.load("./text/normal.png");

const material = new THREE.MeshStandardMaterial({
  map: color,
  roughnessMap: roughness,
  normalMap: normal,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();


// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

// Add light helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);


const gui = new lil.GUI();

// Material settings
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'roughness' , 0 , 1).name("Roughness");
materialFolder.add(material, 'metalness' , 0 , 1).name("Metalness");
materialFolder.addColor(material, 'color').name("Color");

// Mesh settings
const meshFolder = gui.addFolder('Mesh');
meshFolder.add(cube.scale, 'x' , 0.1 , 5).name("Scale X");
meshFolder.add(cube.scale, 'y' , 0.1 , 5).name("Scale Y");
meshFolder.add(cube.scale, 'z' , 0.1 , 5).name("Scale Z");
meshFolder.add(cube.position, 'x' , -10 , 10).name('Position X');
meshFolder.add(cube.position, 'y' , -10 , 10).name('Position Y'); 
meshFolder.add(cube.position, 'z' , -10 , 10).name('Position Z');



// Add light controls
const lightFolder = gui.addFolder('Lights');

// Ambient Light controls
const ambientFolder = lightFolder.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity', 0, 2).name('Intensity');

// Directional Light controls
const directionalFolder = lightFolder.addFolder('Directional Light');
directionalFolder.add(directionalLight, 'intensity', 0, 5).name('Intensity');
directionalFolder.add(directionalLight.position, 'x', -5, 5).name('Position X');
directionalFolder.add(directionalLight.position, 'y', -5, 5).name('Position Y');
directionalFolder.add(directionalLight.position, 'z', -5, 5).name('Position Z');

// Point Light controls
const pointFolder = lightFolder.addFolder('Point Light');
pointFolder.add(pointLight, 'intensity', 0, 2).name('Intensity');
pointFolder.add(pointLight.position, 'x', -5, 5).name('Position X');
pointFolder.add(pointLight.position, 'y', -5, 5).name('Position Y');
pointFolder.add(pointLight.position, 'z', -5, 5).name('Position Z');
