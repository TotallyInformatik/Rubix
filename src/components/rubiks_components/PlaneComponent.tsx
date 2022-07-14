import { MeshProps, useThree } from "@react-three/fiber";
import { useGesture, UserGestureConfig } from "@use-gesture/react";
import React, { useRef, useState, useContext } from "react";
import * as THREE from "three";
import { MathUtils, Mesh, RGB_PVRTC_2BPPV1_Format } from "three";
import { approxEquals } from "../../utils";
import { RubiksContext } from "../RubiksContext";
import { rotateAboutPoint, rotateRubiks, roundToNearest90, setRotationRubiks } from "./RubiksCubeComponent";


const getRespectiveGroups = (
  cubeRefs: React.MutableRefObject<THREE.Mesh>[] | undefined,
  selfRef: React.MutableRefObject<THREE.Mesh>,
  parentMesh: THREE.Mesh
) => {

  // gruppen werden schon mal richtig ausgewählt.


  const groups = new Map<string, React.MutableRefObject<THREE.Mesh>[]>();

  selfRef.current.updateMatrixWorld();
  const rotation = new THREE.Euler(0, 0, 0);
  //selfRef.current.getWorldDirection(rotation);
  const currentMatrixWorld = selfRef.current.matrixWorld;
  rotation.setFromRotationMatrix(currentMatrixWorld, "XYZ", true);
  selfRef.current.updateMatrixWorld();

  const direction = selfRef.current.getWorldDirection(new THREE.Vector3());
  console.log(direction);

  const axes = ["x", "y", "z"];
  function getGroup(axisIndex: number) {
    if (cubeRefs === undefined) return;

    if (approxEquals(direction.getComponent(axisIndex), 0)) {
      const group = [];
      const coordinate = parentMesh.position.getComponent(axisIndex);
      for (const cubeRef of cubeRefs) {
        const currentRef = cubeRef.current;
  
        if (currentRef.position.getComponent(axisIndex) == coordinate) {
          group.push(cubeRef);
        }
      }
  
      groups.set(axes[axisIndex], group);
    }
  }

  getGroup(1);
  getGroup(0);
  getGroup(2);


  return groups;
};


