import React, { useContext } from "react";
// import Card from "../components/Card.jsx"
import { userDataContext } from "../context/UserContext.jsx";

function Card({ image }) {
    const {
      serverUrl,
      userData,
      setUserData,
      backendImage,
      setBackendImage,
      setFrontendImage,
      selectedImage,
      setSelectedImage,
      frontendImage,
    } =useContext(userDataContext)

  const handleClick = () => {
    setSelectedImage(image);
    setFrontendImage(image);
    setBackendImage(null); // reset uploaded file
  };

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff75] rounded-2xl
        overflow-hidden cursor-pointer transition-all duration-300
        ${
          setSelectedImage === image
            ? "border-4 border-white shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]"
            : "hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]"
        }`}
      onClick={(handleClick)=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}>
      <img src={image} alt="card-img" className="w-full h-full object-cover" />
    </div>
  );
}

export default Card;
