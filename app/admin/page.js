"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import { listarUsuariosAdmin, eliminarUsuarioAdmin } from "@/lib/servicios";

export default function HomeAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listarUsuariosAdmin()
      .then(setUsuarios)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  async function eliminar(u) {
    if (!window.confirm(`¿Desactivar a "${u.usuario}"? Ya no podrá iniciar sesión en Aidora.`)) return;    
    setError("");
    try {
      await eliminarUsuarioAdmin(u.id);
      setUsuarios((lista) => lista.filter((x) => x.id !== u.id));
    } catch (e) {
      setError(e.message);
    }
  }

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
        <section className="tablaUsuarios">
          <div className="tablaUsuariosEncabezado">
            <span>Usuario</span>
            <span>Reportes</span>
          </div>

          {error && <p className="mensajeError" role="alert">{error}</p>}

          {usuarios.map((u) => (
            <div key={u.id} className="filaUsuario">
              <Link href={`/historialAdmin?id=${u.id}`} className="filaNombre">{u.usuario}</Link>
              {u.reportes > 0 ? (
                <Link href={`/menuAdmin?id=${u.id}`} className="filaReportes">{u.reportes}</Link>
              ) : (
                <span className="filaReportes">{u.reportes}</span>
              )}
              <button type="button" className="btnEliminarUsuario" onClick={() => eliminar(u)}>Eliminar usuario</button>
            </div>
          ))}

          {cargando && <p className="sinResultados">Cargando...</p>}
          {!cargando && usuarios.length === 0 && !error && <p className="sinResultados">No hay usuarios.</p>}
        </section>
      </main>
    </>
  );
}