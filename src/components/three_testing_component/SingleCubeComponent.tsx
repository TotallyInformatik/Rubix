// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
import { MeshProps } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import React, { useRef, useState, useContext } from "react";
import * as THREE from "three";
import { RubiksContext } from "../RubiksContext";

function Plane(props: {
  scale: number;
  respectiveCubePosition: THREE.Vector3; // the position of the cube this plane belongs to.
  position: THREE.Vector3;
  rotation: THREE.Euler;
  color: THREE.Color;
  parentCubeRef: React.RefObject<THREE.Mesh>;
}) {
  const { orbitControls, cubeRefs } = useContext(RubiksContext);

  const rotSpeed = 1;

  const bind = useGesture(
    {
      onDragStart: ({ event }) => {
        event.stopPropagation();

        getRespectiveGroups(cubeRefs)

        if (orbitControls) orbitControls.enabled = false;
      },
      onDrag: ({ event, delta: [dx, dy], movement: [mx, my] }) => {
        event.stopPropagation();

        const rotation = props.parentCubeRef.current?.rotation;
        if (rotation == undefined) return;
        console.log(mx, my);

        const dRotationX = THREE.MathUtils.degToRad(dy * rotSpeed);
        const dRotationY = THREE.MathUtils.degToRad(dx * rotSpeed);

        rotation.set(
          rotation.x + dRotationX,
          rotation.y + dRotationY,
          rotation.z
        );
      },
      onDragEnd: ({ movement: [mx, my] }) => {
        const rotation = props.parentCubeRef.current?.rotation;

        if (rotation == undefined) return;

        let rotationCountY;
        const rotY = THREE.MathUtils.radToDeg(rotation.y);

        if (Math.abs(mx) * rotSpeed > 45) {
          if (mx > 0) {
            //left
            rotationCountY = Math.ceil(rotY / 90);
          } else {
            //right
            rotationCountY = Math.floor(rotY / 90);
          }
          rotation.set(
            rotation.x,
            THREE.MathUtils.degToRad(rotationCountY * 90),
            rotation.z
          );
        } else if (Math.abs(mx) * rotSpeed < 45) {
          if (mx > 0) {
            //left
            rotationCountY = Math.floor(rotY / 90);
          } else {
            //right
            rotationCountY = Math.ceil(rotY / 90);
          }
          console.log("Y");
          rotation.set(
            rotation.x,
            THREE.MathUtils.degToRad(rotationCountY * 90),
            rotation.z
          );
        }

        let rotationCountX;
        const rotX = THREE.MathUtils.radToDeg(rotation.x);

        if (Math.abs(my) * rotSpeed > 45) {
          if (my > 0) {
            //left
            rotationCountX = Math.ceil(rotX / 90);
          } else {
            //right
            rotationCountX = Math.floor(rotX / 90);
          }

          rotation.set(
            THREE.MathUtils.degToRad(rotationCountX * 90),
            rotation.y,
            rotation.z
          );
        } else if (Math.abs(my) * rotSpeed < 45) {
          if (my > 0) {
            //left
            rotationCountX = Math.floor(rotX / 90);
          } else {
            //right
            rotationCountX = Math.ceil(rotX / 90);
          }
          console.log("X");

          rotation.set(
            THREE.MathUtils.degToRad(rotationCountX * 90),
            rotation.y,
            rotation.z
          );
        }

        // const currentObject = props.parentCubeRef.current;

        // if (currentObject != null) currentObject.updateMatrix();

        // currentObject.geometry.applyMatrix(currentObject.matrix);

        // currentObject.position.set(0, 0, 0);
        // currentObject.rotation.set(0, 0, 0);
        // currentObject.scale.set(1, 1, 1);
        // currentObject.updateMatrix();

        if (orbitControls) orbitControls.enabled = true;
      },
    },
    {
      //lock rotation for direction
      drag: {
        axis: "lock",
      },
    }
  );

  const test = new THREE.PlaneBufferGeometry(1, 1); // <--
  const normals = test.attributes.normal.array;
  const normal = new THREE.Vector3(normals[0], normals[1], normals[2]);
  console.log(normal);

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
      <mesh 
      {...bind() as MeshProps}>
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
      </mesh>
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
  const meshRef = useRef<THREE.Mesh>(null!);

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
        parentCubeRef={meshRef}
      />
    );
  }

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
