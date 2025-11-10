import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
   const token = req.cookies?.token;
if(!token) return res.status(401).json({ message: "Unauthorized: token not found" });


    const verifyToken = jwt.verify(token,process.env.JWT_SECRET);

    // ✅ ध्यान दो: तुम्हारे genToken में क्या key है — userId या id
    req.userId = verifyToken.userId 
    // || verifyToken.id;

    next();
  } catch (error) {
    console.error("isAuth error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;
