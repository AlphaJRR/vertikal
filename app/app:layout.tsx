export const metadata = {
  title: "VERTIKAL",
  description: "Creator-First Vertical Cinema App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: "black",
        color: "white",
        fontFamily: "sans-serif",
      }}>
        {children}
      </body>
    </html>
  );
}
›
