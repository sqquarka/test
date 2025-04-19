import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('introCanvas'),
  alpha: false,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x19292D); // CIEMNE tło

// Światło
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// Tekstura trawy
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('textures/grass.jpg');

// Napisy 3D: A N O N I (bez T)
const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const material = new THREE.MeshStandardMaterial({ map: grassTexture });
  const spacing = 1.5;
  const text = 'A NONI'; // bez T

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

  // Muchomor jako litera „T” (tymczasowo obraz 2D w 3D)
  const mushroomTexture = textureLoader.load('models/mushroom_T_placeholder.png');
  const mushroomGeo = new THREE.PlaneGeometry(1.2, 1.5);
  const mushroomMat = new THREE.MeshBasicMaterial({ map: mushroomTexture, transparent: true });
  const mushroomMesh = new THREE.Mesh(mushroomGeo, mushroomMat);
  mushroomMesh.position.set(2 * spacing, 0.5, 0);
  mushroomMesh.name = 'mushroom';
  scene.add(mushroomMesh);

  // Załaduj czaszkę
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    'models/skull.glb',
    (gltf) => {
      const skull = gltf.scene;
      skull.name = 'skull';
      skull.scale.set(5, 5, 5);
      skull.position.set(0, -3, 0);

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

      scene.add(skull);
    },
    undefined,
    (error) => {
      console.error('❌ Błąd ładowania czaszki:', error);
    }
  );
});

// Animacja
function animate() {
  requestAnimationFrame(animate);

  // Obrót czaszki (jeśli załadowana)
  const skull = scene.getObjectByName('skull');
  if (skull) skull.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// Obsługa resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
