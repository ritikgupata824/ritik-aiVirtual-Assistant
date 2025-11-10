import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion"; // 👈 animation import

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error);
      setErr(error.response?.data?.message || "Login failed");
      setLoading(false);
      setUserData(null);
    }
  };

  return (
    <motion.div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.form
        className="w-[90%] h-[600px] max-w-[500px] bg-[rgba(0,0,0,0.44)] backdrop-blur shadow-lg shadow-black
         flex flex-col items-center justify-center gap-[20px] px-[20px]"
        onSubmit={handleSignIn}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-white text-[30px] font-semibold mb-[30px]"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Sign In to <span className="text-blue-400">Virtual Assistant</span>
        </motion.h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white
          bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[20px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[20px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {!showPassword ? (
            <IoIosEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoIosEyeOff
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err && <p className="text-red-500 text-[17px]">*{err}</p>}

        <motion.button
          className="min-w-[150px] h-[60px] bg-white rounded-full mt-[30px] text-black font-semibold text-[19px]"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Loading..." : "Sign In"}
        </motion.button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-blue-400">Sign Up</span>
        </p>
      </motion.form>
    </motion.div>
  );
}

export default SignIn;
