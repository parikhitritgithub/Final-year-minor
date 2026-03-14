// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import ModelViewer from "./ModelViewer";
// import "./PreviewPanel.css";

// function PreviewPanel({ generatedModel, isGenerating }) {
//   return (
//     <div className="preview-panel">
//       <div className="preview-area">
//         {isGenerating ? (
//           <div className="generating-state">
//             <div className="loading-spinner"></div>
//             <p>Generating your 3D model...</p>
//           </div>
//         ) : generatedModel ? (
//           <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
//             <ambientLight intensity={0.5} />
//             <directionalLight position={[5, 5, 5]} />
//             <ModelViewer objUrl={generatedModel.previewUrl} />
//             <OrbitControls />
//           </Canvas>
//         ) : (
//           <div className="empty-state">
//             <p>Your 3D model will appear here</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PreviewPanel;

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ModelViewer from "./ModelViewer";
import "./PreviewPanel.css";

function PreviewPanel({ generatedModel, isGenerating }) {
  return (
    <div className="preview-panel">
      <div className="preview-area">

        {isGenerating ? (

          <div className="generating-state">
            <div className="loading-spinner"></div>
            <p>Generating your 3D model...</p>
          </div>

        ) : generatedModel ? (

          <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />

            {/* Load model */}
            <ModelViewer
              modelUrl={generatedModel.previewUrl}
              type={generatedModel.type}
            />

            <OrbitControls />

          </Canvas>

        ) : (

          <div className="empty-state">
            <p>Your 3D model will appear here</p>
          </div>

        )}

      </div>
    </div>
  );
}

export default PreviewPanel;