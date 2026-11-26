"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BuscadorMedicamentos from "@/components/buscarMedicamentos";
import ModalReporte from "@/components/ModalReporte";
import { listarMisDonaciones } from "@/lib/servicios";
import { formatoFecha } from "@/lib/formato";

export default function VistaMisDonaciones() {
  const [donaciones, setDonaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [reportando, setReportando] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setDonaciones(await listarMisDonaciones());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

    const lista = donaciones.map((d) => ({
    id: d.id,
    nombre: d.medicamento.nombre,
    rs: d.medicamento.registroSanitario,
    imagen: d.medicamento.fotoUrl,
    href: `/detPublicacion?id=${d.medicamento.id}&donacion=${d.id}`,
    detalles: d.estado === "ACEPTADA" && d.fechaEntrega ? [`Fecha de entrega: ${formatoFecha(d.fechaEntrega)}`] : [],
    original: d,
  }));

  return (
    <>
      <header className="logo headerHome">
        <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/misDonaciones" className="activo" aria-current="page">Mis Donaciones</Link>
          <Link href="/misPublicaciones">Mis Publicaciones</Link>
          <Link href="/sesion" className="linkPerfil">
            <Image src="/img/perfil.png" alt="Perfil" width={60} height={60} />
          </Link>
        </nav>
      </header>

      <BuscadorMedicamentos
        medicamentos={lista}
        cargando={cargando}
        error={error}
        aviso={aviso}
        vacio="Todavía no participas en ninguna donación."
        renderAcciones={({ original: d }) =>
          d.miRol === "RECEPTOR" && ["ACEPTADA", "COMPLETADA"].includes(d.estado) ? (
            <button
              type="button"
              className="btnTarjeta secundario"
              onClick={() => {
                setAviso("");
                setReportando(d);
              }}
            >
              Reportar
            </button>
          ) : null
        }
      />

      {reportando && (
        <ModalReporte
          publicacionId={reportando.medicamento.id}
          contraparte={reportando.contraparte}
          medicamento={reportando.medicamento.nombre}
          onCerrar={() => setReportando(null)}
          onEnviado={() => {
            setReportando(null);
            setAviso("Tu reporte fue enviado al administrador.");
          }}
        />
      )}

      <Link href="/detalles" className="btnAgregarMedeicamento" aria-label="Agregar Medicamento">+</Link>
    </>
  );
}
