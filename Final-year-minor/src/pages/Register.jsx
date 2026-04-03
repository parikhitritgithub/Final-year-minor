import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function Register(){

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleRegister = async (e)=>{

    e.preventDefault();
    setLoading(true);

    try{

      await API.post("/auth/register",{
        username,
        email,
        password
      });
      
      alert("Account created successfully!");

      navigate("/login");

    }catch(err){
      alert("Registration failed");
    }

    setLoading(false);

  };

  return(

    <div className="ai-bg min-h-screen flex items-center justify-center">

      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8 w-95">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="text-gray-300 text-sm text-center mt-4">

          Already have an account?

          <Link to="/login" className="text-indigo-400 ml-1">
            Login
          </Link>

        </p>

      </div>

    </div>

  );
}