"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

export default function ReportarIncidencia(){
    const router =useRouter();
    return(
        <>
      <header className="headerHome">
        <Image src="/img/logo.png" alt="Aidora" width={80} height={80} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/home">Mis donaciones</Link>
          <Link href="/home">Mis Publicaciones</Link>
        </nav>
      </header>

      <main>
        <form className="Reportmediform" onSubmit={handleSubmit}>
          <div className="bannerReporte">
            <h1>Reportar incidencia</h1>
          </div>

          <div className="reporteContenido">
            {}
            <fieldset className="motivosReporte">
              <legend>Ingrese el motivo del reporte</legend>

              {MOTIVOS.map((motivo) => (
                <div className="checkBoxReporte" key={motivo}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={motivos.includes(motivo)}
                      onChange={() => toggleMotivo(motivo)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span>{motivo}</span>
                  </label>
                </div>
              ))}

              <div className="checkBoxReporte">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={otro}
                    onChange={(e) => setOtro(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>Otro:</span>
                </label>
                <input
                  type="text"
                  className="inputOtro"
                  value={otroTexto}
                  onChange={(e) => setOtroTexto(e.target.value)}
                  disabled={!otro}
                  placeholder="Describe el problema"
                />
              </div>
            </fieldset>

            {}
            <div className="evidenciaReporte">
              <p>Adjunte imagen de evidencia</p>

              <div className="previewFoto">
                {preview ? (
                  <img src={preview} alt="Evidencia" />
                ) : (
                  <span>Sin foto</span>
                )}
              </div>

              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFoto}
                hidden
              />

              {}
              <label htmlFor="foto" className="btnFoto">
                <span>Subir foto</span>
                <span className="mas">+</span>
              </label>
            </div>
          </div>

          <div className="botonesReporte">
            <Link href="/detalles" className="enviar">
              Cerrar
            </Link>
            <button type="submit" className="enviar">
              Reportar
            </button>
          </div>
        </form>
      </main>
    </>
    );
}