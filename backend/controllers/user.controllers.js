import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"; // ✅ add this import
import geminiResponse from "../gemini.js";
import moment from 'moment';


// 🧠 Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // Middleware (auth) se aana chahiye

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, userId missing" });
    }

    const user = await User.findById(userId).select("-password"); // password exclude
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "get current user error",
      error: error.message,
    });
  }
};

// 🛠️ Update Assistant
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage = imageUrl;

    // 🔼 Agar file aayi hai (multer se)
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage) assistantImage = uploadedImage;
    }

    // ✅ User update
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Assistant updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Assistant Error:", error);
    return res.status(500).json({
      message: "update assistant error",
      error: error.message,
    });
  }
};


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);
    console.log("🎯 Gemini Raw Result:", result);

    const cleanResult = result.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanResult.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand." });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    console.log("🧩 Parsed JSON:", gemResult);

    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("h:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res
          .status(400)
          .json({ response: "Sorry, I didn't understand that command." });
    }

   
  } catch (error) {
    console.error("❌ askToAssistant Error:", error);
    return res.status(500).json({ response: "ask assistant error" });
  }
};
