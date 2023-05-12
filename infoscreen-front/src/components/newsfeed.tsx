import React, { useState, useEffect } from 'react';
import { RSSItem } from './interfaces';
import { RSSFeed } from './interfaces';
import { API_BASE_URL } from '../apiConfig';
import './css/newsfeed.css';

const Newsfeed: React.FC = () => {
  const [feed, setFeed] = useState<RSSItem[]>([]);

  useEffect(() => {
    const fetchNewsfeed = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/rss`);
        const data: RSSFeed = await response.json();

        setFeed(
          data.items.map(({ title, link, description, contentSnippet, date, categories }): RSSItem => ({
            title,
            link,
            description,
            contentSnippet,
            date,
            categories: categories ?? [],
          }))
        );
      } catch (error) {
        console.error('Error fetching feed data:', error);
      }
    };

    fetchNewsfeed();
    const intervalId = setInterval(fetchNewsfeed, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="newsfeed-container">
      <div className="newsfeed">
        {feed.map((item, index) => (
          <div className="news-card" key={index}>
            <h2 className="news-title">{item.title}</h2>
            <p className="news-content">{item.contentSnippet}</p>
            <div className="news-meta">
              <span className="news-date">{item.date}</span>
              <span className="news-categories">{item.categories.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
};

export default Newsfeed;
