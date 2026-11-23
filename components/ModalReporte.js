"use client";

import { useEffect, useState } from "react";
import { crearReporte } from "@/lib/servicios";

const TIPOS = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

export default function ModalReporte({ publicacionId, contraparte, medicamento, onCerrar, onEnviado }) {
  const [motivo, setMotivo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCerrar]);

  function elegirImagen(e) {
    const archivo = e.target.files?.[0] ?? null;
    if (archivo && !TIPOS.includes(archivo.type)) {
      setError("La imagen debe ser PNG, JPG o WEBP");
      e.target.value = "";
      return setImagen(null);
    }
    if (archivo && archivo.size > MAX_BYTES) {
      setError("La imagen no debe pesar más de 5 MB");
      e.target.value = "";
      return setImagen(null);
    }
    setError("");
    setImagen(archivo);
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await crearReporte({ publicacionId, motivo, imagen });
      onEnviado();
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className="modalFondo" role="dialog" aria-modal="true" aria-labelledby="tituloReporte">
      <form className="modalCaja" onSubmit={enviar}>
        <h2 id="tituloReporte">Reportar a {contraparte}</h2>
        <p>Medicamento: {medicamento}</p>

        <label htmlFor="motivoReporte">Motivo del reporte</label>
        <textarea
          id="motivoReporte"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          maxLength={300}
          required
          placeholder="Ej. El lote es diferente al publicado"
        />

        <label htmlFor="imagenReporte">Imagen de evidencia (opcional)</label>
        <input id="imagenReporte" type="file" accept="image/png, image/jpeg, image/webp" onChange={elegirImagen} />

        {error && (
          <p className="mensajeError" role="alert">
            {error}
          </p>
        )}

        <div className="accionesDonacion">
          <button type="button" className="btnPildora" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="btnPildora" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar reporte"}
          </button>
        </div>
      </form>
    </div>
  );
}
