import React from "react";
import "./ControlPanel.css";

function ControlPanel({
  prompt,
  setPrompt,
  textureQuality,
  setTextureQuality,
  onGenerate,
  onDownload,
  isGenerating,
}) {
  return (
    <div className="control-panel">

      {/* 🧠 PROMPT */}
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

      {/* ⚡ MODEL (ONLY SHAP-E) */}
      <div className="panel-section">
        <h3 className="section-title">Model</h3>

        <div className="toggle-group">
          <button
            className="toggle-btn active"
            onClick={() => setTextureQuality("Shap-E")}
          >
            Shap-E ⚡
          </button>
        </div>
      </div>

      {/* 🚀 ACTIONS */}
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

        <div className="status-indicator">
          Estimated time: 1.2 min
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;