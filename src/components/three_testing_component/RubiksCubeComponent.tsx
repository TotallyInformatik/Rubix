import { useSpring, a } from "@react-spring/three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag, useGesture } from "@use-gesture/react";
import React, { DragEvent, DragEventHandler, useEffect, useRef, useState } from "react"
import THREE, { Mesh, Object3D, Vector3, ZeroCurvatureEnding } from "three";
import { RubiksContext } from "../RubiksContext";

const meshRefs: Map<Vector3, React.MutableRefObject<THREE.Mesh>> = new Map();

export const Box = (props: any) => {

    // This reference will give us direct access to the mesh
    const mesh = useRef<THREE.Mesh>(null!);
    const position = props.position;
    meshRefs.set(position!, mesh);
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <RubiksContext.Consumer>
            {
                ({setClickedPosition, clickedPosition}) => {
                    return <mesh
                    {...props}
                    ref={mesh}
                    onClick={(e) => {
                        e.stopPropagation();
                        const position = props.position!;
                        setClickedPosition!(position);
                        console.log(clickedPosition);
                    }}
                    >
                        <boxGeometry args={[0.8, 0.8, 0.8]}/>
                        <meshBasicMaterial color={"black"}/>
                    </mesh>
                }
            }
        </RubiksContext.Consumer>
    );
}


function rotateAboutPoint(obj: any, point: Vector3, axis: Vector3, theta: number, pointIsWorld: boolean){
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
        rotateAboutPoint(currentMeshRef, new Vector3(1, 0, 0), new Vector3(1, 0, 0), Math.PI / 2, false);
        //currentMeshRef?.rotateOnAxis();
        console.log("rotating");
        //currentMeshRef?.rotateOnWorldAxis(new THREEVector3(0, 0, 0), 2);
    });

}

export const RubikscubeComponent = () => {

    return <>
        <group>
        <mesh
            position={[0, 0, 0]}
        >
            <planeBufferGeometry
                args={[3, 3, 3]}
                attach="geometry"
            />
            <meshBasicMaterial
                color={"black"} 
                // roughness={0.3}
                // metalness={0.3}
                attach="material"
            />
        </mesh>
            {
                <RubiksContext.Consumer>
                    {
                        ({rubiksCubeBlocks}) => {
                            return rubiksCubeBlocks;
                        }
                    }
                </RubiksContext.Consumer>
            }
        </group>
    </>;
}