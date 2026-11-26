"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cerrarSesion } from "@/lib/servicios";

export default function BotonCerrarSesion({ className }) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  async function salir(e) {
    e.preventDefault();
    if (saliendo) return;
    setSaliendo(true);
    try {
      await cerrarSesion();
    } catch {}
    router.replace("/login");
  }

  return (
    <Link href="/login" className={className} onClick={salir} aria-disabled={saliendo}>
      {saliendo ? "Cerrando..." : "Cerrar sesión"}
    </Link>
  );
}
