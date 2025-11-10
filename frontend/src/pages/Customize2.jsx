import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize2() {
  const {
    backendImage,
    selectedImage,
    serverUrl,
    setUserData,
  } = useContext(userDataContext);

  const [assistantName, setAssistantName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!assistantName.trim()) {
      alert("Please enter a name");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
      });

      setUserData(result.data);
      navigate("/home");
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-[20px]">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />

      <h1 className="text-white mb-[30px] text-[30px] text-center">
        Enter Your <span className="text-[#0000ff6c]">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="e.g. Shifra"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[20px]"
        required
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] bg-white rounded-full cursor-pointer mt-[30px] text-black font-semibold text-[19px]"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : "Finally Create Your Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
