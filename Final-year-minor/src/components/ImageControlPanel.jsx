// import React from "react";
// import "./ControlPanel.css";

// function ImageControlPanel({
//   image,
//   setImage,
//   detailLevel,
//   setDetailLevel,
//   textureQuality,
//   setTextureQuality,
//   onGenerate,
//   onDownload,
//   isGenerating,
// }) {

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const preview = URL.createObjectURL(file);

//     setImage({
//       file: file,
//       preview: preview,
//     });
//   };

//   return (
//     <div className="control-panel">

//       {/* IMAGE UPLOAD */}
//       <div className="panel-section">
//         <label className="section-title">Upload your image</label>

//         <label className="upload-box">
//           <input
//             type="file"
//             accept="image/*"
//             hidden
//             onChange={handleUpload}
//           />

//           {image ? (
//             <img
//               src={image.preview}
//               alt="preview"
//               className="upload-preview"
//             />
//           ) : (
//             <>
//               <div className="upload-icon">📷</div>
//               <p>Click to upload image</p>
//               <span>PNG, JPG supported</span>
//             </>
//           )}
//         </label>
//       </div>

//       {/* DETAIL LEVEL */}
//       <div className="panel-section">
//         <h3 className="section-title">Detail Level</h3>

//         <div className="toggle-group">
//           {["Low", "Med", "High"].map((level) => (
//             <button
//               key={level}
//               className={`toggle-btn ${
//                 detailLevel === level ? "active" : ""
//               }`}
//               onClick={() => setDetailLevel(level)}
//             >
//               {level}
//             </button>
//           ))}
//         </div>

//         <div className="coming-soon">Coming soon</div>
//       </div>

//       {/* TEXTURE QUALITY */}
//       <div className="panel-section">
//         <h3 className="section-title">Texture Quality</h3>

//         <div className="toggle-group">
//           {["Standard", "4K"].map((quality) => (
//             <button
//               key={quality}
//               className={`toggle-btn ${
//                 textureQuality === quality ? "active" : ""
//               }`}
//               onClick={() => setTextureQuality(quality)}
//             >
//               {quality}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* GENERATE */}
//       <div className="panel-section">

//         <button
//           className="generate-btn"
//           onClick={onGenerate}
//           disabled={!image || isGenerating}
//         >
//           {isGenerating ? "Generating..." : "Generate Preview"}
//         </button>

//         <button
//           className="download-btn"
//           onClick={onDownload}
//           disabled={!image}
//         >
//           Download Model
//         </button>

//         <div className="status-indicator">
//           Estimated time: 1.2 min
//         </div>

//       </div>

//     </div>
//   );
// }

// export default ImageControlPanel;

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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImage({
      file: file,
      preview: preview,
    });
  };

  // 🌐 Speed detection
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

  // useEffect(() => {
  //   getInternetSpeed().then(setInternetSpeed);
  // }, []);

useEffect(() => {
  let interval;

  const fetchSpeed = async () => {
    const speed = await getInternetSpeed();
    setInternetSpeed(speed);
  };

  // Run once immediately
  fetchSpeed();

  // 🔥 Run every 5 seconds
  interval = setInterval(fetchSpeed, 3000);

  // Cleanup
  return () => clearInterval(interval);
}, []);

  // 🔥 AUTO LOGIC
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

  let selectedMode = "Fast Mode";

  if (autoMode) {
    selectedMode = getAutoMode();

    // 🔥 Sync texture quality automatically
    if (selectedMode === "High Quality Mode" && textureQuality !== "4K") {
      setTextureQuality("4K");
    }
    if (selectedMode === "Fast Mode" && textureQuality !== "Standard") {
      setTextureQuality("Standard");
    }
  } else {
    selectedMode =
      textureQuality === "4K" ? "High Quality Mode" : "Fast Mode";
  }

  const getModelName = () => {
    return selectedMode === "Fast Mode"
      ? "Shap-E ⚡"
      : "TripoSR 🧠";
  };

  return (
    <div className="control-panel">

      {/* Upload */}
      <div className="panel-section">
        <label className="section-title">Upload Image</label>

        <label className="upload-box">
          <input type="file" hidden onChange={handleUpload} />

          {image ? (
            <img src={image.preview} className="upload-preview" />
          ) : (
            <div className="upload-placeholder">
              📷 Click to upload
            </div>
          )}
        </label>
      </div>

      {/* MODEL SELECTION CARD */}
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

      {/* Texture */}
      <div className="panel-section">
        <h3 className="section-title">Texture Quality</h3>

        <div className="toggle-group">
          {["Standard", "4K"].map((q) => (
            <button
              key={q}
              className={`toggle-btn ${textureQuality === q ? "active" : ""
                }`}
              disabled={autoMode}
              onClick={() => setTextureQuality(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Generate */}
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
       
       <div className="status-indicator">Estimated time: 1.2 min</div>
      </div>
    </div>
  );
}

export default ImageControlPanel;