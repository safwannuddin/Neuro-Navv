import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface BrainModelProps {
  viewMode?: 'standard' | 'anomaly';
  selectedRegion?: string | null;
  anomalies?: {
    id: string;
    name: string;
    severity: string;
    description: string;
    coordinates: { x: number; y: number; z: number };
  }[];
}

export function BrainModel({ viewMode = 'standard', selectedRegion = null, anomalies = [] }: BrainModelProps) {
  const group = useRef<THREE.Group>(null);
  
  // Load the model and handle potential errors
  const { scene, nodes, materials } = useGLTF('/models/brain.glb');
  
  // Log the entire GLTF structure for debugging
  useEffect(() => {
    console.log("GLTF Model Structure:", { 
      scene, 
      nodes, 
      materials,
      nodeNames: nodes ? Object.keys(nodes) : [],
      materialNames: materials ? Object.keys(materials) : []
    });
    
    // Apply material changes based on view mode if needed
    if (scene) {
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.material) {
            // Apply viewMode-specific material properties
            if (viewMode === 'anomaly') {
              // Highlight the model in anomaly mode
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.emissive = new THREE.Color('#ff3000');
              material.emissiveIntensity = 0.2;
            }
          }
        }
      });
    }
  }, [scene, nodes, materials, viewMode]);
  useEffect(() => {
    // Handle WebGL context loss
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });return (
    <group ref={group} dispose={null}>
      {/* Use the entire GLTF scene for better compatibility */}
      <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />
      
      {/* Anomaly indicators - will only render if we have anomalies */}
      {anomalies.map((anomaly) => (
        <mesh 
          key={anomaly.id}
          position={[
            anomaly.coordinates.x,
            anomaly.coordinates.y,
            anomaly.coordinates.z
          ]}
        >
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial 
            color="#ff0000"
            emissive="#ff4000"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Preload the model to improve initial loading experience
useGLTF.preload('/models/brain.glb');