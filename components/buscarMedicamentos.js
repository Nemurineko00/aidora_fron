"use client";

import { useState } from "react";
import TarjetaMedicamento from "./targertaMedicamento";

export default function BuscadorMedicamentos({
  medicamentos,
  cargando = false,
  error = "",
  aviso = "",
  vacio = "No hay medicamentos para mostrar.",
  renderAcciones,
}) {
  const [busqueda, setBusqueda] = useState("");

  const texto = busqueda.toLowerCase().trim();
  const filtrados = medicamentos.filter(
    (m) => String(m.nombre ?? "").toLowerCase().includes(texto) || String(m.rs ?? "").toLowerCase().includes(texto)
  );

  return (
    <>
      <div className="barraBusqueda">
        <input
          type="search"
          placeholder="Buscar por nombre o registro sanitario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar medicamentos"
        />
      </div>

      <main className="listaMedicamentos">
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
        {cargando ? (
          <p className="sinResultados">Cargando...</p>
        ) : filtrados.length > 0 ? (
          filtrados.map((m) => (
              <TarjetaMedicamento key={m.id} nombre={m.nombre} rs={m.rs} imagen={m.imagen} href={m.href} detalles={m.detalles}>
              {renderAcciones ? renderAcciones(m) : null}
            </TarjetaMedicamento>
          ))
        ) : (
          <p className="sinResultados">{medicamentos.length === 0 ? vacio : "No se encontraron medicamentos."}</p>
        )}
      </main>
    </>
  );
}
