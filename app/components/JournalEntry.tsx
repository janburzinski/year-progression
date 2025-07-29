"use client";

import { useState, useEffect } from "react";
import styles from "./JournalEntry.module.css";

interface JournalEntryProps {
  date: Date;
  entry: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

export function JournalEntry({
  date,
  entry,
  onSave,
  onClose,
}: JournalEntryProps) {
  const [text, setText] = useState(entry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3000/api/entries`, {method:"GET"})
        if(response.ok) {
          const data = await response.json();
          setText(data.entry.content || "");
        }  
      } catch {
        console.error("error while fetching the entry " + date)
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [date]);

  if(loading) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.date}>
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts for this day..."
        autoFocus
      />

      <div className={styles.footer}>
        <button
          className={styles.saveButton}
          onClick={() => {
            onSave(text);
            onClose();
          }}
        >
          Save Entry
        </button>
      </div>
    </div>
  );
}
