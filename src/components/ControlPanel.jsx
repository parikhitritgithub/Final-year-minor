import React from 'react'
import './ControlPanel.css'

function ControlPanel({
  prompt,
  setPrompt,
  detailLevel,
  setDetailLevel,
  textureQuality,
  setTextureQuality,
  onGenerate,
  isGenerating
}) {
  return (
    <div className="control-panel">
      <div className="panel-section">
        <label htmlFor="prompt" className="section-title">Enter your prompt</label>
        <textarea
          id="prompt"
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
          {['Low', 'Med', 'High'].map((level) => (
            <button
              key={level}
              className={`toggle-btn ${detailLevel === level ? 'active' : ''}`}
              onClick={() => setDetailLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="coming-soon">Comming soon</div>
      </div>

      <div className="panel-section">
        <h3 className="section-title">Texture Quality</h3>
        <div className="toggle-group">
          {['Standard', '4K'].map((quality) => (
            <button
              key={quality}
              className={`toggle-btn ${textureQuality === quality ? 'active' : ''}`}
              onClick={() => setTextureQuality(quality)}
            >
              {quality}
            </button>
          ))}
        </div>
        <div className="coming-soon">Comming soon</div>
      </div>

      <div className="panel-section">
        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
              Generate Preview
            </>
          )}
        </button>
        
        <button className="download-btn" disabled={!prompt.trim()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15M7 10L12 15L17 10M12 15V3"/>
          </svg>
          Download Model
        </button>
        
        <div className="status-indicator">
          Estimated time: 1.2 min
        </div>
      </div>
    </div>
  )
}

export default ControlPanel