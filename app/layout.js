import "./globals.css";

export const metadata = {
  title: "Aidora",
  description: "Conecta con personas que tengan medicamentos que necesitas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
