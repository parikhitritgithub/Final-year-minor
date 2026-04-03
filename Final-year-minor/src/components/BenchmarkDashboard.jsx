import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, CartesianGrid, Legend, PieChart, Pie, Cell,
  LineChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";
import "./BenchmarkDashboard.css";

// ============================
// CUSTOM TOOLTIP
// ============================
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

// ============================
// STAT CARD COMPONENT
// ============================
function StatCard({ icon, label, value, subtext, color = "#a78bfa" }) {
  return (
    <div className="bench-stat-card">
      <div className="bench-stat-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="bench-stat-info">
        <span className="bench-stat-label">{label}</span>
        <span className="bench-stat-value">{value}</span>
        {subtext && <span className="bench-stat-sub">{subtext}</span>}
      </div>
    </div>
  );
}

// ============================
// QUALITY RING
// ============================
function QualityRing({ score, size = 120 }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 85) return "#4ade80";
    if (s >= 70) return "#facc15";
    if (s >= 50) return "#fb923c";
    return "#f87171";
  };

  const getGrade = (s) => {
    if (s >= 90) return "A+";
    if (s >= 85) return "A";
    if (s >= 75) return "B+";
    if (s >= 70) return "B";
    if (s >= 60) return "C";
    return "D";
  };

  const color = getColor(score);

  return (
    <div className="quality-ring-wrapper" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="quality-ring-svg">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="quality-ring-progress"
        />
      </svg>
      <div className="quality-ring-content">
        <span className="quality-ring-score" style={{ color }}>{score}</span>
        <span className="quality-ring-grade" style={{ color }}>{getGrade(score)}</span>
      </div>
    </div>
  );
}

