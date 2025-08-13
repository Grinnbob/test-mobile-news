import { NewsItem } from "../model/news";
const STORAGE_KEY = "news";

export const loadNews = (): NewsItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveNews = (news: NewsItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
};
