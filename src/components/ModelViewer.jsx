// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

// export default function ModelViewer({ objUrl }) {
//   const groupRef = useRef();

//   useEffect(() => {
//     if (!objUrl || !groupRef.current) return;

//     const loader = new OBJLoader();
//     loader.load(
//       objUrl,
//       (obj) => {
//         groupRef.current.clear();
//         groupRef.current.add(obj);
//       },
//       undefined,
//       (err) => console.error("OBJ Load Error:", err)
//     );
//   }, [objUrl]);

//   return <group ref={groupRef} />;
// }

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ModelViewer({ modelUrl, type }) {
  const groupRef = useRef();

  useEffect(() => {
    if (!modelUrl || !groupRef.current) return;

    const group = groupRef.current;

    // clear previous model
    group.clear();

    // -------------------------
    // LOAD OBJ (Shape-E)
    // -------------------------
    if (type === "obj") {
      const loader = new OBJLoader();

      loader.load(
        modelUrl,
        (obj) => {
          group.add(obj);
        },
        undefined,
        (err) => console.error("OBJ Load Error:", err)
      );
    }

    // -------------------------
    // LOAD GLB (TripoSR)
    // -------------------------
    if (type === "glb") {
      const loader = new GLTFLoader();

      loader.load(
        modelUrl,
        (gltf) => {
          group.add(gltf.scene);
        },
        undefined,
        (err) => console.error("GLB Load Error:", err)
      );
    }

  }, [modelUrl, type]);

  return <group ref={groupRef} />;
}