"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listarDonacionesOng, obtenerOng } from "@/lib/servicios";
import { formatoFecha, formatoHora } from "@/lib/formato";

export default function VistaONG() {
  const [ong, setOng] = useState(null);
  const [donaciones, setDonaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerOng().then(setOng);
    listarDonacionesOng()
      .then(setDonaciones)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <header className="headerAdmin">
        <div className="headerAdminMarca">
          <Image src="/img/iconoAidora.png" alt="Aidora" width={64} height={64} className="logoAdmin" />
          <div>
            <h2>Aidora</h2>
            <p>Bienvenido &quot;{ong?.nombre ?? "ONG/HOSPITAL"}&quot;</p>
          </div>
        </div>
        <Link href="/login" className="cerrarSesionAdmin">Cerrar sesión</Link>
      </header>

      <main className="mainAdmin">
        <section className="tablaUsuarios">
          <div className="tablaONGEncabezado">
            <span>Donante</span>
            <span>Receptor</span>
            <span>Fecha</span>
            <span>Hora</span>
          </div>

          {error && <p className="mensajeError" role="alert">{error}</p>}

          {donaciones.map((d) => (
            <Link key={d.id} href={`/recepcionONG/${d.id}`} className="filaONG">
              <span>{d.donante.nombre}</span>
              <span>{d.receptor.nombre}</span>
              <span>{formatoFecha(d.aceptadaEn)}</span>
              <span>{formatoHora(d.aceptadaEn)}</span>
            </Link>
          ))}

          {cargando && <p className="sinResultados">Cargando...</p>}
          {!cargando && donaciones.length === 0 && !error && <p className="sinResultados">No hay donaciones registradas.</p>}
        </section>
      </main>
    </>
  );
}
