import "./globals.css";

export const metadata = {
  title: "로스쿨",
  description: "Mokoko",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
