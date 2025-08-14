"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "../model/news";
import { v4 as uuidv4 } from "uuid";
import { loadNews, saveNews } from "../lib/localStorage";

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);

  // 1) Загрузка из localStorage (только на клиенте)
  useEffect(() => {
    const stored = loadNews();

    // Миграция старых данных (id: number -> string, починка даты)
    const migrated: NewsItem[] = (stored || []).map((it) => {
      const id = typeof it?.id === "string" ? it.id : String(it?.id ?? uuidv4());
      // если дата невалидна/пустая — ставим текущую
      const iso = it?.date ? new Date(it.date) : new Date();
      const date = isNaN(iso.getTime()) ? new Date().toISOString() : iso.toISOString();

      const item: NewsItem = {
        id,
        title: String(it?.title ?? ""),
        content: String(it?.content ?? ""),
        date,
      };

      if (typeof it?.image === "string" && it.image.length > 0) {
        item.image = it.image; // уже base64
      }
      return item;
    });

    setNews(migrated);
  }, []);

  // 2) Автосохранение в localStorage при каждом изменении
  useEffect(() => {
    saveNews(news);
  }, [news]);

  /**
   * Добавление новости.
   * imageBase64 — dataURL (например, "data:image/png;base64,...."), опционально
   */
  const addNews = useCallback(
    (title: string, content: string, imageBase64?: string | null) => {
      const newItem: NewsItem = {
        id: uuidv4(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(), // корректная ISO-строка (дата публикации)
        ...(imageBase64 ? { image: imageBase64 } : {}),
      };

      // Порядок внутри стора можно оставить обычным;
      // в UI у вас уже стоит .slice().reverse() для "новые сверху".
      setNews((prev) => [...prev, newItem]);
    },
    []
  );

  /**
   * Редактирование новости.
   * Если imageBase64 === undefined — изображение не трогаем.
   * Если imageBase64 === null — можно удалить изображение.
   * Если imageBase64 — строка, заменяем.
   */
  const editNews = useCallback(
    (id: string, title: string, content: string, imageBase64?: string | null) => {
      setNews((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;

          const updated: NewsItem = {
            ...n,
            title: title.trim(),
            content: content.trim(),
          };

          if (imageBase64 === null) {
            // удалить картинку
            const { image, ...rest } = updated;
            return rest;
          }
          if (typeof imageBase64 === "string") {
            updated.image = imageBase64;
          }
          return updated;
        })
      );
    },
    []
  );

  /** Удаление новости */
  const deleteNews = useCallback((id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { news, addNews, editNews, deleteNews };
}