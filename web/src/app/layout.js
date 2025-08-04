import { IBM_Plex_Sans } from "next/font/google";
import "../styles/reset.css";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Land Registry Search",
  description: "Search for UK properties owned by companies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={ibmPlexSans.variable}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
