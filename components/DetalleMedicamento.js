"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ModalReporte from "@/components/ModalReporte";
import { obtenerDetalleMedicamento, solicitarMedicamento } from "@/lib/servicios";
import { formatoFecha, ETIQUETA_ESTADO } from "@/lib/formato";

export default function DetalleMedicamento() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}

function Contenido() {
  const router = useRouter();
  const parametros = useSearchParams();
  const id = parametros.get("id");
  const donacionId = parametros.get("donacion");

  const [m, setM] = useState(null);
  const [error, setError] = useState(id ? "" : "No indicaste qué medicamento quieres ver.");
  const [aviso, setAviso] = useState("");
  const [solicitando, setSolicitando] = useState(false);
  const [reportando, setReportando] = useState(false);

  useEffect(() => {
    if (!id) return;
    obtenerDetalleMedicamento(id, donacionId)
      .then(setM)
      .catch((e) => setError(e.message));
  }, [id, donacionId]);

  function volver() {
    if (window.history.length > 1) router.back();
    else router.push("/home");
  }

  async function solicitar() {
    setError("");
    setAviso("");
    setSolicitando(true);
    try {
      await solicitarMedicamento(m.id);
      setM((actual) => ({ ...actual, solicitado: true }));
      setAviso(`Solicitaste ${m.nombre}. Puedes ver el estado en "Mis Donaciones".`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSolicitando(false);
    }
  }

  const d = m?.donacion;
  const puedeSolicitar = m && !m.esMia && !d && m.estado === "DISPONIBLE";
  const puedeEditar = m?.esMia && m.estado === "DISPONIBLE";
  const puedeReportar = d && d.miRol === "RECEPTOR" && ["ACEPTADA", "COMPLETADA"].includes(d.estado);

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

      <main className="detalleMedicamento">
        {error && (
          <p className="mensajeError" role="alert">
            {error}
          </p>
        )}
        {aviso && (
          <p className="mensajeAviso" role="status">
            {aviso}
          </p>
        )}

        {m && (
          <section className="fichaMedicamento">
            <div className="fichaImagen">
              {m.fotoUrl ? (
                <img src={m.fotoUrl} alt={m.nombre} />
              ) : (
                <Image src="/img/medicamento.svg" alt={m.nombre} width={120} height={120} />
              )}
            </div>

            <dl className="fichaDatos">
              <dt>Nombre</dt>
              <dd>{m.nombre}</dd>
              <dt>Registro sanitario (RS)</dt>
              <dd>{m.registroSanitario}</dd>
              <dt>Número de lote</dt>
              <dd>{m.numeroLote}</dd>
              <dt>Caducidad</dt>
              <dd>{formatoFecha(m.fechaCaducidad)}</dd>
              <dt>Punto de entrega</dt>
              <dd>{m.puntoEntrega.nombre}</dd>
              <dt>Dirección</dt>
              <dd>{m.puntoEntrega.direccion}</dd>
              <dt>Ubicación</dt>
              <dd><a href={`https://maps.google.com/?q=${encodeURIComponent(`${m.puntoEntrega.nombre} ${m.puntoEntrega.direccion}`)}`} target = "_blank" rel="noopener noreferrer">Ver en Google Maps</a></dd>
              <dt>Estado</dt>
              <dd>{ETIQUETA_ESTADO[m.estado]}</dd>

              {d && (
                <>
                  <dt>Tu rol</dt>
                  <dd>{d.miRol === "DONANTE" ? "Donante" : "Receptor"}</dd>
                  <dt>Estado de la donación</dt>
                  <dd>{ETIQUETA_ESTADO[d.estado]}</dd>
                  <dt>{d.miRol === "DONANTE" ? "Receptor" : "Donante"}</dt>
                  <dd>{d.contraparte}</dd>
                  {d.aceptadaEn && (
                    <>
                      <dt>Aceptada el</dt>
                      <dd>{formatoFecha(d.aceptadaEn)}</dd>
                    </>
                  )}
                </>
              )}
            </dl>

            <div className="fichaAcciones">
              <button type="button" className="btnTarjeta secundario" onClick={volver}>
                Volver
              </button>
              {puedeSolicitar && (
                <button type="button" className="btnTarjeta" disabled={m.solicitado || solicitando} onClick={solicitar}>
                  {m.solicitado ? "Solicitado" : solicitando ? "Solicitando..." : "Solicitar"}
                </button>
              )}
              {puedeEditar && (
                <Link href={`/reNamePubli?id=${m.id}`} className="btnTarjeta">
                  Editar
                </Link>
              )}
              {puedeReportar && (
                <button type="button" className="btnTarjeta secundario" onClick={() => setReportando(true)}>
                  Reportar
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      {reportando && d && (
        <ModalReporte
          publicacionId={m.id}
          contraparte={d.contraparte}
          medicamento={m.nombre}
          onCerrar={() => setReportando(false)}
          onEnviado={() => {
            setReportando(false);
            setAviso("Tu reporte fue enviado al administrador.");
          }}
        />
      )}
    </>
  );
}