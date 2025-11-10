import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext(null);

function UserContextProvider({ children }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 🔹 Fetch Current User
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ask Assistant (Gemini)
  const getGeminiResponse = async (command) => {
    if (!command?.trim()) return null;

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      // ✅ अगर data object है तो return करो
      if (data && typeof data === "object") return data;

      // ✅ fallback message
      return { response: "Sorry, I didn’t understand that command." };
    } catch (error) {
      console.error("❌ Gemini Request Failed:", error.response?.data || error.message);
      return { response: "Sorry, I didn’t understand that command." };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <userDataContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        serverUrl,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        refreshUser: handleCurrentUser,
        getGeminiResponse,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}

export default UserContextProvider;
