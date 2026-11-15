import Image from "next/image";
import Link from "next/link";

export default function SolicitarMedicamento(){
    return(
        <>
            <header className="headerHome">
                <Image src="/img/logo.png" alt="Aidora" width={80} height={80} />
                <h2>Aidora</h2>
                <nav>
                    <Link href="/home">Buscar medicamentos</Link>
                    <Link href="/home">Mis Donaciones</Link>
                    <Link href="/home">Mis Publicaciones</Link>
                </nav>
            </header>

            <main>
                <section className="Nuevomediform">
                    <h1>Solicitar medicamento</h1>

                    <div className="Campoentrada">
                        <p>Nombre del medicamento</p>
                    </div>

                    <div className="Campoentrada">
                        <p>Número de lote</p>
                    </div>

                    <div className="Campoentrada">
                        <p>Fecha de caducidad</p>
                    </div>

                    <div className="Campoentrada">
                        <p>Código de Registro Sanitario(RS)</p>
                    </div>

                    <label htmlFor="Puntoentrega">Punto de entrega:</label>
                    <select id="Puntoentrega" name="punto_entrega" defaultValue="" required>
                        <option value="" disabled>Selecciona uno</option>
                    </select>

                    <div className="previewFoto">
                        <span>Sin foto</span>
                    </div>

                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        accept="image/png, image/jpeg, image/webp"
                        hidden/>

                    <Link href="/home" className="btnFoto"><span className="mas">+</span>
                    <span>Agregar foto</span> </Link>
              
                    <Link href="/detalles" className="enviar"> Cerrar </Link>  
                    <Link href="/detalles" className="enviar"> Solicitar </Link>
            
                </section>
            </main>
        </>
    )
}