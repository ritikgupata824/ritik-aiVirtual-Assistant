import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";

function Settings() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [language, setLanguage] = useState(
    userData?.language?.toLowerCase() === "hindi" ? "hindi" : "english"
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!assistantName.trim()) {
      setErr("Please enter a name");
      return;
    }

    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        { assistantName: assistantName.trim(), language },
        { withCredentials: true }
      );

      setUserData(result.data.user || result.data);
      navigate("/home");
    } catch (error) {
      console.error("Settings update error:", error);
      setErr(error.response?.data?.message || "Error saving settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-[20px] relative">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/home")}
      />

      <h1 className="text-white mb-[30px] text-[30px] text-center">
        Assistant <span className="text-[#0000ff6c]">Settings</span>
      </h1>

      <form
        onSubmit={handleSave}
        className="w-full max-w-[600px] flex flex-col items-center gap-[20px]"
      >
        <input
          type="text"
          placeholder="Assistant name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[20px]"
          required
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
        />

        <p className="text-white text-[18px] w-full text-left px-[8px]">
          Language
        </p>
        <div className="w-full flex gap-[12px]">
          <button
            type="button"
            className={`flex-1 h-[50px] rounded-full border-2 text-[18px] font-semibold cursor-pointer ${
              language === "english"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-white"
            }`}
            onClick={() => setLanguage("english")}
          >
            English
          </button>
          <button
            type="button"
            className={`flex-1 h-[50px] rounded-full border-2 text-[18px] font-semibold cursor-pointer ${
              language === "hindi"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-white"
            }`}
            onClick={() => setLanguage("hindi")}
          >
            Hindi
          </button>
        </div>

        {err && <p className="text-red-500 text-[17px]">*{err}</p>}

        <button
          type="submit"
          className="min-w-[300px] h-[60px] bg-white rounded-full cursor-pointer mt-[10px] text-black font-semibold text-[19px]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
