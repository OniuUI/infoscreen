export interface RSSItem {
    title: string;
    link: string;
    description: string;
    contentSnippet: string; // Add contentSnippet property
    date: string; // Add date property
    categories: string[]; // Add categories property
}


export interface RSSFeed {
  items: RSSItem[];
}
