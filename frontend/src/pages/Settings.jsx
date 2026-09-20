import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";

function Settings() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setAssistantName(userData.assistantName || "");
      setLanguage(userData.language || "English");
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedName = assistantName.trim();
    if (!trimmedName) {
      setMessage({ type: "error", text: "Assistant name is required." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("assistantName", trimmedName);
      formData.append("language", language);
      // We don't change the image here as per requirements, 
      // but we need to keep the existing one if we use the same API.
      // The backend controller uses req.body.imageUrl if req.file is missing.
      if (userData?.assistantImage) {
        formData.append("imageUrl", userData.assistantImage);
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
      });

      setUserData(result.data.user);
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center text-white text-xl">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-[20px]">
      <button 
        onClick={() => navigate("/home")}
        className="absolute top-[30px] left-[30px] text-white hover:text-gray-300 transition-colors"
        aria-label="Go back to Home"
      >
        <IoMdArrowRoundBack className="w-[25px] h-[25px]" />
      </button>

      <h1 className="text-white mb-[40px] text-[30px] font-bold text-center">
        Assistant <span className="text-blue-400">Settings</span>
      </h1>

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="assistantName" className="text-white text-sm font-medium ml-2">
            Assistant Name
          </label>
          <input
            id="assistantName"
            type="text"
            placeholder="e.g. Shifra"
            className="w-full h-[55px] outline-none border-2 border-white/50 bg-transparent text-white placeholder-gray-400 px-[20px] rounded-full text-[18px] focus:border-blue-400 transition-colors"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="language" className="text-white text-sm font-medium ml-2">
            Language
          </label>
          <select
            id="language"
            className="w-full h-[55px] outline-none border-2 border-white/50 bg-black text-white px-[20px] rounded-full text-[18px] focus:border-blue-400 transition-colors appearance-none cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        {message.text && (
          <p className={`text-center text-sm font-medium ${message.type === "error" ? "text-red-400" : "text-green-400"}`} role="alert">
            {message.text}
          </p>
        )}

        <button
          type="submit"
          className="w-full h-[55px] bg-white hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full text-black font-bold text-[18px] mt-2 transition-all"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
