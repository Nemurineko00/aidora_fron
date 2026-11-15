"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { obtenerAyudante, guardarAyudante } from "@/lib/servicios";

export default function RegistrarAyudante() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [relacion, setRelacion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Si ya hay un ayudante registrado, se muestra para poder cambiarlo
  useEffect(() => {
    obtenerAyudante()
      .then((ayudante) => {
        if (ayudante) {
          setNombre(ayudante.nombre);
          setRelacion(ayudante.relacion);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  async function handleSumit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await guardarAyudante({ nombre, relacion });
      router.push("/sesion");
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <>
      <header className="logo headerHome">
        <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/misDonaciones">Mis Donaciones</Link>
          <Link href="/misPublicaciones">Mis Publicaciones</Link>
          <Link href="/sesion" className="linkPerfil"><Image src="/img/perfil.png" alt="Perfil" width={60} height={60} /></Link>
        </nav>
      </header>
      <main className="main-ayudante">
        <form className="form-ayudante" onSubmit={handleSumit}>
          <section className="secision-ayudante">
            <label htmlFor="nombre">Nombre del ayudante</label>
            <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={100} />
            <label htmlFor="apoyo">Relacion del ayudante</label>

            <select id="apoyo" name="apoyo" value={relacion} onChange={(e) => setRelacion(e.target.value)} required>
              <option value="" disabled hidden>-</option>
              <option value="cuidador">Cuidador</option>
              <option value="familiar">Familiar</option>
              <option value="conocido">Conocido</option>
            </select>
            <p className="nota">Nota: Tu ayudante podra recoger el medicamneto por ti</p>
          </section>
          {error && <p className="mensajeError" role="alert">{error}</p>}
          <button type="submit" className="IniciarSesion" disabled={enviando}>
            {enviando ? "Guardando..." : "Registrar"}
          </button>
        </form>
        <Link href="/detalles" className="IniciarSesion" aria-label="Agregar Medicamento">+</Link>
      </main>
    </>
  );
}
