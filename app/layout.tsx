import RecoilRootProvider from "@/provider/RecoilRootProvider";
import "../styles/globals.css";

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
      <body>
        <main
          className="100dvh bg-background flex flex-col items-center"
          style={{ position: "relative", backgroundColor: "#d1d7b1" }}
        >
          <RecoilRootProvider>{children}</RecoilRootProvider>
        </main>
      </body>
    </html>
  );
}
