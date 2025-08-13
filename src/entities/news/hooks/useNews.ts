"use client";

import { useState, useEffect } from "react";
import { loadNews, saveNews } from "../lib/localStorage";
import { v4 as uuid } from "uuid";
import { NewsItem } from "../model/news";

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    setNews(loadNews());
  }, []);

  const addNews = (title: string, content: string) => {
    const newItem: NewsItem = {
      id: uuid(),
      title,
      content,
      date: new Date().toISOString(),
    };
    const updated = [...news, newItem];
    setNews(updated);
    saveNews(updated);
  };

const editNews = (id: string, title: string, content: string) => {
  const updated = news.map((item) =>
    item.id === id ? { ...item, title, content } : item
  );
  setNews(updated);
  saveNews(updated);
};

  const deleteNews = (id: string) => {
    const updated = news.filter((item) => item.id !== id);
    setNews(updated);
    saveNews(updated);
  };

  return { news, addNews, editNews, deleteNews };
};
