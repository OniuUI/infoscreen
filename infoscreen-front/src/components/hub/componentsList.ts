// src/components/componentsList.ts

import CurrentTime from "../currenttime";
import Temperature from "../temperature";
import Event from "../event";
import ThirstyLeaderboard from "../thirstyleaderboard";
import Carousel from "../carousel";
import NewsFeed from "../newsfeed";
import Gallery from "../gallery";

export const componentsList: {[key: string]: React.FC<any>} = {
    CurrentTime,
    Temperature,
    Event,
    ThirstyLeaderboard,
    Carousel,
    NewsFeed,
    Gallery,
};

export const componentsNames: string[] = Object.keys(componentsList);
