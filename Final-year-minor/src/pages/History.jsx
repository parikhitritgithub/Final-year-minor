import { useEffect,useState } from "react";
import API from "../api/api";

export default function History(){

  const [models,setModels] = useState([]);

  return(

    <div className="ai-bg min-h-screen p-10 text-white">

      <h1 className="text-3xl font-bold mb-8">
        Your Generated Models
      </h1>

      {models.length === 0 && (
        <p className="text-gray-400">
          No models generated yet.
        </p>
      )}

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

        {models.map((model)=>(
          
          <div
            key={model._id}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow hover:scale-105 transition"
          >

            <p className="mb-3 font-medium">
              {model.prompt}
            </p>

            <a
              href={model.modelUrl}
              download
              className="block text-center bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg"
            >
              Download Model
            </a>

          </div>

        ))}

      </div>

    </div>
  );
}