import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={`${styles.header} container`}>
      <h1 className={styles.header__title}>Land Registry Company Search</h1>
      <nav className={styles.header__nav}>
        <ul className={styles.header__links}>
          <li className={styles.header__link}>
            <Link href="/">Search</Link>
          </li>
          <li className={styles.header__link}>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
