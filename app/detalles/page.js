"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormularioMedicamento from "@/components/FormularioMedicamento";
import { publicarMedicamento } from "@/lib/servicios";

export default function NuevoMedicamento() {
  const router = useRouter();

  async function publicar(datos) {
    await publicarMedicamento(datos);
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
        <FormularioMedicamento titulo="Nuevo medicamento" onEnviar={publicar} cancelarHref="/home" />
      </main>
    </>
  );
}
