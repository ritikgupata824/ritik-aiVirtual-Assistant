import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mic, MicOff, Menu } from "lucide-react";
import aiGif from "../assets/ai.gif";
import aiOff from "../assets/user.gif.jpg";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);
  const [aiText, setAiText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const recognitionRef = useRef(null);

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logOut`, { withCredentials: true });
    } catch {}
    setUserData(null);
    navigate("/signin");
  };

  // 🔊 Speak function with Hindi voice detection
  const speak = (text) => {
    if (!text) return;

    setAiText(text);
    setHistory((prev) => [
      ...prev.slice(-9),
      { time: new Date().toLocaleTimeString(), text },
    ]);

    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;

    const voices = synth.getVoices();
    const isHindi = userData?.language?.toLowerCase() === "hindi";
    utter.lang = isHindi ? "hi-IN" : "en-US";

    // Select Hindi or English voice properly
    const selectedVoice = voices.find((v) =>
      isHindi
        ? v.lang.toLowerCase().includes("hi") ||
          v.name.toLowerCase().includes("hindi")
        : v.lang.toLowerCase().includes("en")
    );
    if (selectedVoice) utter.voice = selectedVoice;

    synth.speak(utter);
  };

  // 🌐 Open link safely
  const safeOpen = (url) => {
    if (!url) return;
    setPendingUrl(url);
    speak(
      userData?.language?.toLowerCase() === "hindi"
        ? "कृपया नीचे दिए गए बटन पर क्लिक करें, नया टैब खुलेगा।"
        : "Please tap the button below to open a new tab."
    );
  };

  // 🧠 Handle response type
  const handleCommand = (data) => {
    if (!data) return;
    const { type, userInput, response } = data;
    speak(response);

    const cleanQuery = (userInput || "")
      .replace(
        /(search|google|youtube|open|on|pe|par|jarvis|karo|खोलो|ढूंढो|सर्च)/gi,
        ""
      )
      .trim();

    let url = null;
    switch (type) {
      case "google_search":
        url = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;
        break;
      case "youtube_search":
      case "youtube_play":
        url = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
        break;
      case "instagram_open":
        url = "https://www.instagram.com/";
        break;
      case "facebook_open":
        url = "https://www.facebook.com/";
        break;
      case "calculator_open":
        url = "https://www.google.com/search?q=calculator";
        break;
      case "weather_show":
        url = "https://www.google.com/search?q=weather";
        break;
      default:
        break;
    }

    if (url) safeOpen(url);
  };

  // 🎤 Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        userData?.language?.toLowerCase() === "hindi"
          ? "आपका ब्राउज़र वॉयस रिकग्निशन सपोर्ट नहीं करता।"
          : "Your browser doesn’t support speech recognition."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang =
      userData?.language?.toLowerCase() === "hindi" ? "hi-IN" : "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      const name = userData?.assistantName?.toLowerCase() || "jarvis";

      if (transcript.toLowerCase().includes(name)) {
        speak(
          userData?.language?.toLowerCase() === "hindi"
            ? "जी बताइए, क्या करना है?"
            : "Yes, what would you like to do?"
        );

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
      }
    };

    recognition.onend = () => setIsListening(false);

    return () => recognition.stop();
  }, [userData, getGeminiResponse]);

  // 🎙️ Toggle mic
  const toggleMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
        setAiText("");
      } else {
        recognition.start();
        setIsListening(true);
      }
    } catch (error) {
      console.log("🎙️ Mic error:", error);
    }
  };

  return (
    <motion.div
      className="w-full h-[100vh] bg-gradient-to-b from-[#000428] to-[#004e92] text-white flex flex-col justify-center items-center relative overflow-hidden px-4 sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 🔹 Header (hamburger always visible) */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
        >
          <Menu size={28} />
        </button>

        {menuOpen && (
          <motion.div
            className="absolute right-0 mt-3 bg-white/95 backdrop-blur-md text-black rounded-2xl shadow-xl p-4 flex flex-col gap-3 w-[270px] max-h-[340px] overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate("/customize")}
              className="hover:text-blue-600 font-semibold"
            >
              {userData?.language?.toLowerCase() === "hindi"
                ? "कस्टमाइज़ करें"
                : "Customize"}
            </button>

            <button
              onClick={handleLogout}
              className="hover:text-red-600 font-semibold"
            >
              {userData?.language?.toLowerCase() === "hindi"
                ? "लॉग आउट"
                : "Log Out"}
            </button>

            <div className="mt-3 border-t border-gray-300 pt-2">
              <h3 className="font-semibold text-sm text-gray-800 mb-1">
                {userData?.language?.toLowerCase() === "hindi"
                  ? "बातचीत का इतिहास"
                  : "Conversation History"}
              </h3>
              <div className="max-h-[150px] overflow-y-auto text-sm text-gray-700 space-y-1">
                {history.length > 0 ? (
                  history
                    .slice()
                    .reverse()
                    .map((h, i) => (
                      <p key={i} className="text-[13px] leading-tight">
                        🕓 {h.time}: {h.text}
                      </p>
                    ))
                ) : (
                  <p className="text-gray-500 text-[13px] italic">
                    {userData?.language?.toLowerCase() === "hindi"
                      ? "अभी कोई बातचीत नहीं हुई।"
                      : "No conversations yet."}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Greeting */}
      <motion.h1
        className="text-[28px] sm:text-[36px] font-bold mb-4 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {userData?.language?.toLowerCase() === "hindi"
          ? `नमस्ते ${userData?.name || "उपयोगकर्ता"} 👋`
          : `Hello ${userData?.name || "User"} 👋`}
      </motion.h1>

      {/* Assistant intro */}
      <motion.h2
        className="text-[22px] sm:text-[26px] mb-3 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {userData?.language?.toLowerCase() === "hindi"
          ? "मैं हूँ आपका सहायक "
          : "I am your assistant "}
        <span className="text-blue-300 font-semibold">
          {userData?.assistantName || "Jarvis"}
        </span>
      </motion.h2>

      {/* Assistant Image */}
      {userData?.assistantImage && (
        <motion.img
          src={userData.assistantImage}
          alt="Assistant"
          className="w-[300px] h-[380px] rounded-2xl border-4 border-white mt-5 shadow-lg object-cover"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        />
      )}

      {/* AI Animation */}
      <motion.div
        className="mt-6 flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.img
          src={isListening ? aiGif : aiOff}
          alt="AI"
          className="w-[150px] h-[150px] rounded-full border-2 border-blue-300 shadow-lg"
          animate={isListening ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />

        {aiText && (
          <motion.p
            className="text-lg text-center text-gray-200 max-w-[80%] mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {userData?.language?.toLowerCase() === "hindi"
              ? `🤖 ${userData?.assistantName || "Jarvis"} कह रहा है: ${aiText}`
              : `🤖 ${userData?.assistantName || "Jarvis"} says: ${aiText}`}
          </motion.p>
        )}
      </motion.div>

      {/* Mic Button */}
      <motion.button
        onClick={toggleMic}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 rounded-full shadow-xl p-5 transition-all duration-300 ${
          isListening ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {isListening ? (
          <MicOff size={28} className="text-white" />
        ) : (
          <Mic size={28} className="text-white" />
        )}
      </motion.button>

      {/* Pending URL Button */}
      {pendingUrl && (
        <motion.button
          onClick={() => {
            window.open(pendingUrl, "_blank");
            setPendingUrl(null);
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg"
        >
          {userData?.language?.toLowerCase() === "hindi"
            ? "नया टैब खोलें"
            : "Open New Tab"}
        </motion.button>
      )}
    </motion.div>
  );
}

export default Home;
