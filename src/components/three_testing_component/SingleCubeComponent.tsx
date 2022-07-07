// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { RubiksContext } from "../RubiksContext";
import rotateRubiks from "./RubiksCubeComponent";

function Plane(props: {
  scale: number;
  respectiveCubePosition: THREE.Vector3; // the position of the cube this plane belongs to.
  position: THREE.Vector3;
  rotation: THREE.Euler;
  color: THREE.Color;
}) {
  const offsetPosition = new THREE.Vector3();
  const [xGroup, setXGroup] = useState<React.MutableRefObject<THREE.Mesh>[]>([]);
  const [zGroup, setZGroup] = useState<React.MutableRefObject<THREE.Mesh>[]>([]);
  const [yGroup, setYGroup] = useState<React.MutableRefObject<THREE.Mesh>[]>([]);
  offsetPosition.copy(props.position);
  offsetPosition.multiplyScalar(1.01);


  const getRespectiveGroups = (cubeRefs: React.MutableRefObject<THREE.Mesh>[] | undefined) => {
    if (cubeRefs === undefined) return;
    

    const groups = [];
    const rotation = props.rotation;

    // yGroup: Y Coordinate stays the same
    if (rotation.x == 0 || rotation.x == Math.PI) {
      groups.push("y");
      const yGroup = [];
      const yCoordinate = props.respectiveCubePosition.y;
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;
  
        if (currentRef.position.y == yCoordinate) {
          yGroup.push(cubeRef);
        }
      }
    }

    setYGroup(yGroup);


    if (rotation.y == 0) {
      groups.push("x");

      // xGroup: X Coordinate stays the same
      const xGroup = [];
      const xCoordinate = props.respectiveCubePosition.x;
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;

        if (currentRef.position.x == xCoordinate) {
          xGroup.push(cubeRef);
        }
      }

      setXGroup(xGroup);

    }


    if ([Math.PI / 2, -Math.PI / 2].includes(rotation.x) || [Math.PI / 2, -Math.PI / 2].includes(rotation.y)) {
      groups.push("z");
      
      // zGroup: Z Coordinate stays the same
      const zGroup = [];
      const zCoordinate = props.respectiveCubePosition.z;
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;

        if (currentRef.position.z == zCoordinate) {
          zGroup.push(cubeRef);
        }
      }

      setZGroup(zGroup);


    }

    console.log(groups);

  }
  
  return (
    <>
      <RubiksContext.Consumer>
        {
          ({cubeRefs}) => {
            return <mesh onClick={() => getRespectiveGroups(cubeRefs)}>
              <mesh position={props.position} rotation={props.rotation}>
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
              <mesh position={offsetPosition} rotation={props.rotation}>
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
            </mesh>;
          }
        }
      </RubiksContext.Consumer>
    </>
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
  for (let i = 0; i < 6; i++) {
    // cube.push(<Plane position={[1, 1, 1]} rotation={[0, 0, 0]} color="red" />);
    cube.push(
      <Plane
        key={`plane-${facePositions[i].x}/${facePositions[i].y}/${facePositions[i].z}`}
        scale={1}
        respectiveCubePosition={position}
        position={facePositions[i]}
        rotation={faceRotations[i]}
        color={faceColors[i]}
      />
    );
  }

  const meshRef = useRef<THREE.Mesh>(null!);
  return (
    <>
      <RubiksContext.Consumer>
        {({ setClickedPosition, addCubeRefs, cubeRefs}) => {
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
