// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
import React, { useState } from "react";
import * as THREE from "three";

function Plane(props: {
  scale: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  color: THREE.Color;
}) {
  return (
    <mesh
      position={props.position.multiplyScalar(props.scale)}
      rotation={props.rotation}
    >
      <planeBufferGeometry
        args={[1 * props.scale, 1 * props.scale]}
        attach="geometry"
      />
      <meshBasicMaterial
        color={props.color}
        // roughness={0.3}
        // metalness={0.3}
        attach="material"
      />
    </mesh>
  );
}
interface SingleCubeComponentProps {
  color: {
    top: string;
    bottom: string;
    left: string;
    right: string;
    front: string;
    back: string;
  };
}

export const SingleCubeComponent: React.FC<SingleCubeComponentProps> = ({
  color,
}) => {
  const facePositions: THREE.Vector3[] = [
    //from front view
    //top plane
    new THREE.Vector3(0, 0.5, 0),
    //bottom plane
    new THREE.Vector3(0, -0.5, 0),
    //left plane
    new THREE.Vector3(-0.5, 0, 0),
    //right plane
    new THREE.Vector3(0.5, 0, 0),
    //front plane
    new THREE.Vector3(0, 0, 0.5),
    //back plane
    new THREE.Vector3(0, 0, -0.5),
  ];
  const faceRotations: THREE.Euler[] = [
    //from front view
    //top plane
    new THREE.Euler(THREE.MathUtils.degToRad(-90), 0, 0),
    //bottom plane
    new THREE.Euler(THREE.MathUtils.degToRad(90), 0, 0),
    //left plane
    new THREE.Euler(0, THREE.MathUtils.degToRad(-90), 0),
    //right plane
    new THREE.Euler(0, THREE.MathUtils.degToRad(90), 0),
    //front plane
    new THREE.Euler(0, 0, THREE.MathUtils.degToRad(0)),
    //back plane
    new THREE.Euler(THREE.MathUtils.degToRad(180), 0, 0),
  ];
  const faceColors: THREE.Color[] = [
    //top
    new THREE.Color(color.top),
    //bottom
    new THREE.Color(color.bottom),
    //left
    new THREE.Color(color.left),
    //right
    new THREE.Color(color.right),
    //front
    new THREE.Color(color.front),
    //back
    new THREE.Color(color.back),
  ];

  const cube = [];
  for (let i = 0; i < 6; i++) {
    // cube.push(<Plane position={[1, 1, 1]} rotation={[0, 0, 0]} color="red" />);
    cube.push(
      <Plane
        key={`plane-${facePositions[i].x}/${facePositions[i].y}/${facePositions[i].z}`}
        scale={1}
        position={facePositions[i]}
        rotation={faceRotations[i]}
        color={faceColors[i]}
      />
    );
  }
  return <>{cube}</>;
};
