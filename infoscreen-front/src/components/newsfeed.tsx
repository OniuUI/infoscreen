import React, { useState, useEffect } from 'react';
import { RSSItem } from './interfaces';
import { RSSFeed } from './interfaces';
import {apiService} from "./api/apiservice";
import './css/newsfeed.css';

const Newsfeed: React.FC = () => {
  const [feed, setFeed] = useState<RSSItem[]>([]);

  useEffect(() => {
    const fetchNewsfeed = async () => {
      try {
        const data: RSSItem[] = await apiService.get(`/rss`);
        setFeed(data);
      } catch (error) {
        console.error('Error fetching feed data:', error);
      }
    };

    fetchNewsfeed();
    const intervalId = setInterval(fetchNewsfeed, 420000); // Fetch every 7 min

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="newsfeed-container">
      <div className="newsfeed">
        {feed.map((item, index) => (
          <div className="news-card" key={index} style={{backgroundColor: item.color}}>
            <h2 className="news-title">{item.title}</h2>
            <p className="news-content">{item.contentSnippet}</p>
            <div className="news-meta">
              <span className="news-date">{item.date}</span>
              <span className="news-categories">{item.categories ? item.categories.join(', ') : ''}</span>
            </div>
          </div>
          ))}
      </div>
    </div>
    );
};

export default Newsfeed;

