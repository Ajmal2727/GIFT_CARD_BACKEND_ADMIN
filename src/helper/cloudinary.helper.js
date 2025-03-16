import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (loaclFilePath) => {
    try {
        if (!loaclFilePath) {
            throw new Error('LocalFilePath not specified');
        }

        const response = await cloudinary.uploader
            .upload(loaclFilePath, { resource_type: 'auto' })
            .catch((e) => {
                throw new Error('Cloudinary upload failed');
            });

        fs.unlinkSync(loaclFilePath);
        return response;
    } catch (error) {
        console.error(error);

        fs.unlinkSync(loaclFilePath);
    }
};


const uploadOnCloudinaryBase64 = async (base64Image) => {
  try {
      console.log("📸 Received Base64 Length:", base64Image.length); // Log length
      console.log("📸 Base64 Preview:", base64Image.substring(0, 100)); // Log first 100 chars

      if (!base64Image || typeof base64Image !== "string") {
          throw new Error("Invalid image format.");
      }

      if (!base64Image.startsWith("data:image")) {
          throw new Error("Base64 string is not an image.");
      }

      // 🔹 Extract Base64 Data (Remove "data:image/png;base64,")
      const base64Data = base64Image.split(",")[1];

      // 🔹 Convert Base64 to Buffer
      const imageBuffer = Buffer.from(base64Data, "base64");

      console.log("🔄 Uploading image to Cloudinary as a buffer...");

      // ✅ Upload as a file using Cloudinary's `upload_stream`
      return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
              { folder: "user_faces" },
              (error, result) => {
                  if (error) {
                      console.error("❌ Cloudinary Upload Error:", error.message);
                      return reject(new Error("Image upload failed: " + error.message));
                  }
                  console.log("✅ Cloudinary Upload Success:", result.secure_url);
                  resolve(result.secure_url);
              }
          );

          stream.end(imageBuffer);
      });
  } catch (error) {
      console.error("❌ Cloudinary Upload Error:", error.message);
      throw new Error("Image upload failed: " + error.message);
  }
};



const deleteSingleAsset = async (public_uri) => {
    try {
        if (!public_uri) throw new Error('Public_uri not specified');

        const response = await cloudinary.uploader
            .destroy(public_uri)
            .catch((e) => {
                throw new Error('Cloudinary delete failed');
            });

        return response;
    } catch (error) {
        console.error(error);
    }
};

export { uploadOnCloudinary, deleteSingleAsset,uploadOnCloudinaryBase64 };