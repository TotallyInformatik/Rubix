import { useSpring, a } from "@react-spring/three";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useDrag, useGesture } from "@use-gesture/react";
import React, {
  DragEvent,
  DragEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import THREE, { Mesh, Object3D, Vector3, ZeroCurvatureEnding } from "three";
import { RubiksContext } from "../RubiksContext";

function rotateAboutPoint(
  obj: any,
  point: Vector3,
  axis: Vector3,
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
  point: Vector3,
  axis: Vector3,
  theta: number
) {
  rubiksCubeBoxes.forEach((rubixCubeBox) => {
    const currentMeshRef = rubixCubeBox.current;
    rotateAboutPoint(currentMeshRef, point, axis, theta, false);
    //currentMeshRef?.rotateOnAxis();
    console.log("rotating");
    //currentMeshRef?.rotateOnWorldAxis(new THREEVector3(0, 0, 0), 2);
  });
}

export const RubikscubeComponent = () => {
  return (
    <>
      <group>
        {
          <RubiksContext.Consumer>
            {({ rubiksCubeBlocks }) => {
              return rubiksCubeBlocks;
            }}
          </RubiksContext.Consumer>
        }
      </group>
    </>
  );
};
