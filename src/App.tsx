import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { RubiksContext } from './components/RubiksContext';
import { Box, ThreeTestingComponent } from './components/three_testing_component/ThreeTestingComponent';
import { Vector3 } from 'three';

const rubiksCubeBoxes: JSX.Element[] = [];


for (let x=-1; x<2; x++) {

    for (let y=-1; y<2; y++) {

        for (let z=-1; z<2; z++) {

            if (z === 0 && x === 0 && y === 0) continue;

            rubiksCubeBoxes.push(
                <Box 
                    key={`box-${x}${y}${z}`}
                    position={[x, y, z]}
                >
                </Box>
            );
        }
    }
}

function App() {

  const [clickedPosition, setClickedPosition] = 
    useState(new Vector3(0, 0, 0));
    
  return <>
    <div
      style={{
        width: "100vw", 
        height: "100vh",
        position: "relative",
        zIndex: "999"
      }}
    >
      <Canvas
          flat 
          linear
      >
        Camera
        <RubiksContext.Provider value={{
          rubiksCubeBlocks: rubiksCubeBoxes,
          clickedPosition: clickedPosition,
          setClickedPosition: (value: Vector3) => setClickedPosition(value)
        }}>  
          <ThreeTestingComponent/>
        </RubiksContext.Provider>
      </Canvas>
    </div>
  </>;

}

export default App;
