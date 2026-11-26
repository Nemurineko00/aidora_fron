"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import { useRouter } from "next/navigation";
import { obtenerOng, obtenerDonacionOng, actualizarEstadoOng, terminarCiclo as terminarCicloServicio } from "@/lib/servicios";
import { formatoFecha, formatoHora } from "@/lib/formato";

export default function DetalleDonacion({ id }) {
  const router = useRouter();
  const [ong, setOng] = useState(null);
  const [donacion, setDonacion] = useState(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerOng().then(setOng);
    obtenerDonacionOng(id)
      .then(setDonacion)
      .catch((e) => setError(e.message));
  }, [id]);

  const completada = donacion?.estado === "COMPLETADA";
  const puedeTerminar = Boolean(donacion?.entregado && donacion?.recibido) && !completada;

  async function alternar(campo) {
    setError("");
    setGuardando(true);
    try {
      const datos = await actualizarEstadoOng(id, { [campo]: !donacion[campo] });
      setDonacion((d) => ({ ...d, entregado: datos.entregado, recibido: datos.recibido }));
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function terminarCiclo() {
    if (!puedeTerminar) return;
    setError("");
    try {
      await terminarCicloServicio(id);
      router.push("/recepcionONG");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <header className="headerAdmin">
        <div className="headerAdminMarca">
          <Image src="/img/iconoAidora.png" alt="Aidora" width={64} height={64} className="logoAdmin" />
          <div>
            <h2>Aidora</h2>
            <p>Bienvenido &quot;{ong?.nombre ?? "ONG/HOSPITAL"}&quot;</p>
          </div>
        </div>
        <Link href="/login" className="cerrarSesionAdmin">
          Cerrar sesión
        </Link>
      </header>

      <main className="mainAdmin">
        {!donacion ? (
          <section className="panelDonacion">
            {error ? (
              <>
                <p className="mensajeError" role="alert">
                  {error}
                </p>
                <div className="accionesDonacion">
                  <Link href="/recepcionONG" className="btnPildora">
                    Cerrar
                  </Link>
                </div>
              </>
            ) : (
              <p>Cargando...</p>
            )}
          </section>
        ) : (
          <section className="panelDonacion">
            <div className="filaDonacion">
              <div className="campoDonacion">
                <label htmlFor="donante">Donante</label>
                <input id="donante" type="text" value={donacion.donante.nombre} readOnly />
              </div>
              <button
                type="button"
                className={`pildoraEstado ${donacion.entregado ? "activa" : ""}`}
                aria-pressed={donacion.entregado}
                disabled={completada || guardando}
                onClick={() => alternar("entregado")}
              >
                Entregado
              </button>
            </div>

            <div className="filaDonacion">
              <div className="campoDonacion">
                <label htmlFor="receptor">Receptor</label>
                <input id="receptor" type="text" value={donacion.receptor.nombre} readOnly />
              </div>
              <button
                type="button"
                className={`pildoraEstado ${donacion.recibido ? "activa" : ""}`}
                aria-pressed={donacion.recibido}
                disabled={completada || guardando}
                onClick={() => alternar("recibido")}
              >
                Recibido
              </button>
            </div>

            <div className="filaFechaHora">
              <div className="campoDonacion">
                <label htmlFor="fecha">Fecha</label>
                <input id="fecha" type="text" value={formatoFecha(donacion.aceptadaEn)} readOnly />
              </div>
              <div className="campoDonacion">
                <label htmlFor="hora">Hora</label>
                <input id="hora" type="text" value={formatoHora(donacion.aceptadaEn)} readOnly />
              </div>
            </div>

            {error && (
              <p className="mensajeError" role="alert">
                {error}
              </p>
            )}

            <div className="accionesDonacion">
              <Link href="/recepcionONG" className="btnPildora">
                Cerrar
              </Link>
              <button
                type="button"
                className="btnPildora"
                disabled={!puedeTerminar}
                onClick={terminarCiclo}
                title={completada ? "Este ciclo ya terminó" : puedeTerminar ? "" : "Confirma la entrega y la recepción primero"}
              >
                {completada ? "Ciclo terminado" : "Terminar ciclo"}
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
