import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();

const cylinderGeometry = new THREE.CylinderGeometry(7, 7, 10, 10, 10, true);
const cylinderMaterial = new THREE.MeshBasicMaterial({
  color: "blue",
  wireframe: true,
});

const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinder);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 18;

scene.add(camera);

const canvas = document.querySelector(".canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;
controls.dampingFactor = 0.05;
controls.enableZoom = true;


function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

//   cylinder.rotation.x += 0.01;
//   cylinder.rotation.y += 0.01;
}

animate();
