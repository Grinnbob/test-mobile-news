"use client";

import { useNews } from "@/entities/news/hooks/useNews";
import React, { useState } from "react";

export const NewsList = () => {
  const { news, addNews, editNews, deleteNews } = useNews();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      editNews(editingId, title, content);
      setEditingId(null);
    } else {
      addNews(title, content);
    }

    setTitle("");
    setContent("");
    setFormOpen(false);
  };

  const startEditing = (id: string) => {
    const item = news.find((n) => n.id === id);
    if (!item) return;
    setEditingId(id);
    setTitle(item.title);
    setContent(item.content);
    setFormOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Новости</h1>

      {!formOpen && (
        <button style={styles.addButton} onClick={() => setFormOpen(true)}>
          Добавить новость
        </button>
      )}

      <div
        style={{
          ...styles.form,
          maxHeight: formOpen ? 500 : 0,
          opacity: formOpen ? 1 : 0,
          padding: formOpen ? 16 : "0 16px",
          transition: "all 0.4s ease",
        }}
      >
        {formOpen && (
          <>
            <input
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Текст"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ ...styles.input, height: 80, resize: "none" }}
            />
            <div style={styles.buttonRow}>
              <button
                style={{ ...styles.button, backgroundColor: "#f9a8d4" }}
                onClick={handleSubmit}
              >
                {editingId ? "Сохранить" : "Опубликовать"}
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#fbcfe8" }}
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                }}
              >
                Скрыть
              </button>
            </div>
          </>
        )}
      </div>

      <ul style={styles.list}>
        {news.slice().reverse().map((item) => {
          const expanded = expandedCards[item.id] || false;
          const isLong = item.content.length > 120;
          const displayText = expanded
            ? item.content
            : isLong
            ? item.content.slice(0, 120) + "..."
            : item.content;

          return (
            <li key={item.id} style={styles.card}>
              <div style={styles.cardTopBar}>
                <button
                  style={styles.iconButton}
                  onClick={() => startEditing(item.id)}
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button
                  style={styles.iconButton}
                  onClick={() => deleteNews(item.id)}
                  title="Удалить"
                >
                  ❌
                </button>
              </div>

              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p
                style={{
                  ...styles.cardText,
                  transition: "all 0.3s ease",
                }}
              >
                {displayText}
              </p>
              {isLong && (
                <button
                  style={styles.showMoreButton}
                  onClick={() => toggleExpand(item.id)}
                >
                  {expanded ? "Скрыть" : "Показать полностью"}
                </button>
              )}
              <div style={styles.cardBottomBar}>
                <span style={styles.cardDate}>
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 16,
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: 16,
    textAlign: "center",
    color: "#9d174d",
  },
  addButton: {
    display: "block",
    margin: "0 auto 16px auto",
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  form: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #f9a8d4",
    borderRadius: 6,
    fontSize: "0.95rem",
    backgroundColor: "#fff",
    color: "#000",
  },
  buttonRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#831843",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: 120,
  },
  cardTopBar: {
    position: "absolute",
    right: 8,
    top: 8,
    display: "flex",
    gap: 4,
  },
  iconButton: {
    border: "none",
    background: "transparent",
    fontSize: "1rem",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: 4,
    paddingRight: 40,
    color: "#9d174d",
  },
  cardText: {
    fontSize: "0.95rem",
    marginBottom: "auto",
    whiteSpace: "pre-wrap",
    color: "#4b5563",
  },
  showMoreButton: {
    border: "none",
    background: "transparent",
    color: "#9d174d",
    fontSize: "0.85rem",
    cursor: "pointer",
    alignSelf: "flex-start",
    padding: 0,
    marginTop: 4,
  },
  cardBottomBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cardDate: {
    fontSize: "0.8rem",
    color: "#9d174d",
  },
};
