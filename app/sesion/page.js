"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import { obtenerPerfil, guardarEdad } from "@/lib/servicios";
import { LIMITES } from "@/lib/validaciones";
import { ETIQUETA_RELACION } from "@/lib/formato";

export default function Sesion() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [edadNueva, setEdadNueva] = useState("");
  const [guardandoEdad, setGuardandoEdad] = useState(false);

  useEffect(() => {
    obtenerPerfil()
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, []);

  async function enviarEdad(e) {
    e.preventDefault();
    setError("");
    setGuardandoEdad(true);
    try {
      const usuario = await guardarEdad(edadNueva);
      setDatos((d) => ({ ...d, usuario }));
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardandoEdad(false);
    }
  }

  const u = datos?.usuario;
  const ayudante = datos?.ayudante;

  return (
    <>
      <header className="logo headerHome">
        <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/misDonaciones">Mis Donaciones</Link>
          <Link href="/misPublicaciones">Mis Publicaciones</Link>
          <BotonCerrarSesion className="btnSesion" />
        </nav>
        <Image src="/img/perfil.png" alt="Mi perfil" width={60} height={60} />
      </header>

      <main className="mainSesion">
        <div className="fichaPerfil">
        <section className="tarjetaPerfil">
          <div className="datosPerfil">
            <p>Usuario</p>
            <p className="contenedor">{u?.usuario}</p>
            <p>Nombre</p>
            <p className="contenedor">{u?.nombre}</p>
            <p>Apellido Paterno</p>
            <p className="contenedor">{u?.apellidoPaterno}</p>
            <p>Apellido Materno</p>
            <p className="contenedor">{u?.apellidoMaterno}</p>
            <p>Edad</p>
            {!u || u.edad != null ? (
              <p className="contenedor">{u?.edad}</p>
            ) : (
              <form className="formEdad" onSubmit={enviarEdad}>
                <input type="number" aria-label="Edad" placeholder="Escribe tu edad" min={LIMITES.edad.min} max={LIMITES.edad.max} step={1} value={edadNueva} onChange={(e) => setEdadNueva(e.target.value)} required />
                <button type="submit" disabled={guardandoEdad}>{guardandoEdad ? "Guardando..." : "Guardar"}</button>
              </form>
            )}
            <p>Apoyo de cuidador</p>
          </div>
          <Link href="/ayudante" className="btnRegistrarAyudante">
            {ayudante ? `${ayudante.nombre} (${ETIQUETA_RELACION[ayudante.relacion]})` : "Ninguno registrado"}
            <span>+</span>
          </Link>
          {error && <p className="mensajeError" role="alert">{error}</p>}
        </section>
        <section className="fotoPerfil">
          <Image src="/img/perfil.png" alt="Foto de perfil" width={360} height={360} className="iconoPerfil" />
        </section>
        </div>
        <Link href="/detalles" className="btnAgregarMedeicamento" aria-label="Agregar Medicamento">+</Link>
      </main>
    </>
  );
}
