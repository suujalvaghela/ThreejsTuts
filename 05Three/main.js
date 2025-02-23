import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// Create scene
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// GUI setup
const gui = new GUI();

// Animation control variables
let isAnimating = true;
let rotationSpeed = 0.01;
let gltfModel = null;

// Load HDR environment
new RGBELoader().load("quarry_cloudy_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

// Load Model
async function loadModel() {
  const gltfLoader = new GLTFLoader();
  try {
    const gltf = await gltfLoader.loadAsync("solar_skid.glb");
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    gltf.scene.scale.set(0.02, 0.02, 0.02);
    gltf.scene.position.set(0, -1, 0);
    scene.add(gltf.scene);
    gltfModel = gltf.scene;
    applySolarMaterial();
  } catch (error) {
    console.error("Error loading GLTF model:", error);
  }
}
loadModel();

// Load Textures
const textureLoader = new THREE.TextureLoader();
const textures = {
  albedo: textureLoader.load("solar_surface.jpg"),
  metalness: textureLoader.load("solar_metalness.jpg"),
  roughness: textureLoader.load("solar_roughness.jpg"),
  normal: textureLoader.load("solar_normal.jpg"),
  height: textureLoader.load("solar_height.jpg"),
  emissive: textureLoader.load("solar_emissive.jpg"),
};

Object.values(textures).forEach((texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.flipY = false;
});

// Apply Material to Model
function applySolarMaterial() {
  if (!gltfModel) return;
  gltfModel.traverse((child) => {
    if (child.isMesh) {
      const material = child.material;
      material.map = textures.albedo;
      material.metalnessMap = textures.metalness;
      material.roughnessMap = textures.roughness;
      material.normalMap = textures.normal;
      material.displacementMap = textures.height;
      material.displacementScale = 0.05;
      material.emissive = new THREE.Color(0xffaa00);
      material.emissiveMap = textures.emissive;
      material.emissiveIntensity = 2;
      material.needsUpdate = true;
    }
  });
}

// Texture selection GUI
Object.keys(textures).forEach((key) => {
  gui.add({ [key]: key }, key, [key]).onChange(() => {
    applySolarMaterial();
  });
});

// Animation controls
const controlsFolder = gui.addFolder("Animation");
controlsFolder.add({ play: () => (isAnimating = true) }, "play");
controlsFolder.add({ pause: () => (isAnimating = false) }, "pause");
controlsFolder.add({ speed: 0.01 }, "speed", 0, 0.1).onChange((value) => {
  rotationSpeed = value;
});
controlsFolder.add({ rotation: 0 }, "rotation", 0, 360).onChange((value) => {
  if (gltfModel) gltfModel.rotation.y = THREE.MathUtils.degToRad(value);
});

function updateURL() {
  const params = new URLSearchParams({
    rotation: THREE.MathUtils.radToDeg(gltfModel?.rotation.y || 0),
    speed: rotationSpeed,
    isAnimating: isAnimating ? 1 : 0,
  });
  window.history.replaceState({}, "", `?${params.toString()}`);
}

function loadSettingsFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("rotation") && gltfModel) {
    gltfModel.rotation.y = THREE.MathUtils.degToRad(
      parseFloat(params.get("rotation"))
    );
  }
  if (params.has("speed")) {
    rotationSpeed = parseFloat(params.get("speed"));
  }
  if (params.has("isAnimating")) {
    isAnimating = params.get("isAnimating") === "1";
  }
}

// GUI Share Button
gui
  .add(
    {
      share: () => {
        updateURL();
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => alert("Link copied!"));
      },
    },
    "share"
  )
  .name("Share");

// Load URL parameters when page loads
window.addEventListener("load", loadSettingsFromURL);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0.05;
bloomPass.strength = 0.5;
bloomPass.radius = 0.5;
composer.addPass(bloomPass);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (isAnimating && gltfModel) {
    gltfModel.rotation.y += rotationSpeed;
  }
  controls.update();
  composer.render();
}
animate();
