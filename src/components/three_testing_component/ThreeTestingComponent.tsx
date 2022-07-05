import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react"

const Box = (props: JSX.IntrinsicElements["mesh"]) => {

    // This reference will give us direct access to the mesh
    const mesh = useRef<THREE.Mesh>(null!);
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    /*
    useFrame((state, delta) => {
        mesh.current.rotation.x += 0.01;
        mesh.current.rotation.y += 0.01;
        mesh.current.rotation.z += 0.01;
    });
    */
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}


const dragStart = (e: DragEvent): void => {
    console.log("dragging start");
    console.log(e.x);
    console.log(e.y);
}
const dragEnd = (e: DragEvent): void => {

}

export const ThreeTestingComponent = () => {

    /*
    useEffect(() => {

        console.log("preparing drag events");

        window.addEventListener("dragstart", (ev: DragEvent) => dragStart(ev));
        window.addEventListener("dragend", dragEnd);

        return () => {
            // cleanup
            window.removeEventListener("dragstart", (ev: DragEvent) => dragStart(ev));
            window.removeEventListener("dragend", dragEnd);
        }

    });
    */


    const rubiksCubeBoxes = [];
    
    for (let x=-1; x<2; x++) {
        for (let y=-1; y<2; y++) {
            for (let z=-1; z<2; z++) {
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
    return <>
        <div style={{width: "100vw", height: "100vh"}}>
            <Canvas flat linear
            >
                <ambientLight/>
                <pointLight position={[10, 10, 10]} />
                {
                    rubiksCubeBoxes
                }
            </Canvas>
        </div>
    </>;
}