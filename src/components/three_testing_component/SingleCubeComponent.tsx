// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { RubiksContext } from "../RubiksContext";
import rotateRubiks from "./RubiksCubeComponent";



function Plane(props: {
  scale: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  color: THREE.Color;
}) {

  const offsetPosition = new THREE.Vector3();
  offsetPosition.copy(props.position);
  offsetPosition.multiplyScalar(1.01);

  console.log(offsetPosition);
  console.log(props.position);

  return <>
    <mesh
      position={props.position}
      rotation={props.rotation}
    >
      <planeBufferGeometry
        args={[1 * props.scale, 1 * props.scale]}
        attach="geometry"
      />
      <meshBasicMaterial
        color={new THREE.Color("black")}
        // roughness={0.3}
        // metalness={0.3}
        attach="material"
      />
    </mesh>
    <mesh
      position={offsetPosition}
      rotation={props.rotation}
    >
      <planeBufferGeometry
        args={[0.9 * props.scale, 0.9 * props.scale]}
        attach="geometry"
      />
      <meshBasicMaterial
        color={props.color}
        // roughness={0.3}
        // metalness={0.3}
        attach="material"
      />
    </mesh>
  </>;
}
interface SingleCubeComponentProps {
  color: {
    top: string;
    bottom: string;
    left: string;
    right: string;
    front: string;
    back: string;
  },
  position: THREE.Vector3
}

export const SingleCubeComponent: React.FC<SingleCubeComponentProps> = ({
  color,
  position
}) => {

  const facePositions: THREE.Vector3[] = [
    //from front view
    //top plane
    new THREE.Vector3(0, 0.5, 0),
    //bottom plane5
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

  const cube: JSX.Element[] = [];
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


  const meshRef = useRef<THREE.Mesh>(null!);
  return <>
    <RubiksContext.Consumer> 
      {
        ({setClickedPosition, clickedPosition, setCubeRefs, cubeRefs}) => {
          setCubeRefs!(position, meshRef);

          return <mesh
            ref={meshRef}
            position={position}
            onClick={(e) => {
              e.stopPropagation();
              const currentPosition = meshRef.current.position;
              setClickedPosition!(currentPosition);
              console.log(currentPosition);

              // testing 

              // getting all of the cubes in the same x-z-layer (y-position stays same)
              // * this is only a test
              
              /*
              const currentY = currentPosition.y;
              const allBoxesInPlane: React.MutableRefObject<THREE.Mesh>[] = [];

              cubeRefs?.forEach((ref, position) => {
                if (ref.current.position.y == currentY) {
                  allBoxesInPlane.push(ref);
                }
              });

              rotateRubiks(allBoxesInPlane, new Vector3(0, 1, 0), new Vector3(0, 1, 0), Math.PI / 2);
              */

              // * this works.

            }}
          >
            {cube}
          </mesh>
        }
      }
    </RubiksContext.Consumer>
  </>;
};
