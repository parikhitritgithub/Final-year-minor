// src/pages/BenchmarkDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BenchmarkDashboard from "../components/BenchmarkDashboard";
import GeneratorHeader from "../components/GeneratorHeader";
import GeneratorFooter from "../components/GeneratorFooter";
import "./BenchmarkDashboardPage.css";

export default function BenchmarkDashboardPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const EVAL_API = "https://191b-106-202-47-105.ngrok-free.app";

  useEffect(() => {
    const fetchLatestModel = async () => {
      try {
        const response = await fetch(`${EVAL_API}/history`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await response.json();
        if (data && data.length > 0) {
          setMetrics(data[data.length - 1]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch:", error);
        setLoading(false);
      }
    };
    fetchLatestModel();
  }, []);

  if (loading) return <div className="benchmark-loading">Loading Dashboard...</div>;

  return (
    <div className="benchmark-page">
      <GeneratorHeader title="Benchmark Dashboard" />
      <main className="benchmark-main">
        <div className="container">
          <div className="benchmark-nav">
            <button onClick={() => navigate(-1)} className="back-to-generator">← Back</button>
            <button onClick={() => navigate("/image-to-3d")} className="new-generation-btn">+ New Generation</button>
          </div>
          {metrics && <BenchmarkDashboard metrics={metrics} evalApi={EVAL_API} showFullDashboard={true} />}
        </div>
      </main>
      <GeneratorFooter />
    </div>
  );
}