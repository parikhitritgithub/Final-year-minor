// src/components/MetricsOverlay.jsx
import React, { useState } from 'react';
import './MetricsOverlay.css';

function formatNumber(num) {
  if (num == null) return '—';
  return Number(num).toLocaleString();
}

export default function MetricsOverlay({ metrics }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!metrics) return null;

  const getQualityGrade = (score) => {
    if (score >= 90) return { label: 'Excellent', color: '#4ade80', bg: '#4ade8015' };
    if (score >= 75) return { label: 'Good', color: '#facc15', bg: '#facc1515' };
    if (score >= 60) return { label: 'Fair', color: '#f97316', bg: '#f9731615' };
    return { label: 'Poor', color: '#f87171', bg: '#f8717115' };
  };
  const quality = getQualityGrade(metrics.quality_score || 0);

  // Inference time: try metrics.inferenceTime first, then metrics.actualInferenceTime
  const inferenceTime = metrics.inferenceTime ?? metrics.actualInferenceTime;

  return (
    <div className={`metrics-overlay ${collapsed ? 'metrics-collapsed' : ''}`}>
      <div className="metrics-overlay-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="metrics-header-left">
          <svg className="metrics-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3" />
            <path d="m7 14 4-4 4 4 6-6" />
          </svg>
          <span className="metrics-title">Model Metrics</span>
        </div>
        <button className="metrics-toggle-btn">
          <svg className={`metrics-chevron ${collapsed ? 'chevron-down' : 'chevron-up'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="metrics-overlay-body">
          <div className="metrics-score-section">
            <div className="metrics-score-ring">
              <svg viewBox="0 0 80 80" className="score-svg">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke={quality.color} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(metrics.quality_score / 100) * 213.6} 213.6`} transform="rotate(-90 40 40)" className="score-progress" />
              </svg>
              <div className="score-value" style={{ color: quality.color }}>{metrics.quality_score || 0}</div>
              <div className="score-label">Quality</div>
            </div>
          </div>

          <div className="metrics-grid">
            {/* Inference Time */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Inference Time</span>
                <span className="metric-card-value">{inferenceTime?.toFixed(2) || '—'}s</span>
              </div>
            </div>

            {/* Vertices */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="2" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Vertices</span>
                <span className="metric-card-value">{formatNumber(metrics.vertices)}</span>
              </div>
            </div>

            {/* Faces */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#10b98115', color: '#10b981' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Faces</span>
                <span className="metric-card-value">{formatNumber(metrics.faces)}</span>
              </div>
            </div>

            {/* Surface Area */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Surface Area</span>
                <span className="metric-card-value">{metrics.surface_area?.toFixed(2) || '—'}</span>
              </div>
            </div>

            {/* File Size */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#ec489915', color: '#ec4899' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">File Size</span>
                <span className="metric-card-value">{metrics.fileSizeKB?.toFixed(1) || '—'} KB</span>
              </div>
            </div>

            {/* Normal Consistency */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#a855f715', color: '#a855f7' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Normal Consistency</span>
                <span className="metric-card-value">{metrics.normal_consistency?.toFixed(4) || '—'}</span>
              </div>
            </div>

            {/* Smoothness */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#14b8a615', color: '#14b8a6' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h18M6 14h12M10 18h4" />
                  <path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Smoothness</span>
                <span className="metric-card-value">{metrics.smoothness?.toExponential(4) || '—'}</span>
              </div>
            </div>

            {/* Edge Length Std */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#f9731615', color: '#f97316' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Edge Length Std</span>
                <span className="metric-card-value">{metrics.edge_length_std?.toFixed(6) || '—'}</span>
              </div>
            </div>

            {/* Watertight */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: '#06b6d415', color: '#06b6d4' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M12 2v8m0 0-3-3m3 3 3-3" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Watertight</span>
                <span className="metric-card-value">{metrics.is_watertight ? '✅ Yes' : '❌ No'}</span>
              </div>
            </div>
          </div>

          <div className="metrics-footer" style={{ marginTop: '12px', textAlign: 'center' }}>
            <span className="metric-badge" style={{ color: quality.color, borderColor: `${quality.color}40`, background: quality.bg }}>
              {quality.label} Quality
            </span>
          </div>
        </div>
      )}
    </div>
  );
}