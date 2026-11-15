"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { obtenerUsuarioAdmin } from "@/lib/servicios";

export default function VistaMenuAdmin() {
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
        <Link href="/login" className="cerrarSesionAdmin">Cerrar sesión</Link>
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
            <h3>Reportes</h3>
            {error && <p className="mensajeError" role="alert">{error}</p>}
            <div className="cajaBlancaAdmin">
              {datos?.reportes.map((r) => (
                <article key={r.id} className="tarjetaReporte">
                  <p>
                    Motivo del reporte:<br />
                    {r.motivo}
                    <br />
                    Reportó: {r.reportante}
                  </p>
                  <div className="imagenReporte">
                    {r.imagenUrl ? <img src={r.imagenUrl} alt="Evidencia del reporte" /> : "Sin imagen"}
                  </div>
                </article>
              ))}
              {datos && datos.reportes.length === 0 && <p className="itemHistorial">Este usuario no tiene reportes.</p>}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
