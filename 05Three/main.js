import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Box geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation controls
let isAnimating = true;
let rotationSpeed = 0.01;

// GUI setup
// const gui = new GUI();
// const guiControls = { // Renamed to avoid conflict
//     play: () => { isAnimating = true; },
//     pause: () => { isAnimating = false; },
//     speed: 0.01
// };

// gui.add(guiControls, 'play');
// gui.add(guiControls, 'pause');
// gui.add(guiControls, 'speed', 0, 0.1).onChange(value => rotationSpeed = value);



import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('quarry_cloudy_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let gltfModel;
const gltfLoader = new GLTFLoader();

gltfLoader.load("brain.glb", function (gltf) {
    gltf.scene.position.y = -1.5;
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    scene.add(gltf.scene);
    gltfModel = gltf.scene; // Store reference to the model
});


// // Add GUI controls for cube properties
// const cubeFolder = gui.addFolder('Cube Properties');
// cubeFolder.add(cube.position, 'x', -5, 5).name('Position X');
// cubeFolder.add(cube.position, 'y', -5, 5).name('Position Y');
// cubeFolder.add(cube.position, 'z', -5, 5).name('Position Z');

// const scaleFolder = gui.addFolder('Scale');
// scaleFolder.add(cube.scale, 'x', 0.1, 3).name('Scale X');
// scaleFolder.add(cube.scale, 'y', 0.1, 3).name('Scale Y');
// scaleFolder.add(cube.scale, 'z', 0.1, 3).name('Scale Z');

// const materialFolder = gui.addFolder('Material');
// materialFolder.addColor(material, 'color').name('Color');


// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


// // Add GUI controls for lights
// const lightFolder = gui.addFolder('Lights');

// // Ambient Light controls
// const ambientFolder = lightFolder.addFolder('Ambient Light');
// ambientFolder.add(ambientLight, 'intensity', 0, 2).name('Intensity');
// ambientFolder.addColor(ambientLight, 'color').name('Color');

// // Directional Light controls
// const directionalFolder = lightFolder.addFolder('Directional Light');
// directionalFolder.add(directionalLight, 'intensity', 0, 5).name('Intensity');
// directionalFolder.addColor(directionalLight, 'color').name('Color');
// directionalFolder.add(directionalLight.position, 'x', -10, 10).name('Position X');
// directionalFolder.add(directionalLight.position, 'y', -10, 10).name('Position Y');
// directionalFolder.add(directionalLight.position, 'z', -10, 10).name('Position Z');



window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



function animate() {
    requestAnimationFrame(animate);

    if (gltfModel) {
        gltfModel.rotation.y += 0.01; // Rotate the model around Y-axis
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();