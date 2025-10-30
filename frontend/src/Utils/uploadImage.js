import axiosInstance, { API_PATHS } from "./apiPaths.js";

const uploadImage = async (imageFile) => {

  if (!imageFile) {
    throw new Error("No image file provided for upload");
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_PROFILE_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image", error);
    throw error;
  }
}

export default uploadImage;