import React, { useState } from "react";
import GeneratorHeader from "./GeneratorHeader";
import ImageControlPanel from "./ImageControlPanel";
import PreviewPanel from "./PreviewPanel";
import GeneratorFooter from "./GeneratorFooter";
import "./GeneratorPage.css";

export default function ImageTo3DPage() {
  const [image, setImage] = useState(null);
  const [detailLevel, setDetailLevel] = useState("Med");
  const [textureQuality, setTextureQuality] = useState("Standard");
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedModel, setGeneratedModel] = useState(null);

  const handleGenerate = async () => {
    if (!image) return;

    setIsGenerating(true);
    setGeneratedModel(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      console.log("Sending image to backend...");

      const response = await fetch(
        "https://agnatic-nontangibly-boyce.ngrok-free.dev/image-to-3d",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Generation failed");

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
      alert("Image to 3D generation failed.");
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
              prompt={"Image to 3D"}
            />

          </div>

        </div>
      </main>

      <GeneratorFooter />

    </div>
  );
}