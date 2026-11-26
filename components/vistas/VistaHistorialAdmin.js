"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import { useSearchParams } from "next/navigation";
import { obtenerUsuarioAdmin } from "@/lib/servicios";
import { formatoFecha, ETIQUETA_ESTADO } from "@/lib/formato";

export default function VistaHistorialAdmin() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}

function Contenido() {
  const id = useSearchParams().get("id");
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(id ? "" : "Elige un usuario desde el panel de administración.");

  useEffect(() => {
    if (!id) return;
    obtenerUsuarioAdmin(id)
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, [id]);

  const u = datos?.usuario;

  return (
    <>
      <header className="headerAdmin">
        <div className="headerAdminMarca">
          <Image src="/img/iconoAidora.png" alt="Aidora" width={64} height={64} className="logoAdmin" />
          <div>
            <h2>Aidora</h2>
            <p>Bienvenido Administrador</p>
          </div>
        </div>
        <BotonCerrarSesion className="cerrarSesionAdmin" />
      </header>

      <main className="mainAdmin">
        <section className="panelAdmin">
          <div className="datosUsuarioAdmin">
            <label htmlFor="usuario">Usuario</label>
            <input id="usuario" type="text" value={u?.usuario ?? ""} readOnly />

            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" value={u?.nombre ?? ""} readOnly />

            <label htmlFor="apellidoPaterno">Apellido paterno</label>
            <input id="apellidoPaterno" type="text" value={u?.apellidoPaterno ?? ""} readOnly />

            <label htmlFor="apellidoMaterno">Apellido materno</label>
            <input id="apellidoMaterno" type="text" value={u?.apellidoMaterno ?? ""} readOnly />

            <Link href="/admin" className="btnCerrarAdmin">Cerrar</Link>
          </div>

          <div className="columnaDerechaAdmin">
            <h3>Historial</h3>
            {error && <p className="mensajeError" role="alert">{error}</p>}
            <div className="cajaBlancaAdmin historialColumnas">
              <div className="historialColumna">
                <h4>Publicaciones</h4>
                {datos?.publicaciones.map((p) => (
                  <p key={p.id} className="itemHistorial">
                    {p.nombre} (RS: {p.registroSanitario}) - {ETIQUETA_ESTADO[p.estado]}, {formatoFecha(p.creadoEn)}
                  </p>
                ))}
                {datos && datos.publicaciones.length === 0 && <p className="itemHistorial">Sin publicaciones.</p>}
              </div>
              <div className="historialColumna">
                <h4>Solicitudes</h4>
                {datos?.solicitudes.map((s) => (
                  <p key={s.id} className="itemHistorial">
                    {s.medicamento.nombre} (RS: {s.medicamento.registroSanitario}) - {ETIQUETA_ESTADO[s.estado]}, {formatoFecha(s.solicitadaEn)}
                  </p>
                ))}
                {datos && datos.solicitudes.length === 0 && <p className="itemHistorial">Sin solicitudes.</p>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
