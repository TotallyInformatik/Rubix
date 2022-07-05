import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { RubiksContext } from './components/RubiksContext';
import { Box, RubikscubeComponent } from './components/three_testing_component/RubiksCubeComponent';
import { Vector3 } from 'three';
import { CameraController } from './components/three_testing_component/CameraController';
import { SingleCubeComponent } from './components/three_testing_component/SingleCubeComponent';

const rubiksCubeBoxes: JSX.Element[] = [];


for (let x=-1; x<2; x++) {

    for (let y=-1; y<2; y++) {

        for (let z=-1; z<2; z++) {

            if (z === 0 && x === 0 && y === 0) continue;

            rubiksCubeBoxes.push(
                <SingleCubeComponent
                    key={`box-${x}${y}${z}`}
                    position={new Vector3(x, y, z)}
                    color={{
                      top: y === 1 ? "orange" : "black",
                      bottom: y === -1 ? "red" : "black",
                      left: x === -1 ? "green" : "black",
                      right: x === 1 ? "blue" : "black",
                      front: z === 1 ? "white": "black",
                      back: z === -1 ? "yellow" : "black"
                    }}
                />
            );
        }

    }

}

function App() {

  const [clickedPosition, setClickedPosition] = 
    useState(new Vector3(0, 0, 0));
    
  const [meshRefs, setMeshRefs] = 
    useState<Map<Vector3, React.MutableRefObject<THREE.Mesh>>>(new Map());

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
          color="black"
      >
        <color attach="background" args={[0.5, 0.5, 0.5]} />
        <CameraController />
        <RubiksContext.Provider value={{
          rubiksCubeBlocks: rubiksCubeBoxes,
          clickedPosition: clickedPosition,
          setClickedPosition: (value: Vector3) => setClickedPosition(value),
          cubeRefs: meshRefs,
          setCubeRefs: (key: Vector3, value: React.MutableRefObject<THREE.Mesh>) => {
            const currentCubeRefs = meshRefs;
            currentCubeRefs.set(key, value);
            setMeshRefs(currentCubeRefs);
          }
        }}>  
          <RubikscubeComponent/>
        </RubiksContext.Provider>
      </Canvas>
    </div>
  </>;

}

export default App;
