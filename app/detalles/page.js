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
      <header className="logo headerHome">
  <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/misDonaciones">Mis Donaciones</Link>
          <Link href="/misPublicaciones">Mis Publicaciones</Link>
          <Link href="/sesion" className="linkPerfil">
            <Image src="/img/perfil.png" alt="Perfil" width={60} height={60}/>          
          </Link>
        </nav>
      </header>

      <main>
        <FormularioMedicamento titulo="Nuevo medicamento" onEnviar={publicar} cancelarHref="/home" />
      </main>
    </>
  );
}
