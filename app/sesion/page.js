"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import { obtenerPerfil } from "@/lib/servicios";
import { ETIQUETA_RELACION } from "@/lib/formato";

export default function Sesion() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerPerfil()
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, []);

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
            <p className="contenedor">{u?.edad}</p>
            <p>Apoyo de cuidador</p>
          </div>
          <Link href="/ayudante" className="btnRegistrarAyudante">
            {ayudante ? `${ayudante.nombre} (${ETIQUETA_RELACION[ayudante.relacion]})` : "Ninguno registrado"}
            <span>+</span>
          </Link>
          {error && <p className="mensajeError" role="alert">{error}</p>}
        </section>
        <Link href="/detalles" className="btnAgregarMedeicamento" aria-label="Agregar Medicamento">+</Link>
        <section>
          <div>
            <Image src="/img/perfil.png" alt="Foto de perfil" width={360} height={360} className="iconoPerfil" />
          </div>
        </section>
      </main>
    </>
  );
}
