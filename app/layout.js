import "./globals.css";
import {Baloo_2} from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Aidora",
  description: "Conecta con personas que tengan medicamentos que necesitas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={baloo.className}>
        {children}
      </body>
    </html>
  );
}
