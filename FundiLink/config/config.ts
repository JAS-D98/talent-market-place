export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name"
export const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset"

export const config = {
  cloudinary: {
    cloudName,
    uploadPreset,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  },
}
