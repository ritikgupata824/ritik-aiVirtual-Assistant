import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Camera, Save, Languages, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function Settings() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [language, setLanguage] = useState(
    userData?.language?.toLowerCase() === "hindi" ? "hindi" : "english"
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    userData?.assistantImage || ""
  );

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"

  // Sync state if userData is loaded dynamically later
  useEffect(() => {
    if (userData) {
      if (userData.assistantName) setAssistantName(userData.assistantName);
      if (userData.language) {
        setLanguage(userData.language.toLowerCase() === "hindi" ? "hindi" : "english");
      }
      if (userData.assistantImage) {
        setImagePreview(userData.assistantImage);
      }
    }
  }, [userData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!assistantName.trim()) {
      setStatusType("error");
      setStatusMsg("Please enter an assistant name.");
      return;
    }

    setStatusMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName.trim());
      formData.append("language", language);
      
      if (imageFile) {
        formData.append("assistantImage", imageFile);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the user context with the updated user data
      setUserData(result.data.user || result.data);
      
      setStatusType("success");
      setStatusMsg("Settings updated successfully!");

      // Brief delay to let the user see the success state, then redirect home
      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (error) {
      console.error("Settings update error:", error);
      setStatusType("error");
      setStatusMsg(
        error.response?.data?.message || "Failed to update settings. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-6 relative overflow-y-auto">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer z-10"
      >
        <IoMdArrowRoundBack className="w-6 h-6" />
      </motion.button>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[500px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center mt-12 mb-6"
      >
        <h1 className="text-white text-3xl font-bold mb-8 text-center tracking-wide">
          Assistant <span className="text-blue-400 font-extrabold">Settings</span>
        </h1>

        <form onSubmit={handleSave} className="w-full flex flex-col gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-xl cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Assistant Preview"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
              {/* Overlay on Hover */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Camera className="text-white w-8 h-8 mb-1" />
                <span className="text-[10px] text-white font-semibold uppercase tracking-wider">
                  Upload
                </span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-gray-400 text-xs">Click to upload custom assistant image</p>
          </div>

          {/* Assistant Name */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Assistant Name
            </label>
            <input
              type="text"
              placeholder="e.g. Jarvis"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              required
              className="w-full h-14 bg-white/5 border border-white/20 rounded-2xl px-5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
            />
          </div>

          {/* Language Preference */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-400" />
              Language Preference
            </label>
            <div className="w-full grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setLanguage("english")}
                className={`h-12 rounded-2xl font-semibold border-2 transition-all cursor-pointer ${
                  language === "english"
                    ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                    : "bg-transparent text-white border-white/20 hover:border-white/40"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hindi")}
                className={`h-12 rounded-2xl font-semibold border-2 transition-all cursor-pointer ${
                  language === "hindi"
                    ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                    : "bg-transparent text-white border-white/20 hover:border-white/40"
                }`}
              >
                Hindi
              </button>
            </div>
          </div>

          {/* Status Message Alerts */}
          {statusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 border mt-2 ${
                statusType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {statusType === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{statusMsg}</p>
            </motion.div>
          )}

          {/* Save Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg cursor-pointer shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Settings;
