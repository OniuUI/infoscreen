import { useState, useEffect } from "react";
import {apiService} from "../../api/apiservice";

interface Feed {
  _id: string;
  name: string;
  url: string;
  color: string;
}

export const useFeeds = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  const fetchFeeds = async () => {
    try {
      const response = await apiService.get("/rss/feeds"); // Adjust the API endpoint as per your backend
      setFeeds(response);
    } catch (error) {
      console.error("Error fetching RSS feeds:", error);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const addFeed = async (name: string, url: string, color: string) => {
    try {
        await apiService.post("/rss/add-feed", { name, url, color }); // Adjust the API endpoint as per your backend
      fetchFeeds(); // Refresh the feeds after adding a new one
    } catch (error) {
      throw new Error("Failed to add RSS feed");
    }
  };

  const deleteFeed = async (id: string) => {
    try {
      await apiService.delete(`/rss/${id}`); // Adjust the API endpoint as per your backend
      fetchFeeds(); // Refresh the feeds after deleting one
    } catch (error) {
        throw new Error("Failed to delete RSS feed");
    }
  };

  return { feeds, addFeed, deleteFeed };
};
