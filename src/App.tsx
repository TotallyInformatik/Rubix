import React, { useState, useRef, SyntheticEvent } from "react";

import "./App.css";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import {
  CameraController,
  SingleCubeComponent,
  RubiksContext,
} from "./components";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Euler, Vector3 } from "three";

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
          debug={false}
        />
      );
    }
  }
}

function App() {
  const [clickedPosition, setClickedPosition] = useState(
    new THREE.Vector3(0, 0, 0)
  );

  const [meshRefs, setMeshRefs] = useState<
    React.MutableRefObject<THREE.Mesh>[]
  >([]);

  const [orbitControls, setOrbitControls] = useState<OrbitControls>(null!);

  const [mesh1, setMesh1] = useState<THREE.Mesh>();

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          zIndex: "999",
        }}
      >
        <Canvas flat linear color="black">
          <color attach="background" args={[0.5, 0.5, 0.5]} />
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

            {rubiksCubeBoxes}

            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              shadow-mapSize={[1024, 1024]}
            />

            <mesh
              position={[0, -2, 0]}
              rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
            >
              <planeBufferGeometry attach="geometry" args={[10, 10]} />
              <meshPhongMaterial
                attach="material"
                color="green"
                side={THREE.DoubleSide}
              />
            </mesh>
          </RubiksContext.Provider>
        </Canvas>
      </div>
    </>
  );
}

export default App;
