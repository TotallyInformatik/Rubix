import { useSpring, a } from "@react-spring/three";
import { Canvas, useFrame, useThree, Vector3 } from "@react-three/fiber";
import { useDrag, useGesture } from "@use-gesture/react";
import React, { DragEvent, DragEventHandler, useEffect, useRef, useState } from "react"
import THREE, { Mesh, Object3D, Vector3 as THREEVector3, ZeroCurvatureEnding } from "three";
import { RubiksContext } from "../RubiksContext";

const meshRefs: Map<Vector3, React.MutableRefObject<THREE.Mesh>> = new Map();

export const Box = (props: JSX.IntrinsicElements["mesh"]) => {

    // This reference will give us direct access to the mesh
    const mesh = useRef<THREE.Mesh>(null!);
    meshRefs.set(props.position!, mesh);
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={mesh}
            onClick={(e) => {
                e.stopPropagation();
                console.log(props.position);
            }}
        >
            <boxGeometry args={[0.8, 0.8, 0.8]}/>
            <meshBasicMaterial color={"black"}/>
        </mesh>
    );
}


function rotateAboutPoint(obj: any, point: THREEVector3, axis: THREEVector3, theta: number, pointIsWorld: boolean){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function rotateRubiks(rubiksCubeBoxes: JSX.Element[], positionIndex: number, position: number) {

    // testing rotation animation:
    const rubixGroup: JSX.Element[] = [];
    rubiksCubeBoxes.forEach((box) => {
        console.log(box.props.position);
        if (box.props.position[positionIndex] === position) {
            rubixGroup.push(box);
        }
    });

    rubixGroup.forEach((rubixBlock) => {
        const currentMeshRef = meshRefs.get(rubixBlock.props.position)?.current;
        rotateAboutPoint(currentMeshRef, new THREEVector3(1, 0, 0), new THREEVector3(1, 0, 0), Math.PI / 2, false);
        //currentMeshRef?.rotateOnAxis();
        console.log("rotating");
        //currentMeshRef?.rotateOnWorldAxis(new THREEVector3(0, 0, 0), 2);
    });

}

export const ThreeTestingComponent = () => {

    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    const [spring, set] = useSpring(() => ({ scale: [1, 1, 1], position: [0, 0, 0], rotation: [0, 0, 0]}));
    const gestures = useGesture({
        onDrag: ({offset: [x, y]}) => {

            const [currentY, currentX]  = spring.rotation.get();
            console.log("x: " + currentX);
            console.log("y: " + currentY);
    
            set({ rotation: [currentY / aspect + y / aspect, currentX / aspect + x / aspect, 0] });
        }
    });
    const draggingProps: any = {...gestures()};
    const springProps: any = {...spring};


    return <>
        <a.group {...springProps} {...draggingProps}>
            {
                <RubiksContext.Consumer>
                    {
                        ({rubiksCubeBlocks}) => {
                            return rubiksCubeBlocks;
                        }
                    }
                </RubiksContext.Consumer>
            }
        </a.group>
    </>;
}