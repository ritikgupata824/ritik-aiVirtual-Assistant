import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"

const uploadOnCloudinary = async (filePath) =>{
    

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_ClOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET
    });
    
    try {

        const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath)
       return uploadResult.secure_url
        
    } catch (error) {
     fs.unlinkSync(filePath)
     return res.status(500).json({message:"cloudinary error"})
    }
})();
}

export default uploadOnCloudinary