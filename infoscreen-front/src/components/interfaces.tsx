export interface RSSItem {
  title: string;
  link: string;
  description: string;
  contentSnippet: string;
  date: string;
  categories: string[];
  color: string;
}

export interface RSSFeed {
  items: RSSItem[];
}
