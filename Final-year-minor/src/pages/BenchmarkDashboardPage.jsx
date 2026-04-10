// src/pages/BenchmarkDashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import GeneratorHeader from "../components/GeneratorHeader";
import GeneratorFooter from "../components/GeneratorFooter";
import ModelComparisonDashboard from "./ModelComparisonDashboard";
import "./BenchmarkDashboardPage.css";

export default function BenchmarkDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="benchmark-page">
      <GeneratorHeader title="Model Comparison Dashboard" />
      <main className="benchmark-main">
        <div className="container">
          <div className="benchmark-nav">
            <button onClick={() => navigate(-1)} className="back-to-generator">
              ← Back
            </button>
            <button onClick={() => navigate("/image-to-3d")} className="new-generation-btn">
              + New Generation
            </button>
          </div>
          <ModelComparisonDashboard />
        </div>
      </main>
      <GeneratorFooter />
    </div>
  );
}