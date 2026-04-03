import React, { useState } from "react";

function formatNumber(num) {
  if (num == null) return "—";
  return Number(num).toLocaleString();
}

function getQualityLabel(value, thresholds) {
  if (value == null) return { label: "N/A", color: "#888" };
  if (value >= thresholds.good) return { label: "Excellent", color: "#4ade80" };
  if (value >= thresholds.ok) return { label: "Good", color: "#facc15" };
  return { label: "Low", color: "#f87171" };
}

function getSmoothnessLabel(value) {
  if (value == null) return { label: "N/A", color: "#888" };
  if (value <= 0.001) return { label: "Very Smooth", color: "#4ade80" };
  if (value <= 0.01) return { label: "Smooth", color: "#facc15" };
  return { label: "Rough", color: "#f87171" };
}

export default function MetricsOverlay({ metrics }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!metrics) return null;

  const normalQuality = getQualityLabel(metrics.normal_consistency, {
    good: 0.85,
    ok: 0.7,
  });

  const smoothnessQuality = getSmoothnessLabel(metrics.smoothness);

  const overallScore = metrics.normal_consistency
    ? Math.round(metrics.normal_consistency * 100)
    : null;

  const getScoreColor = (score) => {
    if (score == null) return "#888";
    if (score >= 85) return "#4ade80";
    if (score >= 70) return "#facc15";
    return "#f87171";
  };

  return (
    <div className={`metrics-overlay ${collapsed ? "metrics-collapsed" : ""}`}>

      {/* Header */}
      <div className="metrics-overlay-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="metrics-header-left">
          <svg className="metrics-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3" />
            <path d="m7 14 4-4 4 4 6-6" />
          </svg>
          <span className="metrics-title">Model Metrics</span>
        </div>
        <button className="metrics-toggle-btn">
          <svg className={`metrics-chevron ${collapsed ? "chevron-down" : "chevron-up"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="metrics-overlay-body">

          {/* Score Ring */}
          {overallScore != null && (
            <div className="metrics-score-section">
              <div className="metrics-score-ring">
                <svg viewBox="0 0 80 80" className="score-svg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke={getScoreColor(overallScore)} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(overallScore / 100) * 213.6} 213.6`} transform="rotate(-90 40 40)" className="score-progress" />
                </svg>
                <div className="score-value" style={{ color: getScoreColor(overallScore) }}>
                  {overallScore}
                </div>
                <div className="score-label">Quality</div>
              </div>
            </div>
          )}

          {/* Cards */}
          <div className="metrics-grid">

            {/* Vertices */}
            <div className="metric-card">
              <div className="metric-card-icon vertices-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="19" cy="5" r="1" /><circle cx="5" cy="19" r="1" /><circle cx="19" cy="19" r="1" />
                  <line x1="5" y1="5" x2="19" y2="5" /><line x1="5" y1="5" x2="5" y2="19" /><line x1="19" y1="5" x2="19" y2="19" /><line x1="5" y1="19" x2="19" y2="19" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Vertices</span>
                <span className="metric-card-value">{formatNumber(metrics.vertices)}</span>
              </div>
            </div>

            {/* Faces */}
            <div className="metric-card">
              <div className="metric-card-icon faces-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                  <line x1="12" y1="22" x2="12" y2="15.5" /><line x1="22" y1="8.5" x2="12" y2="15.5" /><line x1="2" y1="8.5" x2="12" y2="15.5" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Faces</span>
                <span className="metric-card-value">{formatNumber(metrics.faces)}</span>
              </div>
            </div>

            {/* Smoothness */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: `${smoothnessQuality.color}15`, color: smoothnessQuality.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12c2-4 6-7 10-7s8 3 10 7c-2 4-6 7-10 7s-8-3-10-7z" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Smoothness</span>
                <span className="metric-card-value">{metrics.smoothness?.toFixed(4)}</span>
                <span className="metric-badge" style={{ color: smoothnessQuality.color, borderColor: `${smoothnessQuality.color}40` }}>
                  {smoothnessQuality.label}
                </span>
              </div>
            </div>

            {/* Normal Consistency */}
            <div className="metric-card">
              <div className="metric-card-icon" style={{ background: `${normalQuality.color}15`, color: normalQuality.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="metric-card-info">
                <span className="metric-card-label">Normal Consistency</span>
                <div className="metric-bar-container">
                  <div className="metric-bar-track">
                    <div className="metric-bar-fill" style={{ width: `${(metrics.normal_consistency || 0) * 100}%`, background: normalQuality.color }} />
                  </div>
                  <span className="metric-card-value-inline">
                    {(metrics.normal_consistency * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="metric-badge" style={{ color: normalQuality.color, borderColor: `${normalQuality.color}40` }}>
                  {normalQuality.label}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}