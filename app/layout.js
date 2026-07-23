import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "eTikket | Modern Event Ticketing in Kenya",
  description:
    "eTikket is a modern event ticketing platform for event organizers in Kenya, with M-Pesa STK Push payments and QR code ticket check-in.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
