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

//     // store both file + preview
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
//             <img src={image.preview} alt="preview" className="upload-preview"/>
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
//               className={`toggle-btn ${detailLevel === level ? "active" : ""}`}
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

//         <div className="coming-soon">Coming soon</div>
//       </div>

//       {/* GENERATE + DOWNLOAD */}
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

import React from "react";
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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImage({
      file: file,
      preview: preview,
    });
  };

  return (
    <div className="control-panel">

      {/* IMAGE UPLOAD */}
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

      {/* DETAIL LEVEL */}
      <div className="panel-section">
        <h3 className="section-title">Detail Level</h3>

        <div className="toggle-group">
          {["Low", "Med", "High"].map((level) => (
            <button
              key={level}
              className={`toggle-btn ${
                detailLevel === level ? "active" : ""
              }`}
              onClick={() => setDetailLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="coming-soon">Coming soon</div>
      </div>

      {/* TEXTURE QUALITY */}
      <div className="panel-section">
        <h3 className="section-title">Texture Quality</h3>

        <div className="toggle-group">
          {["Standard", "4K"].map((quality) => (
            <button
              key={quality}
              className={`toggle-btn ${
                textureQuality === quality ? "active" : ""
              }`}
              onClick={() => setTextureQuality(quality)}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>

      {/* GENERATE */}
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