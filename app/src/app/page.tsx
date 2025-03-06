import Image from "next/image";
import styles from "./page.module.css";
import { Calendar } from "../../components/Calendar";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          YOU HAVE ENOUGH TIME TO MAKE THINGS HAPPEN.
        </h1>
        <Calendar />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          SIGN IN
        </a>
      </footer>
    </div>
  );
}
