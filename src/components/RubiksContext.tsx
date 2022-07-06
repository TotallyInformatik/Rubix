import React, { Dispatch, SetStateAction } from "react";
import { Vector3 } from "three";

type RubikContextType = {
    rubiksCubeBlocks: JSX.Element[],
    clickedPosition: THREE.Vector3, // used to update the display on the side
    setClickedPosition: (value: THREE.Vector3) => void,
    cubeRefs: Map<Vector3, React.MutableRefObject<THREE.Mesh>>, // !! do not use the key values to determine the current position of the cubes.
    setCubeRefs: (key: Vector3, value: React.MutableRefObject<THREE.Mesh>) => void
}

export const RubiksContext = React.createContext<Partial<RubikContextType>>({});