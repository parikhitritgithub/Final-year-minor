import { useEffect, useState } from "react";
import API from "../api/api";

export default function History() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await API.get("/history"); // ✅ FIXED
        setModels(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="ai-bg min-h-screen p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Your Generated Models
      </h1>

      {models.length === 0 && (
        <p className="text-gray-400">No models generated yet.</p>
      )}

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {models.map((model, i) => (
          <div key={i} className="bg-white/10 p-4 rounded-xl">
            <p>{model.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}