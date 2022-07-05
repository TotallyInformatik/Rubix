import React, { Dispatch, SetStateAction } from "react";
import { Vector3 } from "three";

type RubikContextType = {
    rubiksCubeBlocks: JSX.Element[],
    clickedPosition: THREE.Vector3, // used to update the display on the side
    setClickedPosition: (value: THREE.Vector3) => void
}

export const RubiksContext = React.createContext<Partial<RubikContextType>>({});