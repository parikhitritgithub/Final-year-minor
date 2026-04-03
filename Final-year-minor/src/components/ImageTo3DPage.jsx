import React, { useState } from "react";
import GeneratorHeader from "./GeneratorHeader";
import ImageControlPanel from "./ImageControlPanel";
import PreviewPanel from "./PreviewPanel";
import GeneratorFooter from "./GeneratorFooter";
import MetricsOverlay from "./MetricsOverlay";
import BenchmarkDashboard from "./BenchmarkDashboard";
import "./GeneratorPage.css";

export default function ImageTo3DPage() {

  const SHAPE_API ="https://nonoptimistical-ascetically-xenia.ngrok-free.dev";
  const TRIPO_API ="https://e4f1-213-173-108-219.ngrok-free.app";
  const EVAL_API ="https://ecab-106-202-47-105.ngrok-free.app";

  const [image, setImage] = useState(null);
  const [detailLevel, setDetailLevel] = useState("Med");
  const [textureQuality, setTextureQuality] = useState("Standard");
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
      if (textureQuality === "Standard") {
        const formData = new FormData();
        formData.append("file", image.file);

        const response = await fetch(`${SHAPE_API}/generate`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Shape-E generation failed");

        const blob = await response.blob();
        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(blob);
        const objFile = zip.file("model.obj");

        if (!objFile) throw new Error("OBJ not found in ZIP");

        const objBlob = await objFile.async("blob");
        const objUrl = URL.createObjectURL(objBlob);

        setGeneratedModel({
          previewUrl: objUrl,
          fileBlob: objBlob,
          fileName: "shape_model.obj",
          type: "obj",
        });

        // Evaluate
        const evalForm = new FormData();
        evalForm.append("file", objBlob, "model.obj");

        const evalRes = await fetch(`${EVAL_API}/evaluate`, {
          method: "POST",
          body: evalForm,
        });

        const evalData = await evalRes.json();
        setMetrics(evalData);
      }

      if (textureQuality === "4K") {
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
          fileName: "tripo_model.glb",
          type: "glb",
        });

        setMetrics(null);
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

            {/* Preview + Floating Metrics */}
            <div className="preview-wrapper">
              <PreviewPanel
                generatedModel={generatedModel}
                isGenerating={isGenerating}
              />
              <MetricsOverlay metrics={metrics} />
            </div>
          </div>

          {/* Benchmark Dashboard (below workspace) */}
          <BenchmarkDashboard metrics={metrics} evalApi={EVAL_API} />

        </div>
      </main>

      <GeneratorFooter />
    </div>
  );
}