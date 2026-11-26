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
  const [abierta, setAbierta] = useState(null);
  const [solicitudActiva, setSolicitudActiva] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState("");

  const manana = new Date();

  manana.setDate(manana.getDate() + 1);

  const fechaMinima = manana.toISOString().split("T")[0];

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

  async function atender(solicitudId, accion, fecha = null) {
    setError("");
    setOcupado(solicitudId);
    try {
      if (accion === "aceptar") await aceptarSolicitud(solicitudId, fecha);
      else await rechazarSolicitud(solicitudId);
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupado(null);
      setSolicitudActiva(null);
      setFechaEntrega("");
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
            {m.solicitudes.length === 0 && (
              <p className="sinSolicitudes">
                Sin solicitudes por el momento
              </p>
            )}
            {m.solicitudes.length > 0 && (
              <>
                <p className="cantidadSolicitudes">
                  {m.solicitudes.length} solicitud(es)
                </p>

                <Link href="#" className="linkSolicitudes" onClick={(e) => {e.preventDefault(); setAbierta( abierta === m.id ? null : m.id);}}>
                  {abierta === m.id ? "Ocultar Solicitudes" : `Ver solicitudes (${m.solicitudes.length})`}
                </Link>

                {abierta === m.id && (
                  <div className="contenedorSolicitudes">
                    {m.solicitudes.map((s) =>(
                      <div key = {s.id} className="solicitud">

                        {s.estado === "SOLICITADA" && (
                          <>
                            <p>
                              {s.receptor.usuario} solicito este medicamento
                            </p>

                            <div className="tarjetaAcciones">
                              <button type="button" className="btnTarjeta" disabled={ocupado === s.id} onClick={() => {setSolicitudActiva( solicitudActiva === s.id ? null : s.id); setFechaEntrega("");} }>
                              Aceptar
                              </button>

                              <button type="button" className="btnTarjeta secundario" disabled={ocupado === s.id} onClick={() => atender(s.id, "rechazar")}>
                                Rechazar
                              </button>
                            </div>
                            {
                              solicitudActiva === s.id && (
                                <div className="fechaEntregaBox">
                                  <label>
                                    Fecha de entrega
                                  </label>

                                  <input type="date" value={fechaEntrega} min={fechaMinima} onChange={(e) => setFechaEntrega(e.target.value)}/>
                                  
                                  <button type="button" className="btnTarjeta" disabled={!fechaEntrega || ocupado === s.id} onClick={() => atender(s.id, "aceptar", fechaEntrega)}>
                                      Confrimar fecha
                                  </button>
                                </div>
                              )
                            }
                            </>
                        )}

                        {s.estado === "ACEPTADA" && (
                          <p>
                            Aceptaste la solicitud de {" "}
                            {s.receptor.usuario}. La fecha de entrega fue programada.
                          </p>
                        )}

                        {s.estado === "COMPLETADA" && (
                          <p>
                            Entregado a{" "}
                            {s.receptor.usuario}
                          </p>
                        )}

                        </div>
                    ))}

                    </div>
                )}
              </>
            )}
          </>
        )}
      />

      <Link href="/detalles" className="btnAgregarMedeicamento" aria-label="Agregar Medicamento">+</Link>
    </>
  );
}
