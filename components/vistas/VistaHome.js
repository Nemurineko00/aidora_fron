"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BuscadorMedicamentos from "@/components/buscarMedicamentos";
import { listarMedicamentosDisponibles, solicitarMedicamento } from "@/lib/servicios";

export default function VistaHome() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [solicitando, setSolicitando] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setMedicamentos(await listarMedicamentosDisponibles());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function solicitar(m) {
    setError("");
    setAviso("");
    setSolicitando(m.id);
    try {
      await solicitarMedicamento(m.id);
      setMedicamentos((lista) => lista.map((x) => (x.id === m.id ? { ...x, solicitado: true } : x)));
      setAviso(`Solicitaste ${m.nombre}. Puedes ver el estado en "Mis Donaciones".`);
    } catch (e) {
      setError(e.message);
      cargar();
    } finally {
      setSolicitando(null);
    }
  }

  const lista = medicamentos.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    rs: m.registroSanitario,
    imagen: m.fotoUrl,
    href: `/detPublicacion?id=${m.id}`,
    solicitado: m.solicitado,
  }));

  return (
    <>
      <header className="logo headerHome">
        <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/misDonaciones">Mis Donaciones</Link>
          <Link href="/misPublicaciones">Mis Publicaciones</Link>
          <Link href="/sesion" className="linkPerfil">
            <Image src="/img/perfil.png" alt="Perfil" width={60} height={60} />
          </Link>
        </nav>
      </header>

      <BuscadorMedicamentos
        medicamentos={lista}
        cargando={cargando}
        error={error}
        aviso={aviso}
        vacio="No hay medicamentos disponibles por ahora."
        renderAcciones={(m) => (
          <button type="button" className="btnTarjeta" disabled={m.solicitado || solicitando === m.id} onClick={() => solicitar(m)}>
            {m.solicitado ? "Solicitado" : solicitando === m.id ? "Solicitando..." : "Solicitar"}
          </button>
        )}
      />

      <Link href="/detalles" className="btnAgregarMedeicamento" aria-label="Agregar Medicamento">+</Link>
    </>
  );
}
