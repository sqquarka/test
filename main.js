import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('introCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

// Światło
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Placeholder – kula zamiast czaszki
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
  color: 0xB9CDE2,
  transmission: 1.0,
  roughness: 0.1,
  metalness: 0.25,
  transparent: true,
  thickness: 1.5
});
const skull = new THREE.Mesh(geometry, material);
scene.add(skull);

function animate() {
  requestAnimationFrame(animate);
  skull.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
