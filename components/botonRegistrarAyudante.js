import Image from "next/image";
import Link from "next/link";

export default function botonRegistrarAyudante() {
  return (
    <>
    <header className="logo headerHome">
        <Image src="/img/logo.png" alt="Aidora" width={160} height={80} style={{ height: 80, width: "auto" }} />
        <h2>Aidora</h2>
        <nav>
          <Link href="/home">Buscar medicamentos</Link>
          <Link href="/home">Mis Donaciones</Link>
          <Link href="/home">Mis Publicaciones</Link>
        </nav>
      </header>
      <main>
        <section className="Nuevo">
          <h1>Registrar ayudante</h1>
          <form action="">
            <label htmlFor="nombre">Nombre completo del ayudante</label>
            <input type="text" name="nombre" id="nombre"/>
            <label htnlFor="Relacion">Relación contigo</label> 
            <select id="apoyo" name="apoyo">
              <option value="mx">Cuidador</option>
              <option value="co">Familiar</option>
              <option value="ar">Conocido</option>
            </select>   
            <p className="NotaRS">Nota: Tu ayudante podrá recoger el medicamento en tu lugar</p>  
          </form>
        </section>
      </main>
    </>  
  );
}
