import React, { useState } from "react";
import GeneratorHeader from "./GeneratorHeader";
import ImageControlPanel from "./ImageControlPanel";
import PreviewPanel from "./PreviewPanel";
import GeneratorFooter from "./GeneratorFooter";
import MetricsOverlay from "./MetricsOverlay";
import "./GeneratorPage.css";

export default function ImageTo3DPage() {

  const SHAPE_API = import.meta.env.VITE_SHAPE_API;
  const TRIPO_API = import.meta.env.VITE_TRIPO_API;
  const EVAL_API = import.meta.env.VITE_EVAL_API;

  const [image, setImage] = useState(null);
  const [textureQuality, setTextureQuality] = useState("Shap-E");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModel, setGeneratedModel] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const handleGenerate = async () => {
    if (!image || !image.file) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGeneratedModel(null);
    setMetrics(null);

    try {
      if (textureQuality === "Shap-E") {
        const formData = new FormData();
        formData.append("file", image.file);

        const response = await fetch(`${SHAPE_API}/generate`, {
          method: "POST",
          body: formData,
          // Optional: add header if Shap-E API is also behind ngrok
          // headers: { "ngrok-skip-browser-warning": "true" },
        });

        if (!response.ok) throw new Error("Shape-E generation failed");

        const blob = await response.blob();

        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(blob);

        const objFile = zip.file("model.obj") || zip.file("output_model.obj");
        if (!objFile) throw new Error("OBJ file not found in ZIP");

        const objBlob = await objFile.async("blob");
        const objUrl = URL.createObjectURL(objBlob);

        setGeneratedModel({
          previewUrl: objUrl,
          fileBlob: objBlob,
          fileName: "model.obj",
          type: "obj",
        });

        // Evaluate Shap-E model (OBJ)
        try {
          const evalForm = new FormData();
          evalForm.append("file", objBlob, "model.obj");

          const evalRes = await fetch(`${EVAL_API}/evaluate`, {
            method: "POST",
            body: evalForm,
            headers: { "ngrok-skip-browser-warning": "true" },
          });

          if (evalRes.ok) {
            const evalData = await evalRes.json();
            setMetrics(evalData);
          } else {
            console.warn("Shap-E evaluation failed");
          }
        } catch (err) {
          console.warn("Shap-E evaluation error:", err);
        }
      }

      if (textureQuality === "TripoSR") {
        const formData = new FormData();
        formData.append("image", image.file);

        const response = await fetch(`${TRIPO_API}/generate-image`, {
          method: "POST",
          body: formData,
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        if (!response.ok) throw new Error("TripoSR generation failed");

        const data = await response.json();
        if (!data.glb_url) throw new Error("No GLB URL returned");

        const glbUrl = TRIPO_API + data.glb_url;
        const glbResponse = await fetch(glbUrl, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const glbBlob = await glbResponse.blob();
        const blobUrl = URL.createObjectURL(glbBlob);

        setGeneratedModel({
          previewUrl: blobUrl,
          fileBlob: glbBlob,
          fileName: "model.glb",
          type: "glb",
        });

        // Evaluate TripoSR model (GLB)
        try {
          const evalForm = new FormData();
          evalForm.append("file", glbBlob, "model.glb");

          const evalRes = await fetch(`${EVAL_API}/evaluate`, {
            method: "POST",
            body: evalForm,
            headers: { "ngrok-skip-browser-warning": "true" },
          });

          if (evalRes.ok) {
            const evalData = await evalRes.json();
            setMetrics(evalData);
          } else {
            console.warn("TripoSR evaluation failed");
          }
        } catch (err) {
          console.warn("TripoSR evaluation error:", err);
        }
      }

    } catch (error) {
      console.error(error);
      alert("Generation failed. Check console.");
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
            {/* LEFT PANEL */}
            <ImageControlPanel
              image={image}
              setImage={setImage}
              textureQuality={textureQuality}
              setTextureQuality={setTextureQuality}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
              isGenerating={isGenerating}
            />

            {/* RIGHT PANEL */}
            <div className="preview-wrapper">
              <PreviewPanel
                generatedModel={generatedModel}
                isGenerating={isGenerating}
              />
              <MetricsOverlay metrics={metrics} />
            </div>
          </div>
        </div>
      </main>

      <GeneratorFooter />
    </div>
  );
}