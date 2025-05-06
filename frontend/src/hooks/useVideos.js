import { useState, useEffect } from "react";
import { getAllVideos } from "@/lib/api";

export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAllVideosData = async () => {
      try {
        setLoading(true);
        const response = await getAllVideos();
        setVideos(response.data.data.videos);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getAllVideosData();
  }, []);

  return { videos, loading, error };
};
