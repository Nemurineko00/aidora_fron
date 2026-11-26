"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VideoFondo from "@/components/VideoFondo";
import BotonVolver from "@/components/BotonVolver";
import { registrar } from "@/lib/servicios";
import { validar, primerError, LIMITES } from "@/lib/validaciones";

export default function Registro() {
  const router = useRouter();
  const [datos, setDatos] = useState({ usuario: "", contrasena: "", correo: "", nombre: "", apellidoP: "", apellidoM: "", edad: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }));

      async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const falla = primerError(validar.usuario(datos.usuario), validar.edad(datos.edad));
    if (falla) return setError(falla);
    setEnviando(true);
    try {
      await registrar({
        nombre: datos.nombre,
        apellidoPaterno: datos.apellidoP,
        apellidoMaterno: datos.apellidoM,
        correo: datos.correo,
        edad: datos.edad,
        password: datos.contrasena,
      });
      router.push("/home");
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }
  return (
    <div className="login-page">
      <VideoFondo />
      <BotonVolver />

      <section>
        <div className="logoLoggin">
          <Image src="/img/logo.png" alt="Aidora" width={335} height={250} />
          <h1 className="tituloMasGrande">Aidora</h1>
        </div>
      </section>

      <section className="columna-login">
        <div>
          <h1 className="tituloGrande">Aidora</h1>
        </div>

        <div className="bloqueFromulario">
          <form onSubmit={handleSubmit}>
            <h2>Regístrate</h2>

            <div className="formulario">
              <label htmlFor="usuario">Nombre de Usuario</label><br />
              <input type="text" id="usuario" placeholder="juanitopro777" value={datos.usuario} onChange={cambiar("usuario")} required minLength={LIMITES.usuario.min} maxLength={LIMITES.usuario.max} />
            </div>
            <div className="formulario">
              <label htmlFor="contrasena">Contraseña</label><br />
              <input type="password" id="contrasena" placeholder="Ingrese su contraseña" value={datos.contrasena} onChange={cambiar("contrasena")} required minLength={LIMITES.contrasena.min} maxLength={LIMITES.contrasena.max} />
              <small>Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo, sin espacios.</small>
            </div>
            <div className="formulario">
              <label htmlFor="correo">Correo</label><br />
              <input type="email" id="correo" placeholder="Email" value={datos.correo} onChange={cambiar("correo")} required maxLength={LIMITES.correo.max} />
            </div>
            <div className="formulario">
              <label htmlFor="nombre">Nombre</label><br />
              <input type="text" id="nombre" placeholder="Nombre" value={datos.nombre} onChange={cambiar("nombre")} required minLength={LIMITES.nombrePersona.min} maxLength={LIMITES.nombrePersona.max} />
            </div>
            <div className="formulario">
              <label htmlFor="apellidoP">Apellido Paterno</label><br />
              <input type="text" id="apellidoP" value={datos.apellidoP} onChange={cambiar("apellidoP")} required minLength={LIMITES.nombrePersona.min} maxLength={LIMITES.nombrePersona.max} />
            </div>
            <div className="formulario">
              <label htmlFor="apellidoM">Apellido Materno</label><br />
              <input type="text" id="apellidoM" value={datos.apellidoM} onChange={cambiar("apellidoM")} required minLength={LIMITES.nombrePersona.min} maxLength={LIMITES.nombrePersona.max} />
            </div>
            <div className="formulario">
              <label htmlFor="edad">Edad</label><br />
              <input type="number" id="edad" min={LIMITES.edad.min} max={LIMITES.edad.max} step={1} value={datos.edad} onChange={cambiar("edad")} required />
            </div>
            <div className="formulario">
              <p><strong>¿Ya tienes una cuenta?</strong><Link href="/login">Inicia sesión</Link></p>
            </div>

            {error && <p className="mensajeError" role="alert">{error}</p>}

            <button type="submit" className="IniciarSesion" disabled={enviando}>
              {enviando ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
