import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('introCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 10;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('textures/grass.jpg');

const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const material = new THREE.MeshStandardMaterial({ map: grassTexture });
  const spacing = 1.5;
  const text = 'A NONI';

  for (let i = 0; i < text.length; i++) {
    const geo = new TextGeometry(text[i], {
      font: font,
      size: 1,
      height: 0.2
    });
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.x = i * spacing;
    scene.add(mesh);
  }

  const loader = new GLTFLoader();
  loader.load('models/mushroom_T.glb', (gltf) => {
    const mush = gltf.scene;
    mush.scale.set(1, 1, 1);
    mush.position.set(2 * spacing, 0.5, 0);
    scene.add(mush);
  });

  loader.load('models/skull.glb', (gltf) => {
    const skull = gltf.scene;
    skull.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: 0xB9CDE2,
          transmission: 1.0,
          roughness: 0.1,
          metalness: 0.1,
          thickness: 1.5,
          transparent: true
        });
      }
    });
    skull.position.set(0, -3, 0);
    scene.add(skull);

    animate();
  });
});

function animate() {
  requestAnimationFrame(animate);
  scene.traverse((obj) => {
    if (obj.name === 'skull') obj.rotation.y += 0.01;
  });
  renderer.render(scene, camera);
}
