import Image from "next/image";
import Link from "next/link";
import VideoFondo from "@/components/VideoFondo";

export default function Inicio() {
  return (
    <>
      <header className="logo">
        <Image src="/img/logo.png" alt="Aidora" width={80} height={40} style={{ height: 40, width: "auto" }} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/login" className="btnSesion">Acceder</Link>
          <Link href="/registro" className="btnSesion">Iniciar sesión</Link>
        </nav>
      </header>

      <section className="seccion-index">
        <VideoFondo />

        <h1 className="tituloGrande">
          Conecta con personas que <br />
          tengan medicamentos que <br />
          necesitas
        </h1>
        <br /><br />
        <p>Unete a nuestra comunidad de aidora</p>
        <br /><br />
        <Link href="/login" className="IniciarSesion">Iniciar sesion</Link>
      </section>

      <section className="descripcion">
        <div className="columnaUno">
          <h1>Reducir desperdicio</h1> &nbsp; <h1>Conectar esperanza</h1> <br /><br />

          <p className="parrafo">
            Aidora es una plataforma web y móvil que conecta a personas que
            desean donar medicamentos especializados no utilizados con pacientes
            de enfermedades crónicas que enfrentan desabasto en instituciones
            públicas en México. Incorporamos validaciones digitales para
            garantizar que las donaciones sean seguras y legales.
          </p>
          <br />
          <p className="parrafo">
            La plataforma prioriza la verificación del Registro Sanitario
            (COFEPRIS), la fecha de caducidad y la clasificación legal
            medicamento para asegurar que solo se canalicen fármacos no controlados
            y en condiciones adecuadas.
          </p>
        </div>

        <div className="columnaDos">
          <Image src="/img/images.jpeg" alt="Medicamentos" width={500} height={400} style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </section>

      <footer className="footerTodo">
        <div>
          <p>
            Nombre de los intregantes:<br />
            Lopez Díaz Dereck Mauricio<br />
            Moreno Maldonado Alejandro<br />
            Perez Garcia Daniel Esteban<br />
            Salgado Barrera Adrik<br />
          </p>
        </div>
        <div>
          <h3>Aidora</h3>
          <br />
          <p>Salvaguardando tu calidad de vida</p>
        </div>
      </footer>
    </>
  );
}
