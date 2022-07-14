import React from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import { RubikscubeComponent } from "./components";

function App() {
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
          <RubikscubeComponent />
          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            shadow-mapSize={[1024, 1024]}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-10, 10, 10, -10]}
            />
          </directionalLight>
          <primitive object={new THREE.AxesHelper(10)} />
        </Canvas>
      </div>
    </>
  );
}

export default App;
