import React, { useState } from "react";
import { useFeeds } from "./util/useFeeds"

interface Feed {
  _id: string;
  name: string;
  url: string;
  color: string;
}

const RSSFeedForm: React.FC = () => {
  const { feeds, addFeed, deleteFeed } = useFeeds(); // Get the deleteFeed function from the hook
  const [feedName, setFeedName] = useState("");
  const [feedUrl, setFeedUrl] = useState("");
  const [feedColor, setFeedColor] = useState("#ffffff");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await addFeed(feedName, feedUrl, feedColor); // Use the addFeed function
      alert("RSS Feed added successfully!");
      setFeedName('');
      setFeedUrl('');
      setFeedColor('#ffffff');
    } catch (error) {
      console.error("Error adding RSS Feed:", error);
      alert("Failed to add RSS Feed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFeed(id); // Use the deleteFeed function
      alert("RSS Feed deleted successfully!");
    } catch (error) {
      console.error("Error deleting RSS Feed:", error);
      alert("Failed to delete RSS Feed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h1>Add RSS Feed</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Feed Name:
          <input
            type="text"
            value={feedName}
            onChange={(e) => setFeedName(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Feed URL:
          <input
            type="text"
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Feed Color:
          <input
            type="color"
            value={feedColor}
            onChange={(e) => setFeedColor(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">Add Feed</button>
      </form>

      <h1>Current RSS Feeds</h1>
      <ul>
        {feeds.map((feed: Feed) => (
          <li key={feed._id}>
            {feed.name} ({feed.url})
            <button onClick={() => handleDelete(feed._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    );
};

export default RSSFeedForm;
