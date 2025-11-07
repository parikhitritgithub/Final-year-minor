import React from 'react'
import './PreviewPanel.css'

function PreviewPanel({ generatedModel, isGenerating, prompt }) {
  return (
    <div className="preview-panel">
      <div className="preview-area">
        {isGenerating ? (
          <div className="generating-state">
            <div className="loading-spinner"></div>
            <p>Generating your 3D model...</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        ) : generatedModel ? (
          <div className="model-viewer">
            <img
              src={generatedModel.url}
              alt="Generated 3D model"
              width="1156"
              height="650"
            />
            <div className="viewer-controls">
              <button className="control-btn" title="Rotate">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"/>
                </svg>
              </button>
              <button className="control-btn" title="Zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1 1 10.5 2A8.5 8.5 0 0 1 19 10.5Z"/>
                </svg>
              </button>
              <button className="control-btn" title="Fullscreen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 3H5A2 2 0 0 0 3 5V8M21 8V5A2 2 0 0 0 19 3H16M16 21H19A2 2 0 0 0 21 19V16M8 21H5A2 2 0 0 0 3 19V16"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p>Your 3D model will appear here.</p>
            <span>Enter a prompt and click generate to get started</span>
          </div>
        )}
      </div>
      
      {(generatedModel || prompt) && (
        <div className="prompt-output">
          <span className="output-label">Prompt</span>
          <div className="arrow-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.025 1L23 12L13.025 23L11.5 21.4L19.55 12L11.5 2.6L13.025 1Z"/>
            </svg>
          </div>
          <span className="output-label">Model output</span>
        </div>
      )}
    </div>
  )
}

export default PreviewPanel
