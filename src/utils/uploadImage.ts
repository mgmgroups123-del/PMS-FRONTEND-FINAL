import axios from "axios";
import { toast } from "react-toastify";

export const handleUploadImage = async (formData:any) => {
  
  try {
    const res = await axios.post("http://localhost:3002/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Uploaded to S3");
    console.log("S3 URL:", res.data.url);
  } catch (err) {
    console.error("Upload failed:", err);
    toast.error("Upload failed");
  }
};