export function Plane(props: {
  scale: number;
  respectiveCubePosition: THREE.Vector3; // the position of the cube this plane belongs to.
  position: THREE.Vector3;
  staticRotation: THREE.Euler;
  color: THREE.Color;
  parentCubeRef: React.RefObject<THREE.Mesh>;
}) {

  const { camera } = useThree();

  const offsetPosition = new THREE.Vector3();
  offsetPosition.copy(props.position);
  offsetPosition.multiplyScalar(1.01);

  const { orbitControls, cubeRefs } =
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
  const [lock, setLock] = useState("x");
  const rotSpeed = 1;

  const gestureConfig: UserGestureConfig = {
    //lock rotation for direction
    // PROBLEM: 
    // filterTaps / delay / etc. führen zu propagation, braucht man aber...
    drag: {
      delay: 1,
      axis: "lock",

    },
  }

  let cumulateRotation = 0;

  const bind = useGesture(
    {
      onDragStart: ({
        event,
        delta: [dx, dy],
        movement: [mx, my]
      }) => {
        event.stopPropagation();

        cumulateRotation += dx * rotSpeed + dy * rotSpeed;

        if (!orbitControls) return;
        if (props.parentCubeRef.current == null) return;
        if (orbitControls) orbitControls.enabled = false;

        const possibleGroups = getRespectiveGroups(cubeRefs, selfRef, props.parentCubeRef.current);
        const possibleKeys = Array.from(
          possibleGroups?.keys() as Iterable<string>
        );

        // setting selected groups
        const group: React.MutableRefObject<THREE.Mesh>[] = [];

        //if ()

        let index0 = 0;
        let index1 = 1;
        let currentKey = "";

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
        selfRef.current.updateMatrixWorld();
        const rotation = new THREE.Euler(0, 0, 0);

        const currentMatrixWorld = selfRef.current.matrixWorld;
        rotation.setFromRotationMatrix(currentMatrixWorld);
        selfRef.current.updateMatrixWorld();

        //console.log(rotation.x, rotation.y, rotation.z);

        if ((0 <= angle && angle < 45) || (315 < angle && angle <= 360)) {
          // zeigt nach "vorne";

          if (approxEquals(Math.abs(rotation.x), Math.PI / 2)) {
            console.log("exchaging index");
            index0 = 1;
            index1 = 0;
          }
          setInvertRotationDirection([
            approxEquals(rotation.x, -Math.PI / 2) ? -1 : 1,
            1,
          ]);
        } else if (45 < angle && angle < 135) {
          // zeigt nach "links";
          setInvertRotationDirection([
            approxEquals(rotation.x, -Math.PI / 2) ? -1 : 1,
            -1,
          ]);
        } else if (135 < angle && angle < 225) {
          // zeigt nach "hinten";
          setInvertRotationDirection([
            1,
            -1,
          ]);
          if (approxEquals(Math.abs(rotation.x), Math.PI / 2)) {
            console.log("exchaging index");
            index0 = 1;
            index1 = 0;
            setInvertRotationDirection([
              approxEquals(rotation.x, -Math.PI / 2) ? 1 : -1,
              -1,
            ]);
          }
        } else if (225 < angle && angle < 315) {
          // zeigt nach "rechts";
          // es muss nichts getan werden
          if (approxEquals(Math.abs(rotation.x), Math.PI / 2)) {
            setInvertRotationDirection([
              approxEquals(rotation.x, -Math.PI / 2) ? 1 : -1,
              1,
            ]);
          }
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          currentKey = possibleKeys[index0];
        } else if (Math.abs(dx) < Math.abs(dy)) {
          currentKey = possibleKeys[index1];
        } else {
          currentKey = possibleKeys[index0];
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

        setSelectedGroup(group);

        // selectedGroup.rotation.set(MathUtils.degToRad(45), 0, 0);
      },
      onDrag: ({ event, delta: [dx, dy], movement: [mx, my] }) => {
        event.stopPropagation();

        cumulateRotation += invertRotationDirection[0] * dx * rotSpeed +
        invertRotationDirection[1] * dy * rotSpeed;

        rotateRubiks(
          selectedGroup,
          currentRotationAxis,
          currentRotationAxis,
          THREE.MathUtils.degToRad(
            invertRotationDirection[0] * dx * rotSpeed +
            invertRotationDirection[1] * dy * rotSpeed
          )
        );

      },
      onDragEnd: ({ event, offset: [x, y], movement: [mx, my], delta: [dx, dy] }) => {
        event.stopPropagation();

        cumulateRotation += dx * rotSpeed + dy * rotSpeed;
        // snapping in x direction
        //const rotation = mx * rotSpeed + my * rotSpeed;
        const rotation = cumulateRotation;
        const rotationIteration = roundToNearest90(rotation);

        const offset = rotationIteration - rotation;

        rotateRubiks(
          selectedGroup,
          currentRotationAxis,
          currentRotationAxis,
          THREE.MathUtils.degToRad(
            offset
          )
        );

        selectedGroup.forEach((rubiksCubeBox) => {
          const currentRef = rubiksCubeBox.current;
          const currentRotation = rubiksCubeBox.current.rotation;
          const currentRotationInDegrees = [
            roundToNearest90(MathUtils.radToDeg(currentRotation.x)),
            roundToNearest90(MathUtils.radToDeg(currentRotation.y)),
            roundToNearest90(MathUtils.radToDeg(currentRotation.z)),
          ];
          currentRef.setRotationFromEuler(new THREE.Euler(
            MathUtils.degToRad(currentRotationInDegrees[0]),
            MathUtils.degToRad(currentRotationInDegrees[1]),
            MathUtils.degToRad(currentRotationInDegrees[2]),
          ));
          currentRef.position.round();

        });


        setSelectedGroup([]);
        cumulateRotation = 0;

        if (orbitControls) orbitControls.enabled = true;
      },
    },
    gestureConfig
  );

  const selfRef = useRef<THREE.Mesh>(null!);

  return (
    <>
      <mesh {...(bind() as MeshProps)}>
        <mesh ref={selfRef}
        position={props.position} rotation={props.staticRotation}>
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
        <mesh position={offsetPosition} rotation={props.staticRotation}>
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