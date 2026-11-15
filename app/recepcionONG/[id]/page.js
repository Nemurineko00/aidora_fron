import DetalleDonacion from "@/components/DetalleDonacion";

export const metadata = { title: "Detalle de donación" };

export default async function PaginaDetalleDonacion({ params }) {
  const { id } = await params;
  return <DetalleDonacion id={id} />;
}
