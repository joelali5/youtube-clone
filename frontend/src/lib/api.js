import axios from "axios";

const API_URL = "https://videotube-57tl.onrender.com/api/v1";

export const getAllVideos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Error fetching videos";
    throw new Error(message);
  }
};
