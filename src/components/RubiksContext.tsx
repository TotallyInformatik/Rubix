import React from "react";

type RubikContextType = {
    rubiksCubeBlocks: JSX.Element[],
}

export const RubiksContext = React.createContext<Partial<RubikContextType>>({});