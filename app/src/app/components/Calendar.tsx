"use client";

import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";
import { MonthView } from "./MonthView";

export function Calendar() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const months = [
    ["JAN", "FEB", "MAR", "APR"],
    ["MAY", "JUN", "JUL", "AUG"],
    ["SEP", "OCT", "NOV", "DEC"],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      const totalMs = endOfYear.getTime() - startOfYear.getTime();
      const elapsedMs = now.getTime() - startOfYear.getTime();
      const progress = (elapsedMs / totalMs) * 100;

      const diff = endOfYear.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        progress: progress,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (selectedMonth !== null) {
    return (
      <MonthView
        month={selectedMonth}
        year={new Date().getFullYear()}
        onBack={() => setSelectedMonth(null)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.timerContainer}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${timeLeft.progress}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {timeLeft.progress.toFixed(1)}% OF {new Date().getFullYear()}{" "}
            COMPLETED
          </div>
        </div>

        <div className={styles.timerGrid}>
          <div className={styles.timerBlock}>
            <div className={styles.timerNumber}>{timeLeft.days}</div>
            <div className={styles.timerLabel}>DAYS</div>
          </div>
          <div className={styles.timerBlock}>
            <div className={styles.timerNumber}>
              {timeLeft.hours.toString().padStart(2, "0")}
            </div>
            <div className={styles.timerLabel}>HOURS</div>
          </div>
          <div className={styles.timerBlock}>
            <div className={styles.timerNumber}>
              {timeLeft.minutes.toString().padStart(2, "0")}
            </div>
            <div className={styles.timerLabel}>MINUTES</div>
          </div>
          <div className={styles.timerBlock}>
            <div className={styles.timerNumber}>
              {timeLeft.seconds.toString().padStart(2, "0")}
            </div>
            <div className={styles.timerLabel}>SECONDS</div>
          </div>
        </div>
        <div className={styles.timerSubtext}>LEFT THIS YEAR</div>
      </div>

      <div className={styles.calendar}>
        {months.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((month, colIndex) => {
              const monthIndex = rowIndex * 4 + colIndex;
              return (
                <div
                  key={month}
                  className={`${styles.month} ${
                    new Date().getMonth() === monthIndex ? styles.current : ""
                  }`}
                  onClick={() => setSelectedMonth(monthIndex)}
                  role="button"
                  tabIndex={0}
                >
                  {month}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
