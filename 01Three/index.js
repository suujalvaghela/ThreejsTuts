const canvas = document.querySelector(".first");

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 ,wireframe: true });

const box = new THREE.Mesh(geometry, material);
scene.add(box);

const size = {
  width: 700,
  height: 500,
};

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
// camera.position.x = 0;
// camera.position.y = 1;
camera.position.z = 5;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(size.width, size.height);

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
}

animate();
