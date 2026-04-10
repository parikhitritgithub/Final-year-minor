import React, { useState, useEffect } from "react";
import "./ControlPanel.css";

function ImageControlPanel({
  image,
  setImage,
  detailLevel,
  setDetailLevel,
  textureQuality,
  setTextureQuality,
  onGenerate,
  onDownload,
  isGenerating,
}) {
  const [autoMode, setAutoMode] = useState(false);
  const [internetSpeed, setInternetSpeed] = useState(0);

  // 📷 Upload Handler
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImage({
      file: file,
      preview: preview,
    });
  };

  // 🌐 Internet Speed Detection
  const getInternetSpeed = async () => {
    const start = Date.now();
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts");
      const duration = (Date.now() - start) / 1000;

      const speed = (500 * 1024 * 8) / duration / (1024 * 1024);
      return speed.toFixed(2);
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    let interval;

    const fetchSpeed = async () => {
      const speed = await getInternetSpeed();
      setInternetSpeed(speed);
    };

    fetchSpeed();
    interval = setInterval(fetchSpeed, 3000);

    return () => clearInterval(interval);
  }, []);

  // ⚡ Auto Mode Logic
  const getAutoMode = () => {
    if (!image || !image.file) return "Fast Mode";

    const sizeMB = image.file.size / (1024 * 1024);
    const speed = parseFloat(internetSpeed);

    if (speed < 2) return "Fast Mode";

    if (speed >= 2 && speed < 5) {
      return sizeMB > 0.01 ? "Fast Mode" : "High Quality Mode";
    }

    return sizeMB > 0.02 ? "High Quality Mode" : "Fast Mode";
  };

  // 🔥 Sync texture safely using useEffect
  useEffect(() => {
    if (!autoMode) return;

    const mode = getAutoMode();

    if (mode === "High Quality Mode" && textureQuality !== "TripoSR") {
      setTextureQuality("TripoSR");
    }

    if (mode === "Fast Mode" && textureQuality !== "Shap-E") {
      setTextureQuality("Shap-E");
    }
  }, [autoMode, image, internetSpeed]);

  // 🎯 Selected Mode
  let selectedMode = "Fast Mode";

  if (autoMode) {
    selectedMode = getAutoMode();
  } else {
    selectedMode =
      textureQuality === "TripoSR"
        ? "High Quality Mode"
        : "Fast Mode";
  }

  // 🧠 Model Name
  const getModelName = () => {
    return selectedMode === "Fast Mode"
      ? "Shap-E ⚡"
      : "TripoSR 🧠";
  };

  return (
    <div className="control-panel">

      {/* 📷 IMAGE UPLOAD */}
      <div className="panel-section">
        <label className="section-title">Upload your image</label>

        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />

          {image ? (
            <img
              src={image.preview}
              alt="preview"
              className="upload-preview"
            />
          ) : (
            <>
              <div className="upload-icon">📷</div>
              <p>Click to upload image</p>
              <span>PNG, JPG supported</span>
            </>
          )}
        </label>
      </div>

      {/* 🤖 MODEL CARD */}
      <div className="panel-section model-card">
        <div className="model-header">
          <h3>Model Selection</h3>

          <div
            className={`toggle-switch ${autoMode ? "active" : ""}`}
            onClick={() => setAutoMode(!autoMode)}
          >
            <div className="toggle-circle"></div>
          </div>
        </div>

        <div className="model-info">
          <div className="info-row">
            <span>🤖 Auto</span>
            <span className={autoMode ? "green" : "gray"}>
              {autoMode ? "ON" : "OFF"}
            </span>
          </div>

          <div className="info-row">
            <span>⚡ Mode</span>
            <span className="highlight">{selectedMode}</span>
          </div>

          <div className="info-row">
            <span>🧠 Model</span>
            <span className="highlight">{getModelName()}</span>
          </div>

          <div className="info-row">
            <span>🌐 Speed</span>
            <span>
              {internetSpeed === "N/A"
                ? "Detecting..."
                : `${internetSpeed} Mbps`}
            </span>
          </div>
        </div>
      </div>

      {/* 🎨 TEXTURE */}
      <div className="panel-section">
        <h3 className="section-title">Texture Quality</h3>

        <div className="toggle-group">
          {["Shap-E", "TripoSR"].map((q) => (
            <button
              key={q}
              className={`toggle-btn ${
                textureQuality === q ? "active" : ""
              }`}
              disabled={autoMode}
              onClick={() => setTextureQuality(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 🚀 ACTIONS */}
      <div className="panel-section">
        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={!image || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Preview"}
        </button>

        <button
          className="download-btn"
          onClick={onDownload}
          disabled={!image}
        >
          Download Model
        </button>

        <div className="status-indicator">
          Estimated time: 1.2 min
        </div>
      </div>
    </div>
  );
}

export default ImageControlPanel;