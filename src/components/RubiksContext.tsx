import React, { Dispatch, SetStateAction } from "react";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type RubikContextType = {
  rubiksCubeBlocks: JSX.Element[];
  clickedPosition: THREE.Vector3; // used to update the display on the side
  setClickedPosition: (value: THREE.Vector3) => void;
  cubeRefs: React.MutableRefObject<THREE.Mesh>[];
  addCubeRefs: (ref: React.MutableRefObject<THREE.Mesh>) => void;
  orbitControls: OrbitControls | null;
  setOrbitControls: (orbitConrols: OrbitControls) => void;
};

export const RubiksContext = React.createContext<Partial<RubikContextType>>({});
