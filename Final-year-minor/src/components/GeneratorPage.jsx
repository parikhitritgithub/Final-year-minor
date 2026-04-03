import React, { useState } from "react";
import GeneratorHeader from "./GeneratorHeader";
import ControlPanel from "./ControlPanel";
import PreviewPanel from "./PreviewPanel";
import GeneratorFooter from "./GeneratorFooter";
import "./GeneratorPage.css";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [detailLevel, setDetailLevel] = useState("Med");
  const [textureQuality, setTextureQuality] = useState("Standard");
  const [format, setFormat] = useState("OBJ");
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedModel, setGeneratedModel] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedModel(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      console.log("Sending request:", prompt);

      const response = await fetch(
        // "https://agnatic-nontangibly-boyce.ngrok-free.dev/generate",
        "https://nonoptimistical-ascetically-xenia.ngrok-free.dev/generate",
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Generation failed.");

      const blob = await response.blob();

      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(blob);

      const objBlob = await zip.file("output_model.obj").async("blob");
      const objUrl = URL.createObjectURL(objBlob);

      setGeneratedModel({
        previewUrl: objUrl,
        fileBlob: objBlob,
        fileName: "generated_model.obj",
      });
    } catch (error) {
      console.error(error);
      alert("Model generation failed.");
    }

    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedModel || !generatedModel.fileBlob) return;

    const url = URL.createObjectURL(generatedModel.fileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generatedModel.fileName || "model.obj";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="generator-page">
      <GeneratorHeader />

      <main className="generator-main">
        <div className="container">
          <div className="generator-workspace">
            <ControlPanel
              prompt={prompt}
              setPrompt={setPrompt}
              detailLevel={detailLevel}
              setDetailLevel={setDetailLevel}
              textureQuality={textureQuality}
              setTextureQuality={setTextureQuality}
              format={format}
              setFormat={setFormat}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
              isGenerating={isGenerating}
            />

            <PreviewPanel
              generatedModel={generatedModel}
              isGenerating={isGenerating}
              prompt={prompt}
            />
          </div>
        </div>
      </main>

      <GeneratorFooter />
    </div>
  );
}

// import React, { useState } from "react";
// import JSZip from "jszip";

// import GeneratorHeader from "./GeneratorHeader";
// import ControlPanel from "./ControlPanel";
// import PreviewPanel from "./PreviewPanel";
// import GeneratorFooter from "./GeneratorFooter";

// import API from "../api/api";

// import "./GeneratorPage.css";

// export default function GeneratorPage() {

//   const [prompt, setPrompt] = useState("");
//   const [detailLevel, setDetailLevel] = useState("Med");
//   const [textureQuality, setTextureQuality] = useState("Standard");
//   const [format, setFormat] = useState("OBJ");

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedModel, setGeneratedModel] = useState(null);

//   const handleGenerate = async () => {
//   if (!prompt.trim()) return;

//   setIsGenerating(true);
//   setGeneratedModel(null);

//   try {
//     const formData = new FormData();
//     formData.append("prompt", prompt);

//     const response = await fetch(
//       "https://agnatic-nontangibly-boyce.ngrok-free.dev/generate",
//       {
//         method: "POST",
//         body: formData
//       }
//     );

//     if (!response.ok) throw new Error("Generation failed");

//     const blob = await response.blob();

//     const JSZip = (await import("jszip")).default;
//     const zip = await JSZip.loadAsync(blob);

//     const objBlob = await zip.file("output_model.obj").async("blob");

//     const objUrl = URL.createObjectURL(objBlob);

//     setGeneratedModel({
//       previewUrl: objUrl,
//       fileBlob: objBlob,
//       fileName: "model.obj"
//     });

//     /* 🔥 UPLOAD MODEL TO NODE BACKEND */

//     const uploadData = new FormData();
//     uploadData.append("prompt", prompt);
//     uploadData.append("model", objBlob, "model.obj");

//     await fetch("http://localhost:5000/generate", {
//       method: "POST",
//       body: uploadData
//     });

//   } catch (err) {
//     console.error(err);
//   }

//   setIsGenerating(false);
// };

//   /* ---------------- DOWNLOAD MODEL ---------------- */

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

//       <GeneratorHeader />

//       <main className="generator-main">

//         <div className="container">

//           <div className="generator-workspace">

//             <ControlPanel
//               prompt={prompt}
//               setPrompt={setPrompt}
//               detailLevel={detailLevel}
//               setDetailLevel={setDetailLevel}
//               textureQuality={textureQuality}
//               setTextureQuality={setTextureQuality}
//               format={format}
//               setFormat={setFormat}
//               onGenerate={handleGenerate}
//               onDownload={handleDownload}
//               isGenerating={isGenerating}
//             />

//             <PreviewPanel
//               generatedModel={generatedModel}
//               isGenerating={isGenerating}
//               prompt={prompt}
//             />

//           </div>

//         </div>

//       </main>

//       <GeneratorFooter />

//     </div>
//   );
// }