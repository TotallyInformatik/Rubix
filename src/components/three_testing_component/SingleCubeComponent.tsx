// import { Canvas, useFrame } from "@react-three/fiber";
// import { useEffect, useRef, useState } from "react";
import { MeshProps, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import React, { useRef, useState, useContext } from "react";
import * as THREE from "three";
import { MathUtils, Mesh } from "three";
import { RubiksContext } from "../RubiksContext";
import { rotateAboutPoint, rotateRubiks } from "./RubiksCubeComponent";

function Plane(props: {
  scale: number;
  respectiveCubePosition: THREE.Vector3; // the position of the cube this plane belongs to.
  position: THREE.Vector3;
  rotation: THREE.Euler;
  color: THREE.Color;
  parentCubeRef: React.RefObject<THREE.Mesh>;
}) {
  const getRespectiveGroups = (
    cubeRefs: React.MutableRefObject<THREE.Mesh>[] | undefined
  ) => {
    if (cubeRefs === undefined) return;

    const groups = new Map<string, React.MutableRefObject<THREE.Mesh>[]>();
    const rotation = props.rotation;

    // yGroup: Y Coordinate stays the same
    if (rotation.x == 0 || rotation.x == Math.PI) {
      const yGroup = [];
      const yCoordinate = props.respectiveCubePosition.y;
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;

        if (currentRef.position.y == yCoordinate) {
          yGroup.push(cubeRef);
        }
      }

      groups.set("y", yGroup);
    }

    if (rotation.y == 0) {
      // xGroup: X Coordinate stays the same
      const xGroup = [];
      const xCoordinate = props.respectiveCubePosition.x;
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;

        if (currentRef.position.x == xCoordinate) {
          xGroup.push(cubeRef);
        }
      }
      groups.set("x", xGroup);
    }

    if (
      [Math.PI / 2, -Math.PI / 2].includes(rotation.x) ||
      [Math.PI / 2, -Math.PI / 2].includes(rotation.y)
    ) {
      // zGroup: Z Coordinate stays the same
      const zGroup = [];
      const zCoordinate = props.respectiveCubePosition.z;
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;

        if (currentRef.position.z == zCoordinate) {
          zGroup.push(cubeRef);
        }
      }
      groups.set("z", zGroup);
    }

    return groups;
  };

  const { camera } = useThree();

  const offsetPosition = new THREE.Vector3();
  offsetPosition.copy(props.position);
  offsetPosition.multiplyScalar(1.01);

  const { orbitControls, cubeRefs, currentDraggedCube, setCurrentDraggedCube } =
    useContext(RubiksContext);

  const [selectedGroup, setSelectedGroup] = useState<
    React.MutableRefObject<THREE.Mesh>[]
  >([]);
  const [currentRotationAxis, setCurrentRotationAxis] = useState(
    new THREE.Vector3(0, 0, 0)
  );
  const [invertRotationDirection, setInvertRotationDirection] = useState([
    1, 1,
  ]);
  const rotSpeed = 1;

  const bind = useGesture(
    {
      onDragStart: ({
        event,
        offset: [x, y],
        target,
        currentTarget,
        delta: [dx, dy],
      }) => {
        event.stopPropagation();

        if (!orbitControls) return;
        if (orbitControls) orbitControls.enabled = false;

        const possibleGroups = getRespectiveGroups(cubeRefs);
        const possibleKeys = Array.from(
          possibleGroups?.keys() as Iterable<string>
        );

        // setting selected groups
        const group: React.MutableRefObject<THREE.Mesh>[] = [];

        //if ()

        let index0 = 0;
        let index1 = 1;
        let currentKey = "";

        if (Math.abs(props.rotation.x) == Math.PI / 2) {
          // the plane is facing upwards or downwards

          // figuring out the orientation of the camera for the different axes:
          const vector1 = new THREE.Vector2(
            camera.position.x - orbitControls.target.x,
            camera.position.z - orbitControls.target.z
          );
          const vector2 = new THREE.Vector2(0, 1);

          let angle = MathUtils.radToDeg(
            Math.acos(
              vector1.dot(vector2) / (vector1.length() * vector2.length())
            )
          );

          if (vector1.x < 0) {
            angle = 360 - angle;
          }

          // Differentiation of cases:
          if ((0 <= angle && angle < 45) || (315 < angle && angle <= 360)) {
            // zeigt nach "vorne";
            index0 = 1;
            index1 = 0;
            setInvertRotationDirection([
              props.rotation.x == -Math.PI / 2 ? -1 : 1,
              1,
            ]);
          } else if (45 < angle && angle < 135) {
            // zeigt nach "links";
            setInvertRotationDirection([
              props.rotation.x == -Math.PI / 2 ? -1 : 1,
              -1,
            ]);
          } else if (135 < angle && angle < 225) {
            // zeigt nach "hinten";
            index0 = 1;
            index1 = 0;
            setInvertRotationDirection([
              props.rotation.x == -Math.PI / 2 ? 1 : -1,
              -1,
            ]);
          } else if (225 < angle && angle < 315) {
            // zeigt nach "rechts";
            // es muss nichts getan werden
            setInvertRotationDirection([
              props.rotation.x == -Math.PI / 2 ? 1 : -1,
              1,
            ]);
          }
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          console.log("horizontal movement");
          currentKey = possibleKeys[index0];
        } else if (Math.abs(dx) < Math.abs(dy)) {
          console.log("vertical movement");
          currentKey = possibleKeys[index1];
        }
        possibleGroups?.get(currentKey)?.forEach((element) => {
          group.push(element);
        });

        switch (currentKey) {
          case "x":
            setCurrentRotationAxis(new THREE.Vector3(1, 0, 0));
            break;
          case "y":
            setCurrentRotationAxis(new THREE.Vector3(0, 1, 0));
            break;
          case "z":
            setCurrentRotationAxis(new THREE.Vector3(0, 0, 1));
            break;
          default:
            console.log("error: invalid axis");
        }

        /*
        const newSelectedGroup = new THREE.Group();

        group.forEach((element) => {
          // console.log(element.current.position);
          // element.current.material = new THREE.MeshBasicMaterial({
          //   color: "black",
          // });
          // element.current.material.needsUpdate = true;
          //element.current.position.x = 2;

          newSelectedGroup.add(element.current);
        });

        setSelectedGroup(newSelectedGroup);
        console.log(selectedGroup);
        */

        setSelectedGroup(group);

        // selectedGroup.rotation.set(MathUtils.degToRad(45), 0, 0);
      },
      onDrag: ({ event, delta: [dx, dy], movement: [mx, my] }) => {
        event.stopPropagation();

        const rotation = props.parentCubeRef.current?.rotation;
        if (rotation == undefined) return;

        const dRotationX = THREE.MathUtils.degToRad(dy * rotSpeed);
        const dRotationY = THREE.MathUtils.degToRad(dx * rotSpeed);

        rotateRubiks(
          selectedGroup,
          currentRotationAxis,
          currentRotationAxis,
          THREE.MathUtils.degToRad(
            invertRotationDirection[0] * dx * rotSpeed +
              invertRotationDirection[1] * dy * rotSpeed
          )
        );

        /*
        rotation.set(
          rotation.x + dRotationX,
          rotation.y + dRotationY,
          rotation.z
        );
        */
      },
      onDragEnd: ({ event, movement: [mx, my] }) => {
        event.stopPropagation();

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

          rotation.set(
            THREE.MathUtils.degToRad(rotationCountX * 90),
            rotation.y,
            rotation.z
          );
        }

        if (orbitControls) orbitControls.enabled = true;
      },
    },
    {
      //lock rotation for direction
      drag: {
        axis: "lock",
        filterTaps: true,
      },
    }
  );

  return (
    <>
      <mesh {...(bind() as MeshProps)}>
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
