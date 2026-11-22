"use client";

import Link from "next/link";
import { cerrarSesion } from "@/lib/servicios";

export default function BotonCerrarSesion({ className }) {
  return (
    <Link href="/login" className={className} onClick={() => { cerrarSesion().catch(() => {}); }}>
      Cerrar sesión
    </Link>
  );
}