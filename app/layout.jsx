import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blue Dictionary",
  description: "A dictionary for blue explanations",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>{children}<footer style={{ textAlign: "center", padding: 12, color: "#526a9b" }}><a href="https://songhaifan.github.io/frankie-dictionary/" aria-label="About Frankie dictionary" style={{ display: "inline-flex", alignItems: "center", padding: "6px", color: "inherit",  }}><span aria-hidden="true" style={{ display: "block", width: 76, height: 26, backgroundColor: "currentColor", mask: "url(/frankie-signature.svg) center / contain no-repeat", WebkitMask: "url(/frankie-signature.svg) center / contain no-repeat" }} /></a></footer></body>
    </html>
  );
}
