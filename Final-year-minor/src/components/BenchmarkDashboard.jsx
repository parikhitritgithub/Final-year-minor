// src/components/BenchmarkDashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, Legend, ScatterChart, Scatter, ZAxis,
  ComposedChart
} from "recharts";
import "./BenchmarkDashboard.css";

// =========================
// CUSTOM TOOLTIP
// =========================
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bench-tooltip">
      <p className="bench-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}:{" "}
          <strong>
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </strong>
        </p>
      ))}
    </div>
  );
}

// =========================
// MAIN COMPONENT
// =========================
export default function BenchmarkDashboard({
  metrics,
  evalApi,
  showFullDashboard = false,
}) {
  const [history, setHistory] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH HISTORY
  // =========================
  const fetchHistory = async () => {
    if (!evalApi) return;

    setLoading(true);
    try {
      const res = await fetch(`${evalApi}/history`);
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      console.error("History fetch failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if ((showDashboard || showFullDashboard) && evalApi) {
      fetchHistory();
    }
  }, [showDashboard, showFullDashboard, evalApi]);

  if (!metrics) return null;

  // =========================
  // ✅ FIXED IoU (from backend)
  // =========================
  const currentIoU = metrics.iou_score || 0;

  // =========================
  // RADAR DATA
  // =========================
  const radarData = useMemo(() => {
    return [
      {
        metric: "Normal Consistency",
        value: (metrics.normal_consistency || 0) * 100,
        fullMark: 100,
      },
      {
        metric: "Mesh Smoothness",
        value: Math.max(0, 100 - (metrics.smoothness || 0) * 10000),
        fullMark: 100,
      },
      {
        metric: "Watertight",
        value: metrics.is_watertight ? 100 : 0,
        fullMark: 100,
      },
      {
        metric: "IoU Score",
        value: currentIoU,
        fullMark: 100,
      },
      {
        metric: "Quality Score",
        value: metrics.quality_score || 0,
        fullMark: 100,
      },
    ];
  }, [metrics, currentIoU]);

  // =========================
  // PERFORMANCE HISTORY
  // =========================
  const performanceData = useMemo(() => {
    return history.map((h, i) => ({
      name: `Model ${i + 1}`,
      quality: h.quality_score || 0,
      latency: h.latency_seconds || 0,
      normalConsistency: (h.normal_consistency || 0) * 100,
      smoothness: h.smoothness || 0,
      iou: h.iou_score || 0, // ✅ FIXED
    }));
  }, [history]);

  return (
    <>
      {/* =========================
          TOGGLE BUTTON
      ========================= */}
      {!showFullDashboard && (
        <button
          className={`bench-toggle-btn ${
            showDashboard ? "active" : ""
          }`}
          onClick={() => setShowDashboard(!showDashboard)}
        >
          <span>
            {showDashboard ? "Hide Dashboard" : "Benchmark Dashboard"}
          </span>
        </button>
      )}

      {(showDashboard || showFullDashboard) && (
        <div className="bench-dashboard">

          {/* =========================
              HEADER
          ========================= */}
          <div className="bench-header">
            <div>
              <h2 className="bench-title">📊 Benchmark Dashboard</h2>
              <span className="bench-subtitle">
                Model: <code>{metrics.id}</code> • {metrics.timestamp}
              </span>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: "bold", color: "#a78bfa" }}>
                {metrics.quality_score}
              </div>
              <div style={{ fontSize: 12 }}>Quality Score</div>
            </div>
          </div>

          {/* =========================
              STATS
          ========================= */}
          <div className="bench-stats-row">
            <Stat label="IoU Score" value={`${currentIoU.toFixed(1)}%`} icon="📐" />
            <Stat
              label="Normal Consistency"
              value={`${((metrics.normal_consistency || 0) * 100).toFixed(1)}%`}
              icon="📏"
            />
            <Stat
              label="Smoothness"
              value={metrics.smoothness?.toExponential(2)}
              icon="✨"
            />
            <Stat
              label="Latency"
              value={`${metrics.latency_seconds}s`}
              icon="⚡"
            />
          </div>

          {/* =========================
              CHARTS
          ========================= */}
          <div className="bench-charts-row">

            {/* RADAR */}
            <div className="bench-chart-card">
              <h4 className="bench-chart-title">🎯 Metrics Radar</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="value"
                    stroke="#a78bfa"
                    fill="#a78bfa"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* TREND */}
            <div className="bench-chart-card">
              <h4 className="bench-chart-title">📈 IoU & Quality</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line dataKey="iou" stroke="#4ade80" />
                  <Line dataKey="quality" stroke="#a78bfa" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* =========================
              TABLE
          ========================= */}
          <div className="bench-table-wrapper">
            <h4 className="bench-chart-title">📋 Detailed Metrics</h4>
            <table className="bench-table">
              <tbody>
                <tr>
                  <td>IoU</td>
                  <td>{currentIoU.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>Vertices</td>
                  <td>{metrics.vertices}</td>
                </tr>
                <tr>
                  <td>Faces</td>
                  <td>{metrics.faces}</td>
                </tr>
                <tr>
                  <td>Watertight</td>
                  <td>{metrics.is_watertight ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {loading && <div>Loading...</div>}
        </div>
      )}
    </>
  );
}

// =========================
// SMALL COMPONENT
// =========================
function Stat({ label, value, icon }) {
  return (
    <div className="bench-stat-card">
      <div className="bench-stat-icon">{icon}</div>
      <div>
        <div className="bench-stat-label">{label}</div>
        <div className="bench-stat-value">{value}</div>
      </div>
    </div>
  );
}