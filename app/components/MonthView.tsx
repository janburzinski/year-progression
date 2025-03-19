"use client";

import { useEffect, useState } from "react";
import styles from "./MonthView.module.css";
import { JournalEntry } from "./JournalEntry";

interface EntryModel {
  content: string;
  userId: Number;
  date: Date;
}

interface PostRequestData {
  content: string;
  date?: Date | null;
  userId: Number;
}

interface PostResponseData {
  success: Boolean;
  entry: EntryModel;
}

interface MonthViewProps {
  month: number;
  year: number;
  onBack: () => void;
}

export function MonthView({ month, year, onBack }: MonthViewProps) {
  const [calendar, setCalendar] = useState<(number | null)[][]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [loading,setLoading] = useState<boolean>(false);

  useEffect(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const calendarArray: (number | null)[][] = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week: (number | null)[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          week.push(null);
        } else if (day > totalDays) {
          week.push(null);
        } else {
          week.push(day);
          day++;
        }
      }
      calendarArray.push(week);
      if (day > totalDays) break;
    }

    setCalendar(calendarArray);
  }, [month, year]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem(`journal-${year}-${month}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [month, year]);

  async function saveEntry(date: Date, text: string) {
    setLoading(true);
    console.log("date: " + date + " - text: " + text);
    const data: PostRequestData = {
      content: text,
      date: date,
      userId: 1
    };

    try {
      // TODO: update dev url hihi
      const response = await fetch(`http://localhost:3000/api/entries/`,{
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
      });

      // TODO: update error handling
      if(!response.ok) throw new Error("error while creating new entry");

      // TODO
      const responseData = await response.json();

    } catch (error) {

    }

   /*const newEntries = {
      ...entries,
      [date.toISOString()]: text,
    };
    setEntries(newEntries);
    localStorage.setItem(
      `journal-${year}-${month}`,
      JSON.stringify(newEntries)
    );*/
  };

  const handleDateClick = (day: number | null) => {
    if (day === null) return;
    const date = new Date(year, month, day);
    setSelectedDate(date);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <h2 className={styles.monthTitle}>
          {monthNames[month]} {year}
        </h2>
      </div>

      <div className={styles.content}>
        <div className={styles.calendarGrid}>
          <div className={styles.weekDays}>
            {weekDays.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          {calendar.map((week, i) => (
            <div key={i} className={styles.week}>
              {week.map((day, j) => {
                const date = day ? new Date(year, month, day) : null;
                const hasEntry = date ? entries[date.toISOString()] : false;

                return (
                  <div
                    key={`${i}-${j}`}
                    className={`${styles.day} 
                      ${day === null ? styles.empty : ""} 
                      ${
                        day === new Date().getDate() &&
                        month === new Date().getMonth()
                          ? styles.today
                          : ""
                      }
                      ${hasEntry ? styles.hasEntry : ""}
                      ${
                        date &&
                        selectedDate?.toISOString() === date.toISOString()
                          ? styles.selected
                          : ""
                      }
                    `}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                    {hasEntry && <div className={styles.entryDot} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {selectedDate && (
          <JournalEntry
            date={selectedDate}
            entry={entries[selectedDate.toISOString()] || ""}
            onSave={(text) => saveEntry(selectedDate, text)}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>
    </div>
  );
}
