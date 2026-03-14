// import React, { useState } from "react";
// import GeneratorHeader from "./GeneratorHeader";
// import ImageControlPanel from "./ImageControlPanel";
// import PreviewPanel from "./PreviewPanel";
// import GeneratorFooter from "./GeneratorFooter";
// import "./GeneratorPage.css";

// export default function ImageTo3DPage() {

//   const API_URL = "https://nonoptimistical-ascetically-xenia.ngrok-free.dev";

//   const [image, setImage] = useState(null);
//   const [detailLevel, setDetailLevel] = useState("Med");
//   const [textureQuality, setTextureQuality] = useState("Standard");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedModel, setGeneratedModel] = useState(null);

//   const handleGenerate = async () => {

//     if (!image || !image.file) {
//       alert("Please upload an image first.");
//       return;
//     }

//     setIsGenerating(true);
//     setGeneratedModel(null);

//     try {

//       const formData = new FormData();

//       // send the actual file
//       formData.append("file", image.file, image.file.name);

//       console.log("Sending image to backend...");

//       const response = await fetch(`${API_URL}/generate`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Backend error:", errorText);
//         throw new Error("Generation failed");
//       }

//       const blob = await response.blob();

//       const JSZip = (await import("jszip")).default;
//       const zip = await JSZip.loadAsync(blob);

//       const objFile = zip.file("model.obj");

//       if (!objFile) {
//         throw new Error("OBJ file not found inside ZIP.");
//       }

//       const objBlob = await objFile.async("blob");
//       const objUrl = URL.createObjectURL(objBlob);

//       setGeneratedModel({
//         previewUrl: objUrl,
//         fileBlob: objBlob,
//         fileName: "generated_model.obj",
//       });

//     } catch (error) {

//       console.error(error);
//       alert("Image to 3D generation failed.");

//     }

//     setIsGenerating(false);

//   };

//   const handleDownload = () => {

//     if (!generatedModel || !generatedModel.fileBlob) return;

//     const url = URL.createObjectURL(generatedModel.fileBlob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = generatedModel.fileName || "model.obj";
//     a.click();

//     URL.revokeObjectURL(url);

//   };

//   return (
//     <div className="generator-page">

//       <GeneratorHeader title="Image to 3D Generator" />

//       <main className="generator-main">
//         <div className="container">

//           <div className="generator-workspace">

//             <ImageControlPanel
//               image={image}
//               setImage={setImage}
//               detailLevel={detailLevel}
//               setDetailLevel={setDetailLevel}
//               textureQuality={textureQuality}
//               setTextureQuality={setTextureQuality}
//               onGenerate={handleGenerate}
//               onDownload={handleDownload}
//               isGenerating={isGenerating}
//             />

//             <PreviewPanel
//               generatedModel={generatedModel}
//               isGenerating={isGenerating}
//               prompt={"Image to 3D"}
//             />

//           </div>

//         </div>
//       </main>

//       <GeneratorFooter />

//     </div>
//   );
// }

import React, { useState } from "react";
import GeneratorHeader from "./GeneratorHeader";
import ImageControlPanel from "./ImageControlPanel";
import PreviewPanel from "./PreviewPanel";
import GeneratorFooter from "./GeneratorFooter";
import "./GeneratorPage.css";

export default function ImageTo3DPage() {

  const SHAPE_API = "https://nonoptimistical-ascetically-xenia.ngrok-free.dev";
  const TRIPO_API = "https://e4f1-213-173-108-219.ngrok-free.app";

  const [image, setImage] = useState(null);
  const [detailLevel, setDetailLevel] = useState("Med");
  const [textureQuality, setTextureQuality] = useState("Standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModel, setGeneratedModel] = useState(null);

  const handleGenerate = async () => {

    if (!image || !image.file) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGeneratedModel(null);

    try {

      // --------------------------------
      // STANDARD → SHAPE-E MODEL
      // --------------------------------
      if (textureQuality === "Standard") {

        const formData = new FormData();
        formData.append("file", image.file);

        const response = await fetch(`${SHAPE_API}/generate`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Shape-E generation failed");
        }

        const blob = await response.blob();

        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(blob);

        const objFile = zip.file("model.obj");

        if (!objFile) {
          throw new Error("OBJ not found in ZIP");
        }

        const objBlob = await objFile.async("blob");
        const objUrl = URL.createObjectURL(objBlob);

        setGeneratedModel({
          previewUrl: objUrl,
          fileBlob: objBlob,
          fileName: "shape_model.obj",
          type: "obj"
        });
      }

      // --------------------------------
      // 4K → TRIPOSR MODEL
      // --------------------------------
      if (textureQuality === "4K") {

        const formData = new FormData();
        formData.append("image", image.file);

        const response = await fetch(`${TRIPO_API}/generate-image`, {
          method: "POST",
          body: formData,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("TripoSR error:", errorText);
          throw new Error("TripoSR generation failed");
        }

        const data = await response.json();

        if (!data.glb_url) {
          throw new Error("Backend did not return GLB URL");
        }

        const glbUrl = TRIPO_API + data.glb_url;

        const glbResponse = await fetch(glbUrl, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!glbResponse.ok) {
          throw new Error("Failed to fetch GLB file");
        }

        const glbBlob = await glbResponse.blob();
        const blobUrl = URL.createObjectURL(glbBlob);

        setGeneratedModel({
          previewUrl: blobUrl,
          fileBlob: glbBlob,
          fileName: "tripo_model.glb",
          type: "glb"
        });
      }

    } catch (error) {

      console.error(error);
      alert("Generation failed");

    }

    setIsGenerating(false);
  };

  const handleDownload = () => {

    if (!generatedModel) return;

    const url = URL.createObjectURL(generatedModel.fileBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = generatedModel.fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="generator-page">

      <GeneratorHeader title="Image to 3D Generator" />

      <main className="generator-main">
        <div className="container">

          <div className="generator-workspace">

            <ImageControlPanel
              image={image}
              setImage={setImage}
              detailLevel={detailLevel}
              setDetailLevel={setDetailLevel}
              textureQuality={textureQuality}
              setTextureQuality={setTextureQuality}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
              isGenerating={isGenerating}
            />

            <PreviewPanel
              generatedModel={generatedModel}
              isGenerating={isGenerating}
            />

          </div>

        </div>
      </main>

      <GeneratorFooter />

    </div>
  );
}