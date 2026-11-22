"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { leerRol } from "@/lib/api";

const INICIO = { usuario: "/home", admin: "/admin", ong: "/ong" };

export default function RequiereSesion({ rol, children }) {
  const router = useRouter();
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    const actual = leerRol();
    if (!localStorage.getItem("token") || !actual) {
      router.replace("/login");
    } else if (actual !== rol) {
      router.replace(INICIO[actual] || "/login");
    } else {
      setPermitido(true);
    }
  }, [rol, router]);

  return permitido ? children : null;
}