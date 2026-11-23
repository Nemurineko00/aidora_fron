"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { listarPuntosEntrega } from "@/lib/servicios";

const TIPOS = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const mananaISO = () => new Date(Date.now() + 864e5).toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });

export default function FormularioMedicamento({ titulo, inicial, cancelarHref, onEnviar }) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [lote, setLote] = useState(inicial?.numeroLote ?? "");
  const [caducidad, setCaducidad] = useState(inicial?.fechaCaducidad ?? "");
  const [rs, setRs] = useState(inicial?.registroSanitario ?? "");
  const [punto, setPunto] = useState(inicial ? String(inicial.puntoEntrega.id) : "");
  const [cantidad, setCantidad] = useState(String(inicial?.cantidad ?? 1));
  const [puntos, setPuntos] = useState([]);
  const [foto, setFoto] = useState(null);
  const [vistaLocal, setVistaLocal] = useState(null);
  const [errorFoto, setErrorFoto] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const entradaFoto = useRef(null);

  useEffect(() => {
    listarPuntosEntrega()
      .then(setPuntos)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    return () => {
      if (vistaLocal) URL.revokeObjectURL(vistaLocal);
    };
  }, [vistaLocal]);

  function elegirFoto(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!TIPOS.includes(archivo.type)) {
      setErrorFoto("La foto debe ser PNG, JPG o WEBP");
      e.target.value = "";
      return;
    }
    if (archivo.size > MAX_BYTES) {
      setErrorFoto("La foto no debe pesar más de 5 MB");
      e.target.value = "";
      return;
    }
    setErrorFoto("");
    setFoto(archivo);
    setVistaLocal(URL.createObjectURL(archivo));
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await onEnviar({ nombre, numeroLote: lote, fechaCaducidad: caducidad, registroSanitario: rs, puntoEntregaId: punto, cantidad: Number(cantidad), foto });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  const vista = vistaLocal ?? inicial?.fotoUrl ?? null;

  return (
    <section className="Nuevomediform">
      <h1>{titulo}</h1>

      <form onSubmit={enviar}>
        <div className="Campoentrada">
          <label htmlFor="nombre">Nombre del medicamento</label>
          <input type="text" name="nombre" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={150} />
        </div>

        <div className="Campoentrada">
          <label htmlFor="numerolote">Número de lote</label>
          <input type="text" name="numerolote" id="numerolote" value={lote} onChange={(e) => setLote(e.target.value)} required maxLength={60} />
        </div>

        <div className="Campoentrada">
          <label htmlFor="fechacaducidad">Fecha de caducidad</label>
          <input
            type="date"
            name="fechacaducidad"
            id="fechacaducidad"
            value={caducidad}
            onChange={(e) => setCaducidad(e.target.value)}
            min={mananaISO()}
            required
          />
        </div>

        <div className="Campoentrada">
          <label htmlFor="RegistroSanitario">Código de Registro Sanitario(RS)</label>
          <input type="text" name="RegistroSanitario" id="RegistroSanitario" value={rs} onChange={(e) => setRs(e.target.value)} required maxLength={60} />
          <p className="NotaRS">Nota: El RS está impreso en la caja del medicamento</p>
        </div>

        <div className="Campoentrada">
          <label htmlFor="cantidad">Cantidad (piezas o cajas)</label>
          <input type="number" name="cantidad" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min={1} step={1} required />
        </div>

        <label htmlFor="Puntoentrega">Selecciona un punto de entrega:</label>
        <select id="Puntoentrega" name="punto_entrega" value={punto} onChange={(e) => setPunto(e.target.value)} required>
          <option value="" disabled>
            Selecciona uno
          </option>
          {puntos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <div className="previewFoto">{vista ? <img src={vista} alt="Vista previa del medicamento" /> : <span>Sin foto</span>}</div>

        <input ref={entradaFoto} type="file" id="foto" name="foto" accept="image/png, image/jpeg, image/webp" hidden onChange={elegirFoto} />

        <button type="button" className="btnFoto" onClick={() => entradaFoto.current?.click()}>
          <span className="mas">+</span>
          <span>{vista ? "Cambiar foto" : "Agregar foto"}</span>
        </button>
        {errorFoto && <p className="errorFoto">{errorFoto}</p>}

        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar"}
        </button>

        {error && (
          <p className="mensajeError" role="alert">
            {error}
          </p>
        )}
        {cancelarHref && (
          <Link href={cancelarHref} className="enlaceCancelar">
            Cancelar
          </Link>
        )}
      </form>
    </section>
  );
}
