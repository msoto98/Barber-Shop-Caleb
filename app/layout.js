import "./globals.css";

export const metadata = {
  title: "Barber Shop Caleb — Reservas",
  description: "Reserva tu cita en Barber Shop Caleb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
