// src/components/BenchmarkDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, Legend, ScatterChart, Scatter, ZAxis,
  ComposedChart, Area, AreaChart
} from "recharts";
import "./BenchmarkDashboard.css";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bench-tooltip">
      <p className="bench-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <strong>{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function BenchmarkDashboard({ metrics, evalApi, showFullDashboard = false }) {
  const [history, setHistory] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWithNgrok = async (url) => {
    const response = await fetch(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return response;
  };

  const fetchHistory = async () => {
    if (!evalApi) return;
    setLoading(true);
    try {
      const response = await fetchWithNgrok(`${evalApi}/history`);
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("History fetch failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if ((showDashboard || showFullDashboard) && evalApi) {
      fetchHistory();
    }
  }, [showDashboard, showFullDashboard, evalApi, metrics]);

  // Calculate IoU from metrics
  const currentIoU = useMemo(() => {
    if (!metrics) return 0;
    const bboxVol = metrics.bbox_volume || 1;
    const meshVol = metrics.volume || 0;
    const intersection = Math.min(bboxVol, meshVol);
    const union = bboxVol + meshVol - intersection;
    return (intersection / union) * 100;
  }, [metrics]);

  // Radar data with all metrics
  const radarData = useMemo(() => {
    if (!metrics) return [];
    return [
      { metric: "Normal Consistency", value: (metrics.normal_consistency || 0) * 100, fullMark: 100 },
      { metric: "Mesh Smoothness", value: Math.max(0, 100 - (metrics.smoothness || 0) * 10000), fullMark: 100 },
      { metric: "Watertight", value: metrics.is_watertight ? 100 : 0, fullMark: 100 },
      { metric: "IoU Score", value: currentIoU, fullMark: 100 },
      { metric: "Quality Score", value: metrics.quality_score || 0, fullMark: 100 },
    ];
  }, [metrics, currentIoU]);

  // Performance trend data
  const performanceData = useMemo(() => {
    return history.map((h, i) => ({
      name: `Model ${i + 1}`,
      id: h.id,
      quality: h.quality_score,
      latency: h.latency_seconds,
      normalConsistency: (h.normal_consistency || 0) * 100,
      smoothness: h.smoothness,
      iou: (() => {
        const bboxVol = h.bbox_volume || 1;
        const meshVol = h.volume || 0;
        const intersection = Math.min(bboxVol, meshVol);
        const union = bboxVol + meshVol - intersection;
        return (intersection / union) * 100;
      })(),
    }));
  }, [history]);

  if (!metrics) return null;

  return (
    <>
      {!showFullDashboard && (
        <button
          className={`bench-toggle-btn ${showDashboard ? "active" : ""}`}
          onClick={() => setShowDashboard(!showDashboard)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>{showDashboard ? "Hide Dashboard" : "Benchmark Dashboard"}</span>
        </button>
      )}

      {(showDashboard || showFullDashboard) && (
        <div className="bench-dashboard">
          {/* Header */}
          <div className="bench-header">
            <div>
              <h2 className="bench-title">📊 Benchmark Dashboard</h2>
              <span className="bench-subtitle">Model: <code>{metrics.id}</code> • {metrics.timestamp}</span>
            </div>
            <div className="quality-ring-wrapper">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#a78bfa' }}>{metrics.quality_score}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Quality Score</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bench-stats-row">
            <div className="bench-stat-card">
              <div className="bench-stat-icon">📐</div>
              <div>
                <div className="bench-stat-label">IoU Score</div>
                <div className="bench-stat-value">{currentIoU.toFixed(1)}%</div>
              </div>
            </div>
            <div className="bench-stat-card">
              <div className="bench-stat-icon">📏</div>
              <div>
                <div className="bench-stat-label">Normal Consistency</div>
                <div className="bench-stat-value">{(metrics.normal_consistency * 100).toFixed(1)}%</div>
              </div>
            </div>
            <div className="bench-stat-card">
              <div className="bench-stat-icon">✨</div>
              <div>
                <div className="bench-stat-label">Mesh Smoothness</div>
                <div className="bench-stat-value">{metrics.smoothness?.toExponential(2)}</div>
              </div>
            </div>
            <div className="bench-stat-card">
              <div className="bench-stat-icon">⚡</div>
              <div>
                <div className="bench-stat-label">Latency</div>
                <div className="bench-stat-value">{metrics.latency_seconds}s</div>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="bench-charts-row">
            <div className="bench-chart-card">
              <h4 className="bench-chart-title">🎯 Metrics Radar (IoU + Normal + Smoothness)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fill: "#475569", fontSize: 9 }} domain={[0, 100]} />
                  <Radar name="Score" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bench-chart-card">
              <h4 className="bench-chart-title">📈 IoU & Quality Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="iou" name="IoU Score" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="quality" name="Quality Score" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="bench-charts-row">
            <div className="bench-chart-card">
              <h4 className="bench-chart-title">🔄 Normal Consistency vs Smoothness</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="normalConsistency" name="Normal Consistency" unit="%" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis dataKey="smoothness" name="Smoothness" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <ZAxis dataKey="quality" range={[50, 400]} name="Quality" />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={performanceData} fill="#a78bfa" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="bench-chart-card">
              <h4 className="bench-chart-title">⏱️ Latency vs Quality</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="latency" name="Latency (s)" fill="#f472b6" />
                  <Line yAxisId="right" type="monotone" dataKey="quality" name="Quality Score" stroke="#4ade80" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="bench-table-wrapper">
            <h4 className="bench-chart-title">📋 Detailed Metrics</h4>
            <table className="bench-table">
              <thead>
                <tr><th>Metric</th><th>Value</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td>IoU (Intersection over Union)</td><td>{currentIoU.toFixed(2)}%</td><td>{currentIoU > 80 ? "✅ Excellent" : currentIoU > 60 ? "⚠️ Good" : "❌ Needs Work"}</td></tr>
                <tr><td>Normal Consistency</td><td>{(metrics.normal_consistency * 100).toFixed(1)}%</td><td>{metrics.normal_consistency > 0.85 ? "✅ Smooth" : "⚠️ Some artifacts"}</td></tr>
                <tr><td>Watertight</td><td>{metrics.is_watertight ? "Yes" : "No"}</td><td>{metrics.is_watertight ? "✅ 3D Printable" : "❌ Has holes"}</td></tr>
                <tr><td>Vertices / Faces</td><td>{metrics.vertices?.toLocaleString()} / {metrics.faces?.toLocaleString()}</td><td>{metrics.faces > 50000 ? "✅ High detail" : "⚠️ Low detail"}</td></tr>
              </tbody>
            </table>
          </div>

          {loading && <div className="bench-loading">Updating...</div>}
        </div>
      )}
    </>
  );
}