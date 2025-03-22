import UserModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateimage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // Check if userId and prompt exist
    if (!userId || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Find user in the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if the user has enough credit balance
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    // Prepare the form data for API request
    const formData = new FormData();
    formData.append("prompt", prompt);

    // Send request to ClipDrop API
    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    // Convert response image to Base64 format
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct 1 credit from the user's balance
    await UserModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

    // Send response
    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
