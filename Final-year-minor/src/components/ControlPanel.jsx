import React from "react";
import "./ControlPanel.css";

function ControlPanel({
  prompt,
  setPrompt,
  detailLevel,
  setDetailLevel,
  textureQuality,
  setTextureQuality,
  // format,
  // setFormat,
  onGenerate,
  onDownload,
  isGenerating,
}) {
  return (
    <div className="control-panel">
      <div className="panel-section">
        <label className="section-title">Enter your prompt</label>
        <textarea
          className="prompt-input"
          placeholder="a futuristic motorcycle with glowing wheels"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
      </div>

      <div className="panel-section">
        <h3 className="section-title">Detail Level</h3>
        <div className="toggle-group">
          {["Low", "Med", "High"].map((level) => (
            <button
              key={level}
              className={`toggle-btn ${detailLevel === level ? "active" : ""}`}
              onClick={() => setDetailLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="coming-soon">Coming soon</div>
      </div>

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
        <div className="coming-soon">Coming soon</div>
      </div>

      <div className="panel-section">
        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Preview"}
        </button>

        <button
          className="download-btn"
          onClick={onDownload}
          disabled={!prompt.trim()}
        >
          Download Model
        </button>

        <div className="status-indicator">Estimated time: 1.2 min</div>
      </div>
    </div>
  );
}

export default ControlPanel;
