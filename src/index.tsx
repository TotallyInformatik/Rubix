import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Box, ThreeTestingComponent } from './components/three_testing_component/ThreeTestingComponent';
import { Canvas } from '@react-three/fiber';
import { RubiksContext } from './components/RubiksContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const rubiksCubeBoxes = [];
    
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

root.render(
  <React.StrictMode>
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
            <RubiksContext.Provider value={{
              rubiksCubeBlocks: rubiksCubeBoxes
            }}>  
              <ThreeTestingComponent/>
            </RubiksContext.Provider>
          </Canvas>
        </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
