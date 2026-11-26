"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FormularioMedicamento from "@/components/FormularioMedicamento";
import { obtenerPublicacion, actualizarPublicacion } from "@/lib/servicios";

export default function DetallePublicacion() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}

function Contenido() {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const [inicial, setInicial] = useState(null);
  const [error, setError] = useState(id ? "" : "No indicaste qué publicación editar.");

  useEffect(() => {
    if (!id) return;
    obtenerPublicacion(id)
      .then(setInicial)
      .catch((e) => setError(e.message));
  }, [id]);

  async function guardar(datos) {
    await actualizarPublicacion(id, datos);
    router.push("/misPublicaciones");
  }

  return (
    <>
      <header className="headerHome">
  <Image src="/img/logo.png" alt="Aidora" width={80} height={80} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/misDonaciones">Mis Donaciones</Link>
          <Link href="/misPublicaciones">Mis Publicaciones</Link>
        </nav>
      </header>

      <main>
        {error ? (
          <section className="Nuevomediform">
            <p className="mensajeError" role="alert">{error}</p>
            <Link href="/misPublicaciones" className="enlaceCancelar">Volver a mis publicaciones</Link>
          </section>
        ) : inicial ? (
          <FormularioMedicamento titulo="Detalle publicación" inicial={inicial} onEnviar={guardar} cancelarHref="/misPublicaciones" />
        ) : null}
      </main>
    </>
  );
}
