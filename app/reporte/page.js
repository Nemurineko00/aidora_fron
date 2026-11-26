"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

import Image from "next/image";
import Link from "next/link";
import { validar, limpiar } from "@/lib/validaciones";

const MOTIVOS = [
  "Medicamento caducado",
  "Medicamento en mal estado",
  "Información incorrecta en la publicación",
  "Comportamiento inapropiado del usuario",
  "Publicación fraudulenta",
];

const MAX_BYTES = 5 * 1024 * 1024; 
const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/webp"];


export default function ReportarIncidencia() {
  return (
    <Suspense fallback={null}>
      <Formulario />
    </Suspense>
  );
}

function Formulario() {
  const router = useRouter();
  const idPub = useSearchParams().get("pub");

  const [motivos, setMotivos] = useState([]);
  const [otro, setOtro] = useState(false);
  const [otroTexto, setOtroTexto] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const toggleMotivo = (motivo) => {
    setMotivos((actuales) =>
      actuales.includes(motivo)
        ? actuales.filter((m) => m !== motivo)
        : [...actuales, motivo]
    );
  };

  const handleFoto = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      setError("La imagen debe ser PNG, JPG o WEBP.");
      e.target.value = "";
      return;
    }
    if (archivo.size > MAX_BYTES) {
      setError("La imagen no puede pesar más de 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setFoto(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const motivosFinales = [...motivos];
    if (otro) {
      const falla = validar.motivoOtro(otroTexto);
      if (falla) {
        setError(`${falla} (campo “Otro”).`);
        return;
      }
      motivosFinales.push(`Otro: ${limpiar(otroTexto)}`);
    }

    if (motivosFinales.length === 0) {
      setError("Selecciona al menos un motivo.");
      return;
    }
    if (!idPub) {
      setError("No sabemos qué publicación quieres reportar. Entra desde la publicación.");
      return;
    }

    const datos = new FormData();
     datos.append("id_pub", idPub);
    datos.append("motivos", JSON.stringify(motivosFinales));
    if (foto) datos.append("foto", foto);

    try {
      setEnviando(true);
      await api("/reportes", { metodo: "POST", formData: datos });
      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <header className="logo headerHome">
  <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
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
                  minLength={5}
                  maxLength={300}
                  placeholder="Describe el problema"
                />
              </div>
            </fieldset>

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

              <label htmlFor="foto" className="btnFoto">
                <span>Subir foto</span>
                <span className="mas">+</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="errorReporte" role="alert">
              {error}
            </p>
          )}

          <div className="botonesReporte">
            <Link href="/detalles" className="enviar">
              Cerrar
            </Link>
            <button type="submit" className="enviar" disabled={enviando}>
              {enviando ? "Enviando..." : "Reportar"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}