"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VideoFondo from "@/components/VideoFondo";
import BotonVolver from "@/components/BotonVolver";
import { iniciarSesion, iniciarSesionAdmin, iniciarSesionOng } from "@/lib/servicios";

export default function Login() {
  const router = useRouter();
  const [rol, setRol] = useState("usuario");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
            if (rol === "admin") {
        await iniciarSesionAdmin(correo, contrasena);
        router.push("/admin");
      } else if (rol === "ong") {
        await iniciarSesionOng(correo, contrasena);
        router.push("/ong");
      } else {
        await iniciarSesion(correo, contrasena);
        router.push("/home");
      }
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
        <div className="TituloSeccion">
          <h1 className="tituloGrande">Aidora</h1>
        </div>

        <div className="bloqueFromulario">
          <form onSubmit={handleSubmit}>
            <h2>Iniciar sesion</h2>

                        <div className="formulario">
              <label htmlFor="rol">Entrar como</label><br />
              <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="ong">ONG u hospital</option>
              </select>
            </div>
            <div className="formulario">
              <label htmlFor="correo">{rol === "ong" ? "Clave de la ONG" : "Correo"}</label><br />
              <input type={rol === "ong" ? "text" : "email"} id="correo" placeholder={rol === "ong" ? "Clave" : "Email"} value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
            <div className="formulario">
              <label htmlFor="contrasena">Contraseña</label><br />
              <input type="password" id="contrasena" placeholder="Ingrese su contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
            </div>
            <div className="formulario">
              <p><strong>¿No tienes una cuenta?</strong><Link href="/registro">Registrate</Link></p>
            </div>

            {error && <p className="mensajeError" role="alert">{error}</p>}

            <button type="submit" className="IniciarSesion" disabled={enviando}>
              {enviando ? "Entrando..." : "Iniciar sesion"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