// ============================
// DISTRIBUTION CHART
// ============================
function DistributionChart({ distribution, title, color = "#818cf8" }) {
  if (!distribution?.counts?.length) return null;

  const data = distribution.counts.map((count, i) => ({
    range: `${distribution.bin_edges[i]?.toFixed(4)}`,
    count,
  }));

  return (
    <div className="bench-chart-card">
      <h4 className="bench-chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 9 }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="count" stroke={color} fill={`url(#grad-${title})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================
// MAIN DASHBOARD
// ============================
export default function BenchmarkDashboard({ metrics, evalApi }) {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDashboard, setShowDashboard] = useState(false);

  // Fetch history when dashboard opens
  useEffect(() => {
    if (showDashboard && evalApi) {
      fetch(`${evalApi}/history`)
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("History fetch failed:", err));
    }
  }, [showDashboard, evalApi, metrics]);

  // Radar data for current model
  const radarData = useMemo(() => {
    if (!metrics) return [];
    return [
      { metric: "Normals", value: (metrics.normal_consistency || 0) * 100, fullMark: 100 },
      { metric: "Smoothness", value: Math.max(0, 100 - (metrics.smoothness || 0) * 10000), fullMark: 100 },
      { metric: "Watertight", value: metrics.is_watertight ? 100 : 0, fullMark: 100 },
      { metric: "Edge Uniformity", value: Math.max(0, 100 - (metrics.edge_length_std || 0) * 1000), fullMark: 100 },
      { metric: "Density", value: Math.min(100, (metrics.faces || 0) / 5000), fullMark: 100 },
    ];
  }, [metrics]);

  // Comparison data from history
  const comparisonData = useMemo(() => {
    return history.map((h, i) => ({
      name: `Model ${i + 1}`,
      id: h.id,
      vertices: h.vertices,
      faces: h.faces,
      quality: h.quality_score,
      smoothness: h.smoothness,
      normal_consistency: h.normal_consistency,
      latency: h.latency_seconds,
    }));
  }, [history]);

  // Geometry pie data
  const geometryPie = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: "Vertices", value: metrics.vertices, color: "#818cf8" },
      { name: "Faces", value: metrics.faces, color: "#f472b6" },
      { name: "Edges", value: metrics.edges, color: "#4ade80" },
    ];
  }, [metrics]);

  if (!metrics) return null;

  return (
    <>
      {/* Toggle Button */}
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

      {/* Dashboard Panel */}
      {showDashboard && (
        <div className="bench-dashboard">

          {/* Dashboard Header */}
          <div className="bench-header">
            <div className="bench-header-left">
              <h2 className="bench-title">📊 Benchmark Dashboard</h2>
              <span className="bench-subtitle">
                Model ID: <code>{metrics.id}</code> • {metrics.timestamp}
              </span>
            </div>
            <div className="bench-header-right">
              <QualityRing score={metrics.quality_score} />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bench-tabs">
            {["overview", "distributions", "comparison", "details"].map(tab => (
              <button
                key={tab}
                className={`bench-tab ${activeTab === tab ? "bench-tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ===================== */}
          {/* TAB: OVERVIEW */}
          {/* ===================== */}
          {activeTab === "overview" && (
            <div className="bench-tab-content">

              {/* Top Stats Row */}
              <div className="bench-stats-row">
                <StatCard
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/></svg>}
                  label="Vertices"
                  value={metrics.vertices?.toLocaleString()}
                  color="#818cf8"
                />
                <StatCard
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg>}
                  label="Faces"
                  value={metrics.faces?.toLocaleString()}
                  color="#f472b6"
                />
                <StatCard
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="20" x2="20" y2="4"/></svg>}
                  label="Edges"
                  value={metrics.edges?.toLocaleString()}
                  color="#4ade80"
                />
                <StatCard
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>}
                  label="Watertight"
                  value={metrics.is_watertight ? "Yes ✅" : "No ❌"}
                  color={metrics.is_watertight ? "#4ade80" : "#f87171"}
                />
                <StatCard
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
                  label="Latency"
                  value={`${metrics.latency_seconds}s`}
                  subtext="evaluation time"
                  color="#facc15"
                />
              </div>

              {/* Charts Row */}
              <div className="bench-charts-row">
                {/* Radar Chart */}
                <div className="bench-chart-card bench-chart-radar">
                  <h4 className="bench-chart-title">Quality Radar</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <PolarRadiusAxis tick={{ fill: "#475569", fontSize: 9 }} domain={[0, 100]} />
                      <Radar name="Score" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Geometry Pie */}
                <div className="bench-chart-card">
                  <h4 className="bench-chart-title">Geometry Breakdown</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={geometryPie}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {geometryPie.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Vertices vs Faces Bar */}
                <div className="bench-chart-card">
                  <h4 className="bench-chart-title">Mesh Complexity</h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[{
                      name: "Current Model",
                      Vertices: metrics.vertices,
                      Faces: metrics.faces,
                      Edges: metrics.edges,
                    }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Vertices" fill="#818cf8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Faces" fill="#f472b6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Edges" fill="#4ade80" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ===================== */}
          {/* TAB: DISTRIBUTIONS */}
          {/* ===================== */}
          {activeTab === "distributions" && (
            <div className="bench-tab-content">
              <div className="bench-charts-row">
                <DistributionChart
                  distribution={metrics.face_area_distribution}
                  title="Face Area Distribution"
                  color="#f472b6"
                />
                <DistributionChart
                  distribution={metrics.edge_length_distribution}
                  title="Edge Length Distribution"
                  color="#818cf8"
                />
                <DistributionChart
                  distribution={metrics.normal_angle_distribution}
                  title="Normal Angle Distribution"
                  color="#4ade80"
                />
              </div>

              {/* Edge & Face Stats */}
              <div className="bench-detail-grid">
                <div className="bench-detail-card">
                  <h4>Edge Length Statistics</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row">
                      <span>Average</span><span>{metrics.avg_edge_length}</span>
                    </div>
                    <div className="bench-detail-row">
                      <span>Min</span><span>{metrics.min_edge_length}</span>
                    </div>
                    <div className="bench-detail-row">
                      <span>Max</span><span>{metrics.max_edge_length}</span>
                    </div>
                    <div className="bench-detail-row">
                      <span>Std Dev</span><span>{metrics.edge_length_std}</span>
                    </div>
                  </div>
                </div>

                <div className="bench-detail-card">
                  <h4>Face Area Statistics</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row">
                      <span>Average</span><span>{metrics.avg_face_area}</span>
                    </div>
                    <div className="bench-detail-row">
                      <span>Min</span><span>{metrics.min_face_area}</span>
                    </div>
                    <div className="bench-detail-row">
                      <span>Max</span><span>{metrics.max_face_area}</span>
                    </div>
                    <div className="bench-detail-row">
                      <span>Std Dev</span><span>{metrics.face_area_std}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== */}
          {/* TAB: COMPARISON */}
          {/* ===================== */}
          {activeTab === "comparison" && (
            <div className="bench-tab-content">
              {comparisonData.length < 2 ? (
                <div className="bench-empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                    <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m6 14h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
                    <path d="M12 3v18" strokeDasharray="4 2" />
                  </svg>
                  <h3>Need More Models</h3>
                  <p>Generate at least 2 models to see comparison charts. Each evaluation is stored automatically.</p>
                  <span className="bench-empty-count">{comparisonData.length}/2 models evaluated</span>
                </div>
              ) : (
                <>
                  {/* Quality Score Comparison */}
                  <div className="bench-chart-card bench-chart-full">
                    <h4 className="bench-chart-title">Quality Score Comparison</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="quality" name="Quality Score" fill="#a78bfa" radius={[8, 8, 0, 0]}>
                          {comparisonData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={entry.quality >= 85 ? "#4ade80" : entry.quality >= 70 ? "#facc15" : "#f87171"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bench-charts-row">
                    {/* Vertices vs Faces */}
                    <div className="bench-chart-card">
                      <h4 className="bench-chart-title">Vertices vs Faces</h4>
                      <ResponsiveContainer width="100%" height={280}>
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="vertices" name="Vertices" tick={{ fill: "#64748b", fontSize: 10 }} />
                          <YAxis dataKey="faces" name="Faces" tick={{ fill: "#64748b", fontSize: 10 }} />
                          <ZAxis dataKey="quality" range={[40, 200]} name="Quality" />
                          <Tooltip content={<CustomTooltip />} />
                          <Scatter data={comparisonData} fill="#a78bfa">
                            {comparisonData.map((entry, i) => (
                              <Cell key={i} fill={entry.quality >= 80 ? "#4ade80" : "#f472b6"} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Latency Trend */}
                    <div className="bench-chart-card">
                      <h4 className="bench-chart-title">Evaluation Latency</h4>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} unit="s" />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="latency" name="Latency (s)" stroke="#facc15" strokeWidth={2} dot={{ r: 5, fill: "#facc15" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Smoothness Trend */}
                    <div className="bench-chart-card">
                      <h4 className="bench-chart-title">Smoothness Trend</h4>
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={comparisonData}>
                          <defs>
                            <linearGradient id="smoothGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="smoothness" name="Smoothness" stroke="#4ade80" fill="url(#smoothGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="bench-table-wrapper">
                    <h4 className="bench-chart-title">Model Comparison Table</h4>
                    <table className="bench-table">
                      <thead>
                        <tr>
                          <th>Model</th>
                          <th>Quality</th>
                          <th>Vertices</th>
                          <th>Faces</th>
                          <th>Smoothness</th>
                          <th>Normals</th>
                          <th>Latency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((m, i) => (
                          <tr key={i} className={metrics?.id === m.id ? "bench-table-active" : ""}>
                            <td>
                              <code>{m.id}</code>
                            </td>
                            <td>
                              <span className="bench-table-badge" style={{
                                color: m.quality >= 85 ? "#4ade80" : m.quality >= 70 ? "#facc15" : "#f87171",
                                borderColor: m.quality >= 85 ? "#4ade8040" : m.quality >= 70 ? "#facc1540" : "#f8717140",
                              }}>
                                {m.quality}
                              </span>
                            </td>
                            <td>{m.vertices?.toLocaleString()}</td>
                            <td>{m.faces?.toLocaleString()}</td>
                            <td>{m.smoothness?.toFixed(6)}</td>
                            <td>{(m.normal_consistency * 100).toFixed(1)}%</td>
                            <td>{m.latency}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===================== */}
          {/* TAB: DETAILS */}
          {/* ===================== */}
          {activeTab === "details" && (
            <div className="bench-tab-content">
              <div className="bench-detail-grid bench-detail-grid-3">

                <div className="bench-detail-card">
                  <h4>📐 Geometry</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row"><span>Surface Area</span><span>{metrics.surface_area}</span></div>
                    <div className="bench-detail-row"><span>Volume</span><span>{metrics.volume}</span></div>
                    <div className="bench-detail-row"><span>Watertight</span><span>{metrics.is_watertight ? "✅ Yes" : "❌ No"}</span></div>
                  </div>
                </div>

                <div className="bench-detail-card">
                  <h4>📦 Bounding Box</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row"><span>Width</span><span>{metrics.bbox_size?.[0]}</span></div>
                    <div className="bench-detail-row"><span>Height</span><span>{metrics.bbox_size?.[1]}</span></div>
                    <div className="bench-detail-row"><span>Depth</span><span>{metrics.bbox_size?.[2]}</span></div>
                    <div className="bench-detail-row"><span>Volume</span><span>{metrics.bbox_volume}</span></div>
                  </div>
                </div>

                <div className="bench-detail-card">
                  <h4>🔍 Quality Metrics</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row"><span>Quality Score</span><span className="bench-highlight">{metrics.quality_score}/100</span></div>
                    <div className="bench-detail-row"><span>Normal Consistency</span><span>{metrics.normal_consistency}</span></div>
                    <div className="bench-detail-row"><span>Avg Normal Angle</span><span>{metrics.avg_normal_angle}°</span></div>
                    <div className="bench-detail-row"><span>Smoothness</span><span>{metrics.smoothness}</span></div>
                  </div>
                </div>

                <div className="bench-detail-card">
                  <h4>📏 Edge Statistics</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row"><span>Average</span><span>{metrics.avg_edge_length}</span></div>
                    <div className="bench-detail-row"><span>Min</span><span>{metrics.min_edge_length}</span></div>
                    <div className="bench-detail-row"><span>Max</span><span>{metrics.max_edge_length}</span></div>
                    <div className="bench-detail-row"><span>Std Dev</span><span>{metrics.edge_length_std}</span></div>
                  </div>
                </div>

                <div className="bench-detail-card">
                  <h4>🔺 Face Statistics</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row"><span>Average Area</span><span>{metrics.avg_face_area}</span></div>
                    <div className="bench-detail-row"><span>Min Area</span><span>{metrics.min_face_area}</span></div>
                    <div className="bench-detail-row"><span>Max Area</span><span>{metrics.max_face_area}</span></div>
                    <div className="bench-detail-row"><span>Std Dev</span><span>{metrics.face_area_std}</span></div>
                  </div>
                </div>

                <div className="bench-detail-card">
                  <h4>⚡ Performance</h4>
                  <div className="bench-detail-rows">
                    <div className="bench-detail-row"><span>Evaluation Time</span><span>{metrics.latency_seconds}s</span></div>
                    <div className="bench-detail-row"><span>Model ID</span><span><code>{metrics.id}</code></span></div>
                    <div className="bench-detail-row"><span>Timestamp</span><span>{metrics.timestamp}</span></div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}