// This is a simple placeholder brain model in JavaScript format
// It provides simple geometric shapes that resemble a brain
// Export this to GLTF/GLB format using a tool like three.js exporter

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Create a scene
const scene = new THREE.Scene();

// Create brain hemispheres (two half-spheres)
const leftHemisphere = new THREE.Mesh(
  new THREE.SphereGeometry(20, 32, 32, 0, Math.PI),
  new THREE.MeshStandardMaterial({ color: '#f2a2e8', metalness: 0.2, roughness: 0.8 })
);
leftHemisphere.position.set(0, 0, 0);
scene.add(leftHemisphere);

const rightHemisphere = new THREE.Mesh(
  new THREE.SphereGeometry(20, 32, 32, 0, Math.PI),
  new THREE.MeshStandardMaterial({ color: '#a2c0f2', metalness: 0.2, roughness: 0.8 })
);
rightHemisphere.rotation.set(0, 0, Math.PI);
rightHemisphere.position.set(0, 0, 0);
scene.add(rightHemisphere);

// Create brain stem
const brainStem = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 2, 15, 16),
  new THREE.MeshStandardMaterial({ color: '#d4d4d4', metalness: 0.1, roughness: 0.7 })
);
brainStem.rotation.set(Math.PI / 2, 0, 0);
brainStem.position.set(0, -25, 0);
scene.add(brainStem);

// Create cerebellum
const cerebellum = new THREE.Mesh(
  new THREE.SphereGeometry(10, 16, 16),
  new THREE.MeshStandardMaterial({ color: '#c5deb4', metalness: 0.1, roughness: 0.8 })
);
cerebellum.scale.set(1.2, 0.8, 1);
cerebellum.rotation.set(Math.PI / 4, 0, 0);
cerebellum.position.set(0, -17, -13);
scene.add(cerebellum);

// Create brain sulci (folds)
for (let i = 0; i < 15; i++) {
  const fold = new THREE.Mesh(
    new THREE.TorusGeometry(3 + Math.random() * 2, 0.5, 8, 8, Math.PI * (0.2 + Math.random() * 0.3)),
    new THREE.MeshStandardMaterial({ color: '#000000', metalness: 0.1, roughness: 1, transparent: true, opacity: 0.3 })
  );
  fold.position.set(
    Math.sin(i) * 15,
    Math.cos(i * 2) * 10,
    Math.cos(i) * 15
  );
  scene.add(fold);
}

// Create a parent object to hold everything
const brainModel = new THREE.Group();
brainModel.name = "Brain"; // Important: This name is used in the component
scene.add(brainModel);

// Export to GLTF
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  function (gltf) {
    const output = JSON.stringify(gltf, null, 2);
    console.log(output);
    // Save this output to a file with .gltf extension
    // Then convert to GLB format if needed
  },
  { binary: false }
);

/*
How to convert this to a usable model:
1. Run this script in a Node.js environment or browser console
2. Save the output JSON to a file named brain.gltf
3. Use a tool like gltf-pipeline to convert to GLB:
   npx gltf-pipeline -i brain.gltf -o brain.glb
4. Place the resulting brain.glb file in your /public/models/ directory
*/
