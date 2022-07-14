import { useThree } from "@react-three/fiber";
import { useEffect, useContext } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RubiksContext } from "../RubiksContext";

export const CameraController = () => {
  const { camera, gl } = useThree();

  const { setOrbitControls } = useContext(RubiksContext);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    setOrbitControls!(controls);

    controls.minDistance = 3;
    controls.maxDistance = 20;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};
