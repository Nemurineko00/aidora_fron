"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BuscadorMedicamentos from "@/components/buscarMedicamentos";
import { listarMisPublicaciones, aceptarSolicitud, rechazarSolicitud } from "@/lib/servicios";
import { ETIQUETA_ESTADO } from "@/lib/formato";

export default function VistaMisPublicaciones() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setMedicamentos(await listarMisPublicaciones());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function atender(solicitudId, accion) {
    setError("");
    setOcupado(solicitudId);
    try {
      if (accion === "aceptar") await aceptarSolicitud(solicitudId);
      else await rechazarSolicitud(solicitudId);
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupado(null);
      cargar();
    }
  }

    const lista = medicamentos.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    rs: m.registroSanitario,
    imagen: m.fotoUrl,
    href: `/detPublicacion?id=${m.id}`,
    original: m,
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
        vacio="Aún no has publicado medicamentos. Usa el botón + para publicar uno."
        renderAcciones={({ original: m }) => (
          <>
            <p className="etiquetaEstado">Estado: {ETIQUETA_ESTADO[m.estado]}</p>
            {m.estado === "DISPONIBLE" && (
              <Link href={`/reNamePubli?id=${m.id}`} className="btnTarjeta">
                Editar
              </Link>
            )}
            {m.solicitudes.map((s) => (
              <div key={s.id} className="solicitud">
                {s.estado === "SOLICITADA" && (
                  <>
                    <p>{s.receptor.usuario} solicitó este medicamento</p>
                    <div className="tarjetaAcciones">
                      <button type="button" className="btnTarjeta" disabled={ocupado === s.id} onClick={() => atender(s.id, "aceptar")}>
                        Aceptar
                      </button>
                      <button type="button" className="btnTarjeta secundario" disabled={ocupado === s.id} onClick={() => atender(s.id, "rechazar")}>
                        Rechazar
                      </button>
                    </div>
                  </>
                )}
                {s.estado === "ACEPTADA" && <p>Aceptaste la solicitud de {s.receptor.usuario}. Falta confirmar la entrega.</p>}
                {s.estado === "COMPLETADA" && <p>Entregado a {s.receptor.usuario}.</p>}
              </div>
            ))}
          </>
        )}
      />

      <Link href="/detalles" className="btnAgregarMedeicamento" aria-label="Agregar Medicamento">+</Link>
    </>
  );
}
