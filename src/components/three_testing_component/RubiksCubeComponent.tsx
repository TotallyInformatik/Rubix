import React, {
  useState,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RubiksContext } from "../RubiksContext";
import { CameraController } from "./CameraController";
import { SingleCubeComponent } from "./SingleCubeComponent";

function rotateAboutPoint(
  obj: any,
  point: THREE.Vector3,
  axis: THREE.Vector3,
  theta: number,
  pointIsWorld: boolean
) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

/**
 * @param rubiksCubeBoxes array of refs to the rubikscube boxes that should be rotated. (should all be located in one plane)
 * @param point (idk just input the same value as axis)
 * @param axis (the axis around which the boxes should be rotated -> x-axis: {1, 0, 0}, y-axis: {0, 1, 0}, ... )
 * @param theta the angle of rotation
 */
export default function rotateRubiks(
  rubiksCubeBoxes: React.MutableRefObject<THREE.Mesh>[],
  point: THREE.Vector3,
  axis: THREE.Vector3,
  theta: number
) {
  rubiksCubeBoxes.forEach((rubixCubeBox) => {
    const currentMeshRef = rubixCubeBox.current;
    rotateAboutPoint(currentMeshRef, point, axis, theta, false);
  });
}

export const RubikscubeComponent = () => {

  const rubiksCubeBoxes: JSX.Element[] = [];

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {
        if (z === 0 && x === 0 && y === 0) continue;

        rubiksCubeBoxes.push(
          <SingleCubeComponent
            key={`box-${x}${y}${z}`}
            position={new THREE.Vector3(x, y, z)}
            color={{
              top: y === 1 ? "orange" : "black",
              bottom: y === -1 ? "red" : "black",
              left: x === -1 ? "green" : "black",
              right: x === 1 ? "blue" : "black",
              front: z === 1 ? "white" : "black",
              back: z === -1 ? "yellow" : "black",
            }}
          />
        );
      }
    }
  }

  const [clickedPosition, setClickedPosition] = useState(
    new THREE.Vector3(0, 0, 0)
  );

  const [meshRefs, setMeshRefs] = useState<
    React.MutableRefObject<THREE.Mesh>[]
  >([]);

  const [orbitControls, setOrbitControls] = useState<OrbitControls>(null!);


  return (
    <>
      <RubiksContext.Provider
        value={{
          rubiksCubeBlocks: rubiksCubeBoxes,
          clickedPosition: clickedPosition,
          setClickedPosition: (value: THREE.Vector3) =>
            setClickedPosition(value),
          cubeRefs: meshRefs,
          addCubeRefs: (ref: React.MutableRefObject<THREE.Mesh>) => {
            if (meshRefs.includes(ref)) return;
            meshRefs.push(ref);
            setMeshRefs(meshRefs);
          },
          orbitControls: orbitControls,
          setOrbitControls: (newOrbitControls: OrbitControls) => {
            setOrbitControls(newOrbitControls);
          },
        }}
      >
        <CameraController />
        <group>
          {
            <RubiksContext.Consumer>
              {({ rubiksCubeBlocks }) => {
                return rubiksCubeBlocks;
              }}
            </RubiksContext.Consumer>
          }
        </group>
      </RubiksContext.Provider>
    </>
  );
};
