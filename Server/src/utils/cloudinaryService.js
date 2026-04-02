import fs from "fs"
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath)
        return null;

        // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
        const res = await cloudinary.uploader.upload(localFilePath, options);
        return res
    } catch (error) {
        console.error("Upload on clodinary error: ", error)
    } finally {
        if (fs.existsSync(localFilePath))
            fs.unlinkSync(localFilePath);
    }
}

export {uploadOnCloudinary}