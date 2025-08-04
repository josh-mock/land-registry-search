import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} container`}>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://josh-mock.com"
          className={styles.footer__link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Josh Mock
        </a>
        .
      </p>
      <p>
        Information produced by HM Land Registry &copy; Crown copyright{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
