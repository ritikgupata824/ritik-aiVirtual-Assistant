import React, { useContext, useRef } from "react";
import { motion } from "framer-motion"; // 🪄 Animation import
import Card from "../components/Card.jsx";
import { RiFolderImageFill } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

// sample images
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";

function Customize() {
  const inputImage = useRef();
  const {
    backendImage,
    setBackendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    frontendImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage("input");
    }
  };

  const images = [image1, image2, image3, image4, image5, image6, image7];

  return (
    <motion.div
      className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center p-[20px]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className="text-white mb-[30px] text-[30px] text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Select your{" "}
        <span className="text-[#0000ff6c]">Assistant Image</span>
      </motion.h1>

      <motion.div
        className="w-[90%] max-w-[900px] flex flex-wrap justify-center items-center gap-[15px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <Card image={img} />
          </motion.div>
        ))}

        {/* Custom Image Upload Card */}
        <motion.div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff75] rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300
            ${
              selectedImage === "input"
                ? "border-4 border-white shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]"
                : "hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]"
            }`}
          onClick={() => inputImage.current.click()}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          {!frontendImage && (
            <RiFolderImageFill className="text-white w-[50px] h-[50px]" />
          )}
          {frontendImage && (
            <motion.img
              src={frontendImage}
              alt="preview"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            ref={inputImage}
            hidden
            onChange={handleImage}
          />
        </motion.div>
      </motion.div>

      {(selectedImage || backendImage || frontendImage) && (
        <motion.button
          className="min-w-[150px] h-[60px] bg-white rounded-full cursor-pointer mt-[30px] text-black font-semibold text-[19px]"
          onClick={() => navigate("/customize2")}
          whileHover={{ scale: 1.05, backgroundColor: "#dfe6e9" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Next
        </motion.button>
      )}
    </motion.div>
  );
}

export default Customize;
