// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
import { MeshProps, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import React, { useRef, useState, useContext } from "react";
import * as THREE from "three";
import { MathUtils, Mesh, RGB_PVRTC_2BPPV1_Format } from "three";
import { approxEquals } from "../../utils";
import { RubiksContext } from "../RubiksContext";
import { Plane } from "./PlaneComponent";
import { rotateAboutPoint, rotateRubiks, roundToNearest90, setRotationRubiks } from "./RubiksCubeComponent";



interface SingleCubeComponentProps {
  color: {
    top: string;
    bottom: string;
    left: string;
    right: string;
    front: string;
    back: string;
  };
  position: THREE.Vector3;
}

export const SingleCubeComponent: React.FC<SingleCubeComponentProps> = ({
  color,
  position,
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
  const meshRef = useRef<THREE.Mesh>(null!);

  for (let i = 0; i < 6; i++) {
    // cube.push(<Plane position={[1, 1, 1]} rotation={[0, 0, 0]} color="red" />);
    cube.push(
      <Plane
        key={`plane-${facePositions[i].x}/${facePositions[i].y}/${facePositions[i].z}`}
        scale={1}
        respectiveCubePosition={position}
        position={facePositions[i]}
        staticRotation={faceRotations[i]}
        color={faceColors[i]}
        parentCubeRef={meshRef}
      />
    );
  }

  return (
    <>
      <RubiksContext.Consumer>
        {({ setClickedPosition, addCubeRefs, cubeRefs }) => {
          addCubeRefs!(meshRef);

          return (
            <mesh
              ref={meshRef}
              position={position}
              onClick={(e) => {
                e.stopPropagation();

                const currentPosition = meshRef.current.position;
                setClickedPosition!(currentPosition);
              }}
            >
              {cube}
            </mesh>
          );
        }}
      </RubiksContext.Consumer>
    </>
  );
};
